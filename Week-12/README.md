# Week 12 Final Capstone

## Overview

This project is an AI-powered real estate assistant that integrates the workflows developed throughout the internship.

## Features

1. Natural-language property search
2. Multi-turn conversational memory
3. Market analytics and trends
4. Comparable and comp-validated price assessments
5. Semantic similarity search
6. Property recommendation engine
7. RAG knowledge assistant
8. Multi-agent orchestration
9. WhatsApp communication
10. Email drafting with human approval

## Safety

- Email sending requires explicit human approval.
- API keys and email credentials are stored outside the source code.
- Low-confidence RAG responses are rejected.
- Invalid listing IDs are rejected.
- Empty search results are handled safely.
- Individual property queries are limited to 50 rows.
- No autonomous email sending is permitted.

## Testing

The Week 12 capstone includes automated evaluation and guardrail tests.

Guardrail tests: 7/7 passed.

The full evaluation runner passed successfully.

## Market Reporting

The project includes a California residential market report generated from the provided `california_sold` dataset.

## Demo

The final project will be demonstrated through WhatsApp using real estate search, market analytics, recommendations, RAG, and email drafting workflows.
