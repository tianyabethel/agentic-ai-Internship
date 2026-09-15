export const evaluationDataset = [
  {
    id: 1,
    query: "Find homes in Pasadena",
    expectedIntents: ["search"],
  },
  {
    id: 2,
    query: "Are home prices rising in Pasadena?",
    expectedIntents: ["market"],
  },
  {
    id: 3,
    query: "What does DOM mean?",
    expectedIntents: ["knowledge"],
  },
  {
    id: 4,
    query: "Recommend properties similar to listing 1165839960",
    expectedIntents: ["recommend"],
  },
  {
    id: 5,
    query: "Draft an email summarizing the Pasadena real estate market",
    expectedIntents: ["email", "market"],
  },
  {
    id: 6,
    query:
      "Find affordable homes in Pasadena and tell me whether prices are rising",
    expectedIntents: ["search", "market"],
  },
];


