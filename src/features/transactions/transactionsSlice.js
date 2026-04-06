import { createSlice } from "@reduxjs/toolkit";
import { fetchTransactions, fetchCategories, addTransaction, editTransaction, deleteTransaction } from "./transactionsThunks";

const initialState = {
  data: [],
  categories: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        const index = state.data.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.data = state.data.filter((t) => t.id !== action.payload);
      });
  }
});

export default transactionsSlice.reducer;
