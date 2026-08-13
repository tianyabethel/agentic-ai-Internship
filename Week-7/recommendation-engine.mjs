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
  const listings = await query(`
    SELECT *
    FROM rets_property
    LIMIT 20
  `);

  const target = listings.find((listing) => String(listing.L_ListingID) === String(targetId));

  if (!target) {
    throw new Error("Target listing was not found.");
  }

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
