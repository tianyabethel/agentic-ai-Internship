# MLS Field Definitions

## california_sold

The `california_sold` table contains historical sold-property data used for comparable sales analysis, market statistics, and recommendation validation.

### Identification

- `ListingKey` — Unique identifier for the property listing.
- `UnparsedAddress` — Full property address.

### Price and Sale Information

- `OriginalListPrice` — Original asking price when the property was first listed.
- `ListPrice` — Most recent listing price.
- `ClosePrice` — Final sale price of the property.
- `CloseDate` — Date the property sale closed.
- `PurchaseContractDate` — Date the purchase contract was accepted.
- `ListingContractDate` — Date the listing agreement began.
- `DaysOnMarket` — Number of days the property remained on the market.

### Property Characteristics

- `PropertyType` — General classification of the property.
- `PropertySubType` — More specific property classification.
- `LivingArea` — Interior living area of the property.
- `LotSizeAcres` — Lot size measured in acres.
- `LotSizeSquareFeet` — Lot size measured in square feet.
- `YearBuilt` — Year the property was built.
- `BedroomsTotal` — Total number of bedrooms.
- `BathroomsTotalInteger` — Total number of bathrooms.
- `Stories` — Number of stories.
- `Levels` — Property level description.
- `MainLevelBedrooms` — Number of bedrooms located on the main level.

### Location

- `City` — City where the property is located.
- `StateOrProvince` — State or province where the property is located.
- `PostalCode` — Property postal code.
- `Latitude` — Latitude coordinate.
- `Longitude` — Longitude coordinate.
- `SubdivisionName` — Name of the property's subdivision.

### Parking and Garage

- `AttachedGarageYN` — Indicates whether the property has an attached garage.
- `GarageSpaces` — Number of garage spaces.
- `ParkingTotal` — Total number of parking spaces.

### Property Features

- `PoolPrivateYN` — Indicates whether the property has a private pool.
- `WaterfrontYN` — Indicates whether the property is waterfront.
- `BasementYN` — Indicates whether the property has a basement.
- `FireplaceYN` — Indicates whether the property has a fireplace.
- `NewConstructionYN` — Indicates whether the property is new construction.
- `ViewYN` — Indicates whether the property has a recorded view feature.

### Schools

- `MiddleOrJuniorSchool` — Assigned middle or junior school.
- `HighSchool` — Assigned high school.
- `HighSchoolDistrict` — School district associated with the property.

### Agents and Offices

- `ListAgentFirstName` — Listing agent's first name.
- `ListAgentLastName` — Listing agent's last name.
- `ListAgentFullName` — Listing agent's full name.
- `ListOfficeName` — Listing brokerage or office.
- `BuyerAgentFirstName` — Buyer's agent first name.
- `BuyerAgentLastName` — Buyer's agent last name.
- `BuyerOfficeName` — Buyer's brokerage or office.

### Fees

- `AssociationFee` — Homeowners association or similar association fee.
