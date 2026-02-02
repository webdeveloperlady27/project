import { createSelector } from "@reduxjs/toolkit";

const selectFilters = (state) => state.filters;
const selectDestinations = (_, destinations) => destinations;

export const selectFilteredDestinations = createSelector(
  [selectFilters, selectDestinations],
  (filters, destinations) => {
    const { search, region, category, sort } = filters;

    let list = destinations
      .filter((d) => (region === "All" ? true : d.region === region))
      .filter((d) => (category === "All" ? true : d.category === category))
      .filter((d) =>
        d.title.toLowerCase().includes(search.trim().toLowerCase())
      );

    if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }
);
