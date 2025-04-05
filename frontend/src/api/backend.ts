// api/backend.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:23456/api';

export const fetchGroups = async () => {
  const response = await axios.get(`${API_URL}/groups`);
  return response.data;
};

export const fetchMetrics = async (nodeId?: number) => {
  const url = nodeId ? `${API_URL}/metrics?node_id=${nodeId}` : `${API_URL}/metrics`;
  const response = await axios.get(url);
  return response.data;
};