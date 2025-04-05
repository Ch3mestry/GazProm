// nodesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Node {
  id: number;
  name: string;
  // Добавь другие поля по твоей структуре
}

interface NodesState {
  nodes: Node[];
  loading: boolean;
  error: string | null;
}

const initialState: NodesState = {
  nodes: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchNodes = createAsyncThunk<Node[]>(
  "nodes/fetchNodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Node[]>(
        "http://127.0.0.1:23456/api/nodes"
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNodes.fulfilled, (state, action) => {
        state.loading = false;
        state.nodes = action.payload;
      })
      .addCase(fetchNodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default nodesSlice.reducer;
