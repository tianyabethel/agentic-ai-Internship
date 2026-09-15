import { validateWithComps } from "./comp-validation.mjs";
import { query } from "./db.mjs";
import { getEmbedding, cosineSimilarity } from "./embedding-utils.mjs";

function buildListingText(listing) {
  return `
    ${listing.L_Type_ || "Property"} in ${listing.L_City}.
    ${listing.L_Keyword2} bedrooms.
    ${listing.LM_Dec_3} bathrooms.
    ${listing.LM_Int2_3} square feet.
    Price: ${listing.L_SystemPrice}.
    ${listing.L_Remarks || ""}
  `;
}

function calculateStructuredScore(target, candidate) {
  let score = 0;

  const priceDifference = Math.abs(target.L_SystemPrice - candidate.L_SystemPrice);

  if (priceDifference < 50000) {
    score += 20;
  } else if (priceDifference < 150000) {
    score += 12;
  } else if (priceDifference < 300000) {
    score += 5;
  }

  if (target.L_Keyword2 === candidate.L_Keyword2) {
    score += 15;
  }

  if (target.L_City === candidate.L_City) {
    score += 15;
  }

  const sqftDifference = Math.abs(target.LM_Int2_3 - candidate.LM_Int2_3);

  if (sqftDifference < 300) {
    score += 10;
  } else if (sqftDifference < 700) {
    score += 5;
  }

  return score;
}

export async function getRecommendations(targetId) {
  const targetRows = await query(`
    SELECT *
    FROM rets_property
    WHERE L_ListingID = ? OR L_DisplayId = ?
    LIMIT 1
  `, [targetId, targetId]);

  const target = targetRows[0];

  if (!target) {
    throw new Error("Target listing was not found.");
  }

  const listings = await query(`
    SELECT *
    FROM rets_property
    WHERE L_Status = 'Active'
      AND L_ListingID <> ?
    ORDER BY
      CASE WHEN L_City = ? THEN 0 ELSE 1 END,
      ABS(L_SystemPrice - ?) ASC,
      ABS(COALESCE(LM_Int2_3, 0) - ?) ASC
    LIMIT 25
  `, [
    target.L_ListingID,
    target.L_City,
    target.L_SystemPrice,
    target.LM_Int2_3,
  ]);

  const targetEmbedding = await getEmbedding(buildListingText(target));

  const recommendations = [];

  for (const candidate of listings) {
    if (candidate.L_ListingID === target.L_ListingID) {
      continue;
    }

    const candidateEmbedding = await getEmbedding(buildListingText(candidate));

    const structuredScore = calculateStructuredScore(target, candidate);

    const semanticSimilarity = cosineSimilarity(targetEmbedding, candidateEmbedding);

    const semanticScore = semanticSimilarity * 40;

    recommendations.push({
      listing: candidate,
      structuredScore,
      semanticSimilarity,
      totalScore: structuredScore + semanticScore,
    });
  }

  recommendations.sort((a, b) => b.totalScore - a.totalScore);

  const topFive = recommendations.slice(0, 5);

  for (const result of topFive) {
    result.compValidation = await validateWithComps(
      result.listing.L_City,
      result.listing.LM_Int2_3,
      result.listing.L_SystemPrice,
    );
  }

  return topFive;
}
