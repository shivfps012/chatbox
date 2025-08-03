const API_BASE_URL = 'http://localhost:5000/api';

// API utility functions
export const api = {
  // Auth endpoints
  auth: {
    login: (email, password) => 
      fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }),
    
    register: (email, password, name) =>
      fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      }),
    
    forgotPassword: (email) =>
      fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }),
    
    resetPassword: (token, password) =>
      fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      }),
    
    me: (token) =>
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
    
    logout: (token) =>
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
  },

  // User endpoints
  user: {
    getProfile: (token) =>
      fetch(`${API_BASE_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
    
    updateProfile: (token, data) =>
      fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }),
    
    uploadProfileImage: (token, file) => {
      const formData = new FormData();
      formData.append('profileImage', file);
      return fetch(`${API_BASE_URL}/user/profile-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
    },
    
    removeProfileImage: (token) =>
      fetch(`${API_BASE_URL}/user/profile-image`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }),
    
    getStats: (token) =>
      fetch(`${API_BASE_URL}/user/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
  },

  // Chat endpoints
  chat: {
    getAll: (token, page = 1, limit = 10) =>
      fetch(`${API_BASE_URL}/chat?page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
    
    getById: (token, chatId) =>
      fetch(`${API_BASE_URL}/chat/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
    
    create: (token, data) =>
      fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }),
    
    addMessage: (token, chatId, message) =>
      fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      }),
    
    update: (token, chatId, data) =>
      fetch(`${API_BASE_URL}/chat/${chatId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }),
    
    delete: (token, chatId) =>
      fetch(`${API_BASE_URL}/chat/${chatId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
  },

  // File endpoints
  files: {
    upload: (token, files, chatId, messageId) => {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('chatId', chatId);
      formData.append('messageId', messageId);
      
      return fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
    },
    
    getAll: (token, page = 1, limit = 20, chatId = null) => {
      const params = new URLSearchParams({ page, limit });
      if (chatId) params.append('chatId', chatId);
      
      return fetch(`${API_BASE_URL}/files?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    },
    
    getById: (token, fileId) =>
      fetch(`${API_BASE_URL}/files/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
    
    download: (token, fileId) =>
      fetch(`${API_BASE_URL}/files/${fileId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
    
    delete: (token, fileId) =>
      fetch(`${API_BASE_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }),
    
    getStats: (token) =>
      fetch(`${API_BASE_URL}/files/stats/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
  }
};

export default api;