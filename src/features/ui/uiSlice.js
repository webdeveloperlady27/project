import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { mobileMenuOpen: false },
  reducers: {
    openMenu: (s) => { s.mobileMenuOpen = true; },
    closeMenu: (s) => { s.mobileMenuOpen = false; },
    toggleMenu: (s) => { s.mobileMenuOpen = !s.mobileMenuOpen; },
  },
});

export const { openMenu, closeMenu, toggleMenu } = uiSlice.actions;
export default uiSlice.reducer;
