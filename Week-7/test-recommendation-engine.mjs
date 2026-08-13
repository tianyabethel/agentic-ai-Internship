import { query } from "./db.mjs";
import { getRecommendations } from "./recommendation-engine.mjs";

async function runTest() {
  const targetRows = await query(`
    SELECT *
    FROM rets_property
    LIMIT 1
  `);

  if (targetRows.length === 0) {
    console.log("No listings found.");
    return;
  }

  const targetId = targetRows[0].L_ListingID;

  console.log(`Finding recommendations for listing ${targetId}...`);

  const results = await getRecommendations(targetId);

  results.forEach((result, index) => {
    const listing = result.listing;
    const comps = result.compValidation;

    console.log(`\n${index + 1}. ${listing.L_Address}`);
    console.log(`City: ${listing.L_City}`);
    console.log(`Price: $${listing.L_SystemPrice}`);
    console.log(`Bedrooms: ${listing.L_Keyword2}`);
    console.log(`Square feet: ${listing.LM_Int2_3}`);
    console.log(`Structured score: ${result.structuredScore}`);
    console.log(`Semantic similarity: ${result.semanticSimilarity.toFixed(4)}`);
    console.log(`Total score: ${result.totalScore.toFixed(2)}`);
    console.log(`Comp price: $${comps.compPrice}`);
    console.log(`Comparable sales: ${comps.compCount}`);
    console.log(`Price difference: ${comps.differencePercent}%`);
  });
}

runTest().catch((error) => {
  console.error("Recommendation test failed:", error.message);
});
