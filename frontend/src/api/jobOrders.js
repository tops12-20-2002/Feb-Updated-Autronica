import API_BASE_URL from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getJobOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/job_orders.php`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const createJobOrder = async (jobOrder) => {
  const response = await fetch(`${API_BASE_URL}/job_orders.php`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(jobOrder),
  });
  return response.json();
};

export const updateJobOrder = async (jobOrder) => {
  const response = await fetch(`${API_BASE_URL}/job_orders.php`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(jobOrder),
  });
  return response.json();
};

export const deleteJobOrder = async (id) => {
  const response = await fetch(`${API_BASE_URL}/job_orders.php`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ id }),
  });
  return response.json();
};

