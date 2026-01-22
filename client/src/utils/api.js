const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
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
