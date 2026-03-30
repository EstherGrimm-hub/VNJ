const API_URL = "http://localhost:5000/api/auth";

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Đăng nhập thất bại."
      };
    }

    return data;
  } catch (error) {
    console.error("loginUser error:", error);
    return {
      success: false,
      message: "Không thể kết nối server."
    };
  }
}

export async function registerUser(payload) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Đăng ký thất bại."
      };
    }

    return data;
  } catch (error) {
    console.error("registerUser error:", error);
    return {
      success: false,
      message: "Không thể kết nối server."
    };
  }
}

export function logoutUser() {
  localStorage.removeItem("currentUser");
}