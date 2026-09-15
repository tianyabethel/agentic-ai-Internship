# Real Estate Glossary

## DOM

DOM stands for Days on Market. It represents the number of days a property remains listed for sale before it goes under contract, sells, or is otherwise removed from the market.

In the MLS data, this information is represented by the `DaysOnMarket` field.

## List-to-Close Ratio

The list-to-close ratio measures the relationship between the final sale price of a property and its listing price.

Formula:

`ClosePrice / ListPrice × 100`

For example, if a property was listed for $500,000 and sold for $490,000:

`490,000 / 500,000 × 100 = 98%`

This means the property sold for 98% of its listing price.

## Comparable Sales

Comparable sales, often called comps, are recently sold properties that are similar to a subject property.

Comps may be selected using characteristics such as:

- location
- property type
- square footage
- number of bedrooms
- number of bathrooms
- lot size
- age of the property
- recent sale date

Comparable sales are commonly used to estimate property value.

## Original List Price

The original list price is the asking price of a property when it first entered the market.

In the MLS data, this is stored in `OriginalListPrice`.

## Close Price

Close price is the final price paid when a property sale is completed.

In the sold-property database, this is stored in `ClosePrice`.

## Living Area

Living area represents the interior area of a home that is considered usable residential living space.

In the MLS dataset, it is stored in `LivingArea`.

## Price Per Square Foot

Price per square foot measures a property's price relative to its living area.

Formula:

`Price / LivingArea`

For sold properties, this can be calculated as:

`ClosePrice / LivingArea`

Price per square foot can be used to compare properties of different sizes.

## MLS

MLS stands for Multiple Listing Service. It is a database used by real estate professionals to share information about properties listed for sale and properties that have sold.
