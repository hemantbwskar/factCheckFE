/**
 * Application API URL Configuration
 * 
 * Centralizes base URLs and sub-path endpoints used throughout the app.
 * Base URL can be configured via environment variable `REACT_APP_API_BASE_URL`.
 */

// Common / Base API Domain URL
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://factcheckjsbe.onrender.com/api';

// Sub-path routes/endpoints
export const ENDPOINTS = {
  SIGNIN: '/signin',
  TIMELINE: '/timeline',
  TIMELINE_ITEM: (id: number | string) => `/timeline/${id}`,
};

// Full API URLs (combination of base URL and sub endpoints)
export const API_URLS = {
  BASE: API_BASE_URL,
  SIGNIN: process.env.REACT_APP_API_SIGNIN_URL || `${API_BASE_URL}${ENDPOINTS.SIGNIN}`,
  TIMELINE: `${API_BASE_URL}${ENDPOINTS.TIMELINE}`,
  TIMELINE_ITEM: (id: number | string) => `${API_BASE_URL}${ENDPOINTS.TIMELINE_ITEM(id)}`,
};

// Client Application Routes
export const APP_ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
};
