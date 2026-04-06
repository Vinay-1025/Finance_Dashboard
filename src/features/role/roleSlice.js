import { createSlice } from "@reduxjs/toolkit";

const getInitialRole = () => {
  const savedRole = localStorage.getItem("finance_dashboard_role");
  return savedRole ? savedRole : "Viewer";
};

const initialState = {
  currentRole: getInitialRole(),
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.currentRole = action.payload;
      localStorage.setItem("finance_dashboard_role", action.payload);
    },
  },
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;
