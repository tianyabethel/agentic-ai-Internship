# Schema Annotation

## Overview

The real estate assistant uses property data to support search, market analysis, comparable property validation, recommendations, and conversational questions.

## Key Property Fields

| Field | Description | Used For |
|---|---|---|
| Listing ID | Unique identifier for a property listing | Property lookup and recommendations |
| Property Type | Type of residential property | Property search and filtering |
| City | City where the property is located | Location-based search and market analysis |
| List Price | Original asking price | Search, market analysis, and price comparisons |
| Close Price | Final recorded sale price | Market analysis and comparable properties |
| Living Area | Property living area | Search, comparisons, and recommendations |
| Days on Market | Number of days the property was listed | Market analysis and recommendations |
| Close Date | Date the property was sold | Market trends and reporting |
| Latitude | Geographic latitude | Property location |
| Longitude | Geographic longitude | Property location |
| Agent Name | Listing or selling agent information | Property information |
| Property Status | Current status of the property | Active listing search |

## Data Usage

Property fields are used by different parts of the system:

- Property search uses location, property type, price, and other listing attributes.
- Market analytics use close price, list price, close date, and days on market.
- Comparable analysis uses property characteristics and sale prices.
- Recommendation features use property attributes and semantic similarity.
- The RAG assistant uses the knowledge base rather than inventing property data.
- Email drafts use information returned by the market and property workflows.

## Data Safety

- API keys and email credentials are stored outside source files.
- Individual property queries are limited to 50 rows.
- No MLS bulk download is performed.
- Invalid listing IDs are rejected.
- Empty search results return a clear user-facing message.
- Low-confidence knowledge results are rejected instead of presenting unsupported information.
- Email sending requires explicit human approval.

## Data Quality

The market report uses valid CloseDate values within the reporting period. Malformed or out-of-period dates are excluded from the market analysis.

The system validates search results and recommendation inputs before returning results to the user.
