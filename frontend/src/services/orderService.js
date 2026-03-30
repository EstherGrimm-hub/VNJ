const API_URL = "http://localhost:5000/api/orders";

export async function createOrder(orderData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });

  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(API_URL);
  return res.json();
}