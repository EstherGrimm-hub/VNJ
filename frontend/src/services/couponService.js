const API_URL = "http://localhost:5000/api/coupons";

export async function fetchCoupons() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createCoupon(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}

export async function validateCoupon(payload) {
  const res = await fetch(`${API_URL}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}