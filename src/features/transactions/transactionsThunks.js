import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/apiService";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    return await apiService.getTransactions();
  }
);

export const fetchCategories = createAsyncThunk(
  "transactions/fetchCategories",
  async () => {
    return await apiService.getCategories();
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction) => {
    return await apiService.addTransaction(transaction);
  }
);

export const editTransaction = createAsyncThunk(
  "transactions/editTransaction",
  async (transaction) => {
    return await apiService.editTransaction(transaction);
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id) => {
    return await apiService.deleteTransaction(id);
  }
);
