import { query } from "./db.mjs";
import { getEmbedding, cosineSimilarity } from "./embedding-utils.mjs";

/*
Safely selects the first available value from a listing.
This helps if your database column names differ slightly.
*/
function firstValue(listing, possibleColumns) {
  for (const column of possibleColumns) {
    const value = listing[column];

    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return value;
    }
  }

  return null;
}

/*
Combines important listing fields into one description.
The embedding represents the meaning of this full text.
*/
export function buildListingText(listing) {
  const listingId = firstValue(listing, ["ListingId", "ListingKey", "L_ListingID", "L_DisplayId"]);

  const propertyType = firstValue(listing, ["PropertySubType", "PropertyType", "L_Type_"]);

  const city = firstValue(listing, ["City", "L_City"]);

  const bedrooms = firstValue(listing, ["BedroomsTotal", "BedsTotal", "L_Keyword2"]);

  const bathrooms = firstValue(listing, [
    "BathroomsTotalInteger",
    "BathroomsTotalDecimal",
    "LM_Dec_3",
  ]);

  const livingArea = firstValue(listing, ["LivingArea", "BuildingAreaTotal", "LM_Int2_3"]);

  const yearBuilt = firstValue(listing, ["YearBuilt"]);

  const price = firstValue(listing, ["ListPrice", "L_SystemPrice"]);

  const remarks = firstValue(listing, ["PublicRemarks", "Remarks", "L_Remarks"]);

  return [
    listingId ? `Listing ID: ${listingId}.` : "",
    propertyType ? `Property type: ${propertyType}.` : "",
    city ? `Located in ${city}, California.` : "",
    bedrooms ? `${bedrooms} bedrooms.` : "",
    bathrooms ? `${bathrooms} bathrooms.` : "",
    livingArea ? `${livingArea} square feet.` : "",
    yearBuilt ? `Built in ${yearBuilt}.` : "",
    price ? `Listed for $${Number(price).toLocaleString("en-US")}.` : "",
    remarks ? `Description: ${remarks}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/*
Loads a limited number of active listings.

Start with a small limit because generating an embedding
for every listing uses API requests.
*/
async function loadActiveListings(limit = 20) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));

  const sql = `
    SELECT *
    FROM california_active
    LIMIT ${safeLimit}
  `;

  return query(sql);
}

/*
Returns the most semantically similar active listings.
*/
export async function findSimilarListings(searchText, options = {}) {
  const topK = Math.max(1, Math.min(Number(options.topK) || 5, 20));

  const listingLimit = Math.max(topK, Math.min(Number(options.listingLimit) || 20, 100));

  if (typeof searchText !== "string" || searchText.trim() === "") {
    throw new Error("Please provide a property description.");
  }

  console.log("Loading active listings...");

  const listings = await loadActiveListings(listingLimit);

  if (!listings || listings.length === 0) {
    return [];
  }

  console.log(`Creating query embedding for: "${searchText}"`);

  const searchEmbedding = await getEmbedding(searchText);

  const scoredListings = [];

  for (let index = 0; index < listings.length; index += 1) {
    const listing = listings[index];
    const listingText = buildListingText(listing);

    console.log(`Creating listing embedding ${index + 1} of ${listings.length}...`);

    const listingEmbedding = await getEmbedding(listingText);

    const similarity = cosineSimilarity(searchEmbedding, listingEmbedding);

    scoredListings.push({
      listing,
      listingText,
      similarity,
    });
  }

  scoredListings.sort((first, second) => second.similarity - first.similarity);

  return scoredListings.slice(0, topK);
}
