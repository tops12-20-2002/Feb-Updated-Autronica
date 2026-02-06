import API_BASE_URL from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard.php`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

