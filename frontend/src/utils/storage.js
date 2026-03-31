export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser")) || null;
};

export const saveCurrentUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem("currentUser");
};

export const getBuyNowItem = () => {
  return JSON.parse(localStorage.getItem("buyNowItem")) || null;
};

export const saveBuyNowItem = (item) => {
  localStorage.setItem("buyNowItem", JSON.stringify(item));
};

export const clearBuyNowItem = () => {
  localStorage.removeItem("buyNowItem");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};