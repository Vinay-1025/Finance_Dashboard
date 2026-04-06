import axios from "axios";
import { initialData } from "./initialData";

const BASE_URL = "http://localhost:5001";
const STORAGE_KEY = "zorvyn_finance_db";

// --- LocalStorage Mock Logic (for Production) ---
const initializeData = () => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

const getLocalData = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

const saveLocalData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const localMock = {
  getTransactions: async () => {
    await delay();
    return getLocalData().transactions;
  },
  getCategories: async () => {
    await delay();
    return getLocalData().categories;
  },
  addTransaction: async (transaction) => {
    await delay();
    const data = getLocalData();
    const newTransaction = { 
      ...transaction, 
      id: transaction.id || Math.random().toString(36).substr(2, 9) 
    };
    data.transactions.push(newTransaction);
    saveLocalData(data);
    return newTransaction;
  },
  editTransaction: async (transaction) => {
    await delay();
    const data = getLocalData();
    const index = data.transactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      data.transactions[index] = transaction;
      saveLocalData(data);
      return transaction;
    }
    throw new Error("Transaction not found");
  },
  deleteTransaction: async (id) => {
    await delay();
    const data = getLocalData();
    data.transactions = data.transactions.filter(t => t.id !== id);
    saveLocalData(data);
    return id;
  }
};

// --- API Service Dispatcher ---
// Use real json-server in DEV, use localStorage in PROD
const isDev = import.meta.env.DEV;

export const apiService = {
  getTransactions: async () => {
    if (isDev) {
      const response = await axios.get(`${BASE_URL}/transactions`);
      return response.data;
    }
    return localMock.getTransactions();
  },

  getCategories: async () => {
    if (isDev) {
      const response = await axios.get(`${BASE_URL}/categories`);
      return response.data;
    }
    return localMock.getCategories();
  },

  addTransaction: async (transaction) => {
    if (isDev) {
      const response = await axios.post(`${BASE_URL}/transactions`, transaction);
      return response.data;
    }
    return localMock.addTransaction(transaction);
  },

  editTransaction: async (transaction) => {
    if (isDev) {
      const response = await axios.put(`${BASE_URL}/transactions/${transaction.id}`, transaction);
      return response.data;
    }
    return localMock.editTransaction(transaction);
  },

  deleteTransaction: async (id) => {
    if (isDev) {
      await axios.delete(`${BASE_URL}/transactions/${id}`);
      return id;
    }
    return localMock.deleteTransaction(id);
  }
};
