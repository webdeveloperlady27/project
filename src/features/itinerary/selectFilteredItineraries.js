import { createSelector } from "@reduxjs/toolkit";
import { itineraries } from "../../data/itineraries";

export const selectItineraryFilters = (state) => state.itinerary;

export const selectFilteredItineraries = createSelector(
  [selectItineraryFilters],
  ({ region, days }) => {
    return itineraries.filter((i) => {
      const regionOk = region === "All" || i.region === region;
      const daysOk = days === "All" || String(i.days) === String(days);
      return regionOk && daysOk;
    });
  }
);

export const selectItineraryRegions = createSelector([], () => {
  return ["All", ...new Set(itineraries.map((i) => i.region))];
});
