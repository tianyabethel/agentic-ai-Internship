export function validateQuery(message) {
  if (!message || typeof message !== "string") {
    return {
      ok: false,
      message: "Please provide a valid question."
    };
  }

  if (message.trim().length < 3) {
    return {
      ok: false,
      message: "Please provide a more complete real estate question."
    };
  }

  return { ok: true };
}

export function validateRecommendationInput(targetId) {
  if (!targetId) {
    return {
      ok: false,
      message: "A valid listing ID is required for recommendations."
    };
  }

  return { ok: true };
}

export function validateRagResult(result, minimumSimilarity = 0.25) {
  if (!result || !result.sources || result.sources.length === 0) {
    return {
      ok: false,
      message: "I do not have enough information to answer that question."
    };
  }

  const bestSimilarity = result.sources[0].similarity;

  if (bestSimilarity < minimumSimilarity) {
    return {
      ok: false,
      message: "I could not find enough reliable information in the knowledge base."
    };
  }

  return { ok: true };
}

export function validateSearchResults(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      ok: false,
      message: "No matching properties were found."
    };
  }

  return { ok: true };
}
