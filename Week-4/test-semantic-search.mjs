import { findSimilarListings } from "./semantic-property-search.mjs";

function getListingValue(listing, columns) {
  for (const column of columns) {
    const value = listing[column];

    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return value;
    }
  }

  return "Unavailable";
}

async function runTest() {
  const searchText = "A charming home with mountain views, character, and a spacious backyard";

  console.log("\nUSER:");
  console.log(searchText);

  const results = await findSimilarListings(searchText, {
    topK: 5,
    listingLimit: 20,
  });

  if (results.length === 0) {
    console.log("\nAGENT: No active listings were found.");

    return;
  }

  console.log("\nAGENT: Here are the five most similar listings:\n");

  results.forEach((result, index) => {
    const listing = result.listing;

    const listingId = getListingValue(listing, [
      "ListingId",
      "ListingKey",
      "L_ListingID",
      "L_DisplayId",
    ]);

    const city = getListingValue(listing, ["City", "L_City"]);

    const price = getListingValue(listing, ["ListPrice", "L_SystemPrice"]);

    const bedrooms = getListingValue(listing, ["BedroomsTotal", "BedsTotal", "L_Keyword2"]);

    const propertyType = getListingValue(listing, ["PropertySubType", "PropertyType", "L_Type_"]);

    console.log(`${index + 1}. Listing ${listingId}`);
    console.log(`   City: ${city}`);
    console.log(`   Property type: ${propertyType}`);
    console.log(`   Bedrooms: ${bedrooms}`);

    if (price !== "Unavailable" && Number.isFinite(Number(price))) {
      console.log(`   Price: $${Number(price).toLocaleString("en-US")}`);
    } else {
      console.log(`   Price: ${price}`);
    }

    console.log(`   Similarity score: ${result.similarity.toFixed(4)}`);

    console.log("");
  });
}

runTest().catch((error) => {
  console.error("\nSemantic search test failed:", error.message);
});
