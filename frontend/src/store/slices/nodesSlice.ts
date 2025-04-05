import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Metric {
  datetime: string;
  cpu: number;
  memory: number;
  disk: number;
}

interface LastMetric {
  datetime: string;
  cpu: number;
  memory: number;
  disk: number;
}

interface Interface {
  id: number | null;
  name: string | null;
  status: string | null;
  status_description: string | null;
}

interface Group {
  id: number;
  name: string;
}

interface Application {
  id: number;
  name: string;
}

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Node {
  id: number;
  name: string;
  status: {
    color: string;
    description: string;
  };
  groups: Group[];
  applications: Application[];
  interfaces: Interface;
  admin: Admin;
  metrics: Metric[];
  last_metrics: LastMetric | null;
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
