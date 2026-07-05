const API_BASE = 'http://localhost:5000/api';

// Helper to get headers with JWT token if logged in
const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = localStorage.getItem('gihan_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status}`);
  }
  return res.json();
};

export const api = {
  // Auth endpoints
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Projects endpoints
  getProjects: async () => {
    const res = await fetch(`${API_BASE}/projects`);
    return handleResponse(res);
  },

  createProject: async (projectData) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    return handleResponse(res);
  },

  updateProject: async (id, projectData) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    return handleResponse(res);
  },

  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Blogs endpoints
  getBlogs: async () => {
    const res = await fetch(`${API_BASE}/blogs`);
    return handleResponse(res);
  },

  getBlogBySlug: async (slug) => {
    const res = await fetch(`${API_BASE}/blogs/${slug}`);
    return handleResponse(res);
  },

  createBlog: async (blogData) => {
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(blogData)
    });
    return handleResponse(res);
  },

  updateBlog: async (id, blogData) => {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(blogData)
    });
    return handleResponse(res);
  },

  deleteBlog: async (id) => {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  addComment: async (blogId, commentData) => {
    const res = await fetch(`${API_BASE}/blogs/${blogId}/comment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(commentData)
    });
    return handleResponse(res);
  },

  likeBlog: async (blogId) => {
    const res = await fetch(`${API_BASE}/blogs/${blogId}/like`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Content endpoints (Skills, Certificates, Testimonials, Settings)
  getSkills: async () => {
    const res = await fetch(`${API_BASE}/content/skills`);
    return handleResponse(res);
  },

  createSkill: async (skillData) => {
    const res = await fetch(`${API_BASE}/content/skills`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(skillData)
    });
    return handleResponse(res);
  },

  updateSkill: async (id, skillData) => {
    const res = await fetch(`${API_BASE}/content/skills/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(skillData)
    });
    return handleResponse(res);
  },

  deleteSkill: async (id) => {
    const res = await fetch(`${API_BASE}/content/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getCertificates: async () => {
    const res = await fetch(`${API_BASE}/content/certificates`);
    return handleResponse(res);
  },

  getTestimonials: async () => {
    const res = await fetch(`${API_BASE}/content/testimonials`);
    return handleResponse(res);
  },

  getSettings: async () => {
    const res = await fetch(`${API_BASE}/content/settings`);
    return handleResponse(res);
  },

  updateSettings: async (settingsData) => {
    const res = await fetch(`${API_BASE}/content/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settingsData)
    });
    return handleResponse(res);
  },

  // Messages endpoints
  getMessages: async () => {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  sendMessage: async (messageData) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(messageData)
    });
    return handleResponse(res);
  },

  updateMessageStatus: async (id, statusData) => {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(statusData)
    });
    return handleResponse(res);
  },

  deleteMessage: async (id) => {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Analytics endpoints
  logPageView: async (path) => {
    const referrer = document.referrer;
    const userAgent = navigator.userAgent;
    
    // Simple User-Agent Parsing
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    
    if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

    if (userAgent.indexOf('Windows') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) os = 'iOS';

    try {
      await fetch(`${API_BASE}/analytics/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'pageview',
          path,
          referrer,
          browser,
          os
        })
      });
    } catch (e) {
      // Fail silently for page hits logging to prevent app blockage
    }
  },

  getAnalyticsStats: async () => {
    const res = await fetch(`${API_BASE}/analytics/stats`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
