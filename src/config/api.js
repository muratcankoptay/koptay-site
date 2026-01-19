// API Configuration - Tüm backend URL'leri buradan yönetilir
const API_CONFIG = {
  // Backend API Endpoints
  ADMIN_API: 'http://localhost:3002/api',
  ANALYTICS_API: 'http://localhost:3003/api',
  
  // Frontend URL
  FRONTEND_URL: 'http://localhost:3001',
  
  // Timeout ayarları
  TIMEOUT: 10000,
  
  // Headers
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }),
  
  // Fetch wrapper with error handling
  async fetchAPI(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.ADMIN_API}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}

export default API_CONFIG
