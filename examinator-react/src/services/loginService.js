const API_URL = 'http://localhost:8080/api/users';

export async function registerUser(firstName, lastName, username, email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, username, email, password }),
  });

  const contentType = res.headers.get('Content-Type');
  const isJson = contentType && contentType.includes('application/json');

  const bodyText = await res.text();

  let data;
  try {
    data = isJson ? JSON.parse(bodyText) : bodyText;
  } catch {
    data = bodyText;
  }

  if (!res.ok) {
    const message = typeof data === 'string' ? data : data.message || JSON.stringify(data);
    throw new Error(`Greška pri registraciji: ${message}`);
  }

  return data;
}

export async function loginUser(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data);

  localStorage.setItem('token', data.token);

  return data;
}
