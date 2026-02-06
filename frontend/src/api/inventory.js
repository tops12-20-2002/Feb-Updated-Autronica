import API_BASE_URL from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getInventory = async () => {
  const response = await fetch(`${API_BASE_URL}/inventory.php`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const createInventoryItem = async (item) => {
  const response = await fetch(`${API_BASE_URL}/inventory.php`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  return response.json();
};

export const updateInventoryItem = async (item) => {
  const response = await fetch(`${API_BASE_URL}/inventory.php`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  return response.json();
};

export const deleteInventoryItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/inventory.php`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ id }),
  });
  return response.json();
};

