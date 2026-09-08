import axios from 'axios';

// Use VITE_API_URL from environment for Cloudflare deployment, fallback to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Config with Auth Header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// ========================
// Auth Services
// ========================
export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const signup = async (userData) => {
  const res = await axios.post(`${API_URL}/auth/signup`, userData);
  return res.data;
};

// ========================
// Business Services
// ========================
export const getMyBusiness = async () => {
  const res = await axios.get(`${API_URL}/business/me`, getAuthHeaders());
  return res.data;
};

export const getBusinessById = async (id) => {
  const res = await axios.get(`${API_URL}/business/${id}`);
  return res.data;
};

export const updateMyBusiness = async (data) => {
  const res = await axios.put(`${API_URL}/business/me`, data, getAuthHeaders());
  return res.data;
};

export const completeBusinessSetup = async (data) => {
  const res = await axios.post(`${API_URL}/business/setup-complete`, data, getAuthHeaders());
  return res.data;
};

export const recordScan = async (id) => {
  await axios.post(`${API_URL}/business/${id}/stats/scan`);
};

export const recordGoogleReview = async (id) => {
  await axios.post(`${API_URL}/business/${id}/stats/review`);
};

// ========================
// Feedback Services
// ========================
export const submitFeedback = async (data) => {
  const res = await axios.post(`${API_URL}/feedback`, data);
  return res.data;
};

export const getMyFeedback = async () => {
  const res = await axios.get(`${API_URL}/feedback/me`, getAuthHeaders());
  return res.data;
};

export const resolveFeedback = async (id) => {
  const res = await axios.put(`${API_URL}/feedback/${id}/resolve`, {}, getAuthHeaders());
  return res.data;
};

// ========================
// AI Services
// ========================
export const generateReviewBackend = async (data) => {
  // data: { businessName, category, rating, topics, instructions }
  const res = await axios.post(`${API_URL}/generate-review`, data);
  return res.data.review;
};

// ========================
// Google Integration Services
// ========================
export const getGoogleAuthUrl = async () => {
  const res = await axios.get(`${API_URL}/google/auth`, getAuthHeaders());
  return res.data.url;
};

export const getGoogleReviews = async () => {
  const res = await axios.get(`${API_URL}/google/reviews`, getAuthHeaders());
  return res.data;
};
