const API_URL = "http://localhost:5000/api/users";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export async function fetchUsers() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders()
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }
  
  return res.json();
}

export async function updateUserRole(userId, role) {
  const res = await fetch(`${API_URL}/${userId}/role`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}