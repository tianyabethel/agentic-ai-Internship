# Week 11 California Sold Market Report

## Data Source

Source: `california_sold.sql`

The report uses residential sales with valid CloseDate values from December 16, 2025 through June 15, 2026.

## Market Summary

- Residential sales: 87,153
- Date range: December 16, 2025 to June 15, 2026
- Median close price: $815,000
- Average close price: $1,142,327.08
- Median list price: $805,000
- Average days on market: 42.8
- Median days on market: 20.0

## Key Observations

The median close price was $815,000 compared with a median list price of $805,000.

The average close price was $1,142,327.08, while the average days on market was 42.8 days.

The median days on market was 20.0 days, indicating that at least half of the reported residential sales were on the market for 20 days or fewer.

## Safety and Data Handling

- The report is generated from the provided `california_sold` dataset.
- Records with malformed CloseDate values outside the valid 2025-2026 reporting period were excluded.
- No MLS bulk download was performed.
- Queries and processing must be limited to a maximum of 50 rows when individual property records are requested.
- Email reports must be drafted first and require explicit human approval before sending.
- Email credentials and API keys must not be exposed in the report.
- The system must not autonomously send emails.
