import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "./messagesAPI";

interface Message {
    id: number;
    content: string;
    isOutgoing: boolean;
    timestamp: string;
    email: string;
    status: 'active' | 'inactive';
  }
  
  interface MessagesState {
    messages: Message[];
    page: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
  }
  
  let messageIdCounter = 0;
  
  const initialState: MessagesState = {
    messages: [],
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
  };
  
  export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async (page: number) => {
      const response = await fetchUsers(page);
      return {
        messages: response.data,
        pagination: response.pagination
      };
    }
  );
  
  
  
  const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
      addMessage: (state, action) => {
        state.messages.push({
          ...action.payload,
          id: messageIdCounter++
        });
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchMessages.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchMessages.fulfilled, (state, action) => {
          state.loading = false;
          state.messages = [...action.payload.messages, ...state.messages];
          state.page = action.payload.pagination.page;
          state.totalPages = action.payload.pagination.pages;
        })
        .addCase(fetchMessages.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch messages';
        });
    },
  });
  
  export const { addMessage } = messagesSlice.actions;
  export default messagesSlice.reducer;