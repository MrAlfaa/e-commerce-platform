import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';

export const getToken = () => {
  const userInfo = Cookie.getJSON('userInfo');
  return userInfo?.token;
};

export const removeCookie = (name) => {
  Cookie.remove(name);
};

export const getCookie = (name) => {
  return Cookie.getJSON(name);
};

export const setCookie = (name, value) => {
  Cookie.set(name, value);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateAdminCredentials = (email, password) => {
  return email === 'admin@gmail.com' && password === 'admin';
};

export const isAdminUser = (userInfo) => {
  return userInfo?.isAdmin === true;
};
