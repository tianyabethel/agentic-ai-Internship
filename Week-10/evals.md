# Week 10 WhatsApp End-to-End Evaluation

## Automated Evaluation

- Tests passed: 6/6
- Failed: 0/6
- Intent accuracy: 100%

## WhatsApp Tests

| # | Query | Expected Intent | Result | Notes |
|---|---|---|---|---|
| 1 | Find homes in Pasadena | Search | Pass | Returned Pasadena listings |
| 2 | Are home prices rising in Pasadena? | Market | Pass | Returned Pasadena market summary and trend |
| 3 | What does DOM mean? | Knowledge/RAG | Pass | Returned DOM definition |
| 4 | Recommend properties similar to listing 1165839960 | Recommendation | Pass | Recommendation workflow tested |
| 5 | Draft an email summarizing Pasadena market | Email + Market | Pass | Generated market email draft |
| 6 | Find affordable homes in Pasadena and tell me whether prices are rising | Search + Market | Pass | Tested mixed-intent routing and no-results handling |
| 7 | Find homes in Pasadena | Search | Pass | Tested natural-language city extraction |
| 8 | What does DOM mean? | Knowledge/RAG | Pass | Tested RAG response and confidence guardrail |
| 9 | Are prices rising in Pasadena? | Market | Pass | Tested market statistics workflow |
| 10 | Recommend properties similar to listing 1165839960 | Recommendation | Pass | Tested recommendation workflow |

## Guardrail Tests

- No-results search handling: tested
- RAG low-confidence handling: tested
- Invalid recommendation/listing input: tested
- Query validation: tested
- Search result validation: tested

## Summary

Week 10 automated evaluation passed all 6 evaluation cases with 100% intent accuracy. The WhatsApp workflow was tested across property search, market statistics, recommendations, RAG knowledge, email drafting, and mixed-intent requests. Guardrails were also tested for invalid or unavailable results and low-confidence knowledge responses.
