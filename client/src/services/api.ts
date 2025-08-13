
// const API_URL = 'http://localhost:4000/api'; // API Gateway URL

const API_URL = import.meta.env.VITE_API_URL;

// Helper function for making API requests
const fetchData = async (endpoint: string, options = {}) => {
  console.log('API_URL:', API_URL);
  console.log('endpoint:', endpoint);
  console.log('options:', options);
  try {
    // Add the auth token to requests if it exists
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
     headers['Authorization'] = `Bearer ${token}`;
    }
    

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error cases
      if (response.status === 401) {
        // Unauthorized - token might be expired
        localStorage.removeItem('token');
        // window.location.href = '/login';
        throw new Error('Authentication required. Please log in again.');
      }
      
      if (response.status === 403) {
        // Forbidden - user doesn't have permission
        throw new Error(errorData.message || 'You do not have permission to perform this action');
      }
      
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // console.error('API request failed:', error);
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
  }),
  getAllUsers: () => fetchData('/users'),
  updateUser: (userId: string, userData: any) => fetchData(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  deleteUser: (userId: string) => fetchData(`/users/${userId}`, {
    method: 'DELETE'
  }),
  getDriverInfo: (driverId: string) => fetchData(`/users/driver/${driverId}/info`),
  getDriverInfoForPackage: (packageId: string) => fetchData(`/users/package/${packageId}/driver`)
};

export const roleApi = {
  getAll: () => fetchData('/users/roles'),
  getById: (id: string) => fetchData(`/users/roles/${id}`),
  create: (roleData: any) => fetchData('/users/roles', {
    method: 'POST',
    body: JSON.stringify(roleData)
  }),
  update: (id: string, roleData: any) => fetchData(`/users/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roleData)
  }),
  delete: (id: string) => fetchData(`/users/roles/${id}`, {
    method: 'DELETE'
  })
};

export const permissionApi = {
  getAll: () => fetchData('/users/permissions'),
  create: (permissionData: any) => fetchData('/users/permissions', {
    method: 'POST',
    body: JSON.stringify(permissionData)
  })
};

export const deliveryApi = {
  getPendingDeliveries: () => fetchData('/deliveries'),
  getDriverDeliveries: () => fetchData('/deliveries/driver'),
  getDriverCompletedDeliveries: () => fetchData('/deliveries/driver/completed'),
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

// Admin functionality uses existing APIs for now
// Future admin-specific endpoints can be added here when backend supports them
