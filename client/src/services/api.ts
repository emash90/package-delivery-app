
const API_URL = 'http://localhost:5000/api'; // API Gateway URL

// Helper function for making API requests
const fetchData = async (endpoint: string, options = {}) => {
  try {
    // Add the auth token to requests if it exists
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
     headers['Authorization'] = `Bearer ${token}`;
    }
    


    // console.log("token:", token)
    // console.log("headers:", headers)
    // console.log("options:", options)
    // console.log("API_URL:", API_URL)
    // console.log("endpoint:", endpoint)
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const packageApi = {
  getAll: () => fetchData('/packages'),
  getByUserId: (userId: string) => fetchData(`/packages/user/${userId}`),
  getById: (id: string) => fetchData(`/packages/${id}`),
  trackById: (id: string) => fetchData(`/track/${id}`), // Public tracking endpoint (no auth required)
  getAvailable: () => fetchData('/packages/available'),
  create: (packageData: any) => fetchData('/packages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(packageData)
  }),
  update: (id: string, packageData: any) => fetchData(`/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(packageData)
  }),
  uploadImage: (packageId: string, formData: FormData) => {
    // For file uploads, we need to handle the fetch differently
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(`${API_URL}/packages/${packageId}/images`, {
      method: 'POST',
      headers,
      body: formData
    }).then(res => {
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      return res.json();
    });
  }
};

export const userApi = {
  login: (credentials: { email: string; password: string }) => fetchData('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData: any) => fetchData('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getCurrentUser: () => fetchData('/users/me'),
  updateProfile: (userData: any) => fetchData('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData)
  })
};

export const deliveryApi = {
  getDriverDeliveries: () => fetchData('/deliveries/driver'),
  getOwnerDeliveries: () => fetchData('/deliveries/owner'),
  startDelivery: (deliveryId: string) => fetchData(`/deliveries/${deliveryId}/start`, {
    method: 'POST'
  }),
  completeDelivery: (deliveryId: string) => fetchData(`/deliveries/${deliveryId}/complete`, {
    method: 'POST'
  }),
  reportIssue: (deliveryId: string, issue: string) => fetchData(`/deliveries/${deliveryId}/issue`, {
    method: 'POST',
    body: JSON.stringify({ issue })
  })
};
