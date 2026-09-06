now we should create a plan so that in the Reslae page we should make sure the filters are great and look as nice as the project filters and the card should show if it's rent or buy could you create a plan so that all of those work right ?







2:23 PM






Worked for 31s



Here’s the plan for the Resale / Properties page.
Plan
1. Create One Clean Resale Filter Component
   - Replace the current inline sidebar in [properties/page.tsx (line 253)](C:/Users/VIP/Desktop/work/Real-estate-work/app/[locale]/(site\)/properties/page.tsx:253) with a proper component, similar to ProjectFilters.
   - Either update [PropertyFilters.tsx (line 1)](C:/Users/VIP/Desktop/work/Real-estate-work/app/[locale]/(site\)/properties/components/PropertyFilters.tsx:1) or rebuild it to match the project filters style.
   - Keep the same pattern:
     - top search bar
     - Filters button
     - right-side drawer
     - clear/apply buttons fixed at the bottom
2. Add Resale Filter Fields
   - Search keyword
   - Location / city
   - Country if needed
   - Property Type
   - Listing Type: Buy / Rent
   - Min Price
   - Max Price
   - Currency: EGP, USD, EUR, GBP
3. Make Filters Match The Backend
   - Current API already sends:
     - SearchTerm
     - Search
     - MinPrice
     - MaxPrice
     - Currency
     - City
     - Country
     - PropertyType
     - IsSoldOutside: false
   - Add Type / UnitType support in UnitOutsideFilters only if the backend supports it.
   - Important: the /api/unit-outsides docs you gave earlier did not list Type, so we should confirm the backend accepts Type=Buy/Rent. If yes, pass it directly. If no, the backend needs that filter added so filtering works correctly from the server.
4. Sync URL Parameters
   - Read listingType, type, or unitType from the URL.
   - Store selected filters in page state.
   - When filters apply, fetch page 1.
   - Optional but good: update the URL query so shared links keep the selected resale filters.
5. Improve Mobile And Desktop UX
   - Desktop:
     - top search bar visible
     - filter drawer slides from the right, just like projects
   - Mobile:
     - full-width drawer
     - large touch-friendly fields
     - sticky footer with Reset and Apply
   - Avoid the current pill-heavy property type layout if it gets too crowded; use clean select rows like the project drawer.
6. Show Buy/Rent On Cards
   - Update [PropertyCard.tsx (line 11)](C:/Users/VIP/Desktop/work/Real-estate-work/components/PropertyCard.tsx:11) to use unitType.
   - Add a visible badge on the card image or next to the property type:
     - For Buy
     - For Rent
   - Keep Resale / Sold status separate from Buy/Rent.
   - Example card badges:
     - top right: Resale
     - bottom or top left beside price: Buy / Rent
7. Clean The Card Data Mapping
   - In [properties/page.tsx (line 96)](C:/Users/VIP/Desktop/work/Real-estate-work/app/[locale]/(site\)/properties/page.tsx:96), keep mapping:
     - unitType: u.type
   - Pass it clearly:
     - listingType={unit.unitType}
   - Do not confuse propertyType with type.
     - propertyType = Apartment, Villa, Chalet
     - type = Buy or Rent
8. Translations
   - Add translation keys for:
     - Listing Type
     - Buy
     - Rent
     - All listing types
     - For Buy
     - For Rent
   - Use existing propertiesPage.sidebar.* / propertyCard.* structure.
9. Validation
   - Validate price range: min cannot be greater than max.
   - Disable apply button while loading.
   - Show active filter count on the filter button like projects.
10. Testing
    - Test /properties
    - Test /properties?unitType=Buy
    - Test /properties?unitType=Rent
    - Test search + property type + price + currency together.
    - Test mobile drawer and desktop layout.
    - Confirm card badge shows correct Buy or Rent.
Main goal: make resale filtering feel like the project filters, but with resale-specific fields and a clear Buy/Rent signal on every card.


2:24 PM








follow the plan







2:25 PM






I’ll implement this now: first I’m going to turn the resale filters into the same “search bar plus right drawer” pattern as projects, then I’ll add the Buy/Rent badge to the card and pass the listing type through the API filters.




  Ran commands


Worked for 42s




The resale page currently owns its drawer inline, while PropertyFilters.tsx is an older top-grid control. I’m going to replace that older component with a controlled drawer component and simplify the page so filter state lives in one place.