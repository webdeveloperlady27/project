import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  region: "All",
  category: "All",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setRegion(state, action) {
      state.region = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    resetFilters(state) {
      state.search = "";
      state.region = "All";
      state.category = "All";
    },
  },
});

export const { setSearch, setRegion, setCategory, resetFilters } =
  filtersSlice.actions;

export default filtersSlice.reducer;
