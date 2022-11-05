const api = {
  authToken: null,
  setAuthToken: (token) => {
    api.authToken = token;
    localStorage.setItem("authToken", token);
  },
  fetch: async (url, options) => {
    let data = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: api.authToken ? `Bearer ${api.authToken}` : "",
      },
    };
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, data).then(
      async (resp) => {
        if (!resp.ok) throw resp;
        return await resp.json();
      }
    );
  },
  defaultFetch: async (url, options) => {
    let data = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: api.authToken ? `Bearer ${api.authToken}` : "",
      },
    };
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, data);
  },
};

export default api;
