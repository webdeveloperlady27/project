import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filters/filtersSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import itineraryReducer from "../features/itinerary/itinerarySlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    favorites: favoritesReducer,
    itinerary: itineraryReducer,
    ui: uiReducer,
  },
});
