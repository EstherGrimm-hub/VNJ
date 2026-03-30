const API_URL = "http://localhost:5000/api/users";

export async function fetchUsers() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function updateUserRole(userId, role) {
  const res = await fetch(`${API_URL}/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ role })
  });

  return res.json();
}