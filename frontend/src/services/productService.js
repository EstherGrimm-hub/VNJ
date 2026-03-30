const API_URL = "http://localhost:5000/api/products";

export async function fetchProducts(category = "") {
  try {
    const url = category
      ? `${API_URL}?category=${encodeURIComponent(category)}`
      : API_URL;

    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error("fetchProducts error:", error);
    return {
      success: false,
      products: []
    };
  }
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    return await res.json();
  } catch (error) {
    console.error("fetchProductById error:", error);
    return {
      success: false,
      product: null
    };
  }
}

export async function createProduct(payload) {
  try {
    const res = await fetch(API_URL, {
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
        message: data.message || "Thêm sản phẩm thất bại."
      };
    }

    return data;
  } catch (error) {
    console.error("createProduct error:", error);
    return {
      success: false,
      message: "Không thể kết nối server."
    };
  }
}