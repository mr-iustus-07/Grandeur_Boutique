// Define a custom Error class so we can catch specific API failures easily
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

// Extend the native RequestInit to include Next.js specific caching options
interface CustomRequestInit extends RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

// Define the base URL from your environment variables (FastAPI server)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Core fetch wrapper that acts like an Axios interceptor
 */
async function fetcher<T>(endpoint: string, options: CustomRequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // 1. Interceptor: Automatically attach headers & Auth tokens
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  // TODO: Retrieve your Firebase Auth token here (e.g., from a cookie or local storage)
  // const token = getAuthToken(); 
  // if (token) headers.set("Authorization", `Bearer ${token}`);

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    // 2. Execute the network request
    const response = await fetch(url, config);

    // 3. Handle Empty Responses (like a 204 No Content for DELETE)
    if (response.status === 204) {
      return {} as T;
    }

    // 4. Parse the JSON response
    const data = await response.json().catch(() => null);

    // 5. Interceptor: Catch HTTP errors (FastAPI typically sends 400/422/500)
    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || response.statusText || "API Request Failed";
      throw new ApiError(response.status, errorMessage, data);
    }

    // Return the strictly typed data
    return data as T;

  } catch (error) {
    // Catch network errors (e.g., user is offline, server is totally down)
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Network Error or Server Unreachable", error);
  }
}

// 6. Export the clean, developer-friendly methods
export const apiClient = {
  get: <T>(endpoint: string, options?: CustomRequestInit) =>
    fetcher<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: any, options?: CustomRequestInit) =>
    fetcher<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: any, options?: CustomRequestInit) =>
    fetcher<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: any, options?: CustomRequestInit) =>
    fetcher<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, options?: CustomRequestInit) =>
    fetcher<T>(endpoint, { ...options, method: "DELETE" }),
};