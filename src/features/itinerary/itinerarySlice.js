import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  region: "All",
  days: "All", 
};

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {
    setItineraryRegion(state, action) {
      state.region = action.payload;
    },
    setItineraryDays(state, action) {
      state.days = action.payload;
    },
    resetItineraryFilters(state) {
      state.region = "All";
      state.days = "All";
    },
  },
});

export const {
  setItineraryRegion,
  setItineraryDays,
  resetItineraryFilters,
} = itinerarySlice.actions;

export default itinerarySlice.reducer;
