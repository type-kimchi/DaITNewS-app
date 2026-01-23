const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const parseResponseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
};

const handleResponse = async (response) => {
  const body = await parseResponseBody(response);
  if (!response.ok) {
    const message = typeof body === 'string'
      ? body
      : (body && body.message) || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body;
};

export const fetchArticles = async () => {
  const response = await fetch(`${API_BASE_URL}/articles`);
  return handleResponse(response);
};

export const fetchArticleById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`);
  return handleResponse(response);
};

export const createArticle = async (articleData) => {
  const response = await fetch(`${API_BASE_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articleData),
  });
  return handleResponse(response);
};

export const updateArticle = async (id, articleData) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articleData),
  });
  return handleResponse(response);
};

export const deleteArticle = async (id) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const searchArticles = async (query) => {
  const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
  return handleResponse(response);
};
