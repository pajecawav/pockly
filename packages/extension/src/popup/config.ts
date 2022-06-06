export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const GRAPHQL_ENDPOINT_URL = `${API_BASE_URL}/api/graphql`;

// URLs
export const SESSION_URL = `${API_BASE_URL}/api/auth/session`;
export const LOGIN_URL = `${API_BASE_URL}/auth/login`;
export const READING_LIST_URL = `${API_BASE_URL}/read`;
export const BOOKMARK_PAGE_BASE_URL = `${API_BASE_URL}/b`;
