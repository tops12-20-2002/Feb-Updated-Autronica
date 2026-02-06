import API_BASE_URL from '../config';

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const register = async (dataOrName, email, password) => {
  let body;
  if (typeof dataOrName === 'object') {
    body = JSON.stringify(dataOrName);
  } else {
    body = JSON.stringify({ full_name: dataOrName, email, password });
  }

  const response = await fetch(`${API_BASE_URL}/register.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  });
  return response.json();
};

export const resetPassword = async (data) => {
  const response = await fetch(`${API_BASE_URL}/reset_password.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // { email } OR { email, security_answer, new_password }
  });
  return response.json();
};

export const logout = async (token) => {
  const response = await fetch(`${API_BASE_URL}/logout.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  return response.json();
};

