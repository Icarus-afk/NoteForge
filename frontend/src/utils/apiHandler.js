// apiCall.js
import axios from 'axios';

// Set the base URL for all requests
axios.defaults.baseURL = 'http://localhost:8000';

// Set default headers for all requests
axios.defaults.headers.common['Content-Type'] = 'application/json';

/**
 * A reusable function to make API calls with Axios.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {string} endpoint - The endpoint to make the request to.
 * @param {Object} [data] - The data to send in the request body (for POST, PUT, PATCH requests).
 * @param {Object} [params] - The query parameters to send in the request URL.
 * @param {Object} [headers] - The headers to send in the request.
 * @returns {Promise<Object>} - The response data.
 */
export const apiCall = async ({ method, endpoint, data, params, headers }) => {
  // If data is FormData, set Content-Type to multipart/form-data
  if (data instanceof FormData) {
    headers = {
      ...headers,
      'Content-Type': 'multipart/form-data',
    };
  }

  try {
    const response = await axios({
      method,
      url: endpoint,
      data,
      params,
      headers,
      withCredentials: true, // Send cookies with requests
    });
    console.log("API CALL RESPONSE ------------------------------> ", response);
    return response.data;
  } catch (error) {
    // handle error
    console.error(error);
  }
};