import api from './api';

const portfolioService = {
  // Get all portfolios for current user
  getPortfolios: async () => {
    const response = await api.get('/portfolios');
    return response.data;
  },

  // Get a single portfolio by ID
  getPortfolio: async (id) => {
    const response = await api.get(`/portfolios/${id}`);
    return response.data;
  },

  // Get public portfolio by slug
  getPublicPortfolio: async (slug) => {
    const response = await api.get(`/portfolios/public/${slug}`);
    return response.data;
  },

  // Create a new portfolio
  createPortfolio: async (portfolioData) => {
    const response = await api.post('/portfolios', portfolioData);
    return response.data;
  },

  // Create portfolio with AI assistance
  createPortfolioWithAI: async (portfolioData) => {
    const response = await api.post('/portfolios/create-with-ai', portfolioData);
    return response.data;
  },

  // Update a portfolio
  updatePortfolio: async (id, portfolioData) => {
    const response = await api.put(`/portfolios/${id}`, portfolioData);
    return response.data;
  },

  // Delete a portfolio
  deletePortfolio: async (id) => {
    const response = await api.delete(`/portfolios/${id}`);
    return response.data;
  },

  // Duplicate a portfolio
  duplicatePortfolio: async (id) => {
    const response = await api.post(`/portfolios/${id}/duplicate`);
    return response.data;
  },

  // Toggle portfolio publish status
  togglePublish: async (id) => {
    const response = await api.patch(`/portfolios/${id}/publish`);
    return response.data;
  },

  // Enhance bio with AI
  enhanceBio: async (bioData) => {
    const response = await api.post('/ai/enhance/bio', bioData);
    return response.data;
  },

  // Enhance project with AI
  enhanceProject: async (projectData) => {
    const response = await api.post('/ai/enhance/project', projectData);
    return response.data;
  },

  // Enhance experience with AI
  enhanceExperience: async (experienceData) => {
    const response = await api.post('/ai/enhance/experience', experienceData);
    return response.data;
  },

  // Enhance entire portfolio with AI
  enhancePortfolio: async (portfolioData) => {
    const response = await api.post('/ai/enhance/portfolio', portfolioData);
    return response.data;
  },

  // Get AI theme recommendation
  recommendTheme: async (portfolioData) => {
    const response = await api.post('/ai/recommend-theme', portfolioData);
    return response.data;
  },

  // Export portfolio as HTML
  exportHTML: async (id) => {
    const response = await api.post(`/export/html/${id}`);
    return response.data;
  },

  // Export portfolio as JSON
  exportJSON: async (id) => {
    const response = await api.get(`/export/json/${id}`);
    return response.data;
  }
};

export default portfolioService;
