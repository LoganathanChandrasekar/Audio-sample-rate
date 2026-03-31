// API configuration constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me',
  },
  AUDIO: {
    UPLOAD: '/audio/upload',
    HISTORY: '/audio/history',
    GET_BY_ID: (id) => `/audio/${id}`,
    STREAM: (id) => `/audio/${id}/stream`,
    DELETE: (id) => `/audio/${id}`,
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
};
