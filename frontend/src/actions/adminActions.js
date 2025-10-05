import axios from 'axios';
import { getToken } from '../util';

export const ADMIN_SIGNIN_REQUEST = 'ADMIN_SIGNIN_REQUEST';
export const ADMIN_SIGNIN_SUCCESS = 'ADMIN_SIGNIN_SUCCESS';
export const ADMIN_SIGNIN_FAIL = 'ADMIN_SIGNIN_FAIL';

export const ADMIN_LIST_USERS_REQUEST = 'ADMIN_LIST_USERS_REQUEST';
export const ADMIN_LIST_USERS_SUCCESS = 'ADMIN_LIST_USERS_SUCCESS';
export const ADMIN_LIST_USERS_FAIL = 'ADMIN_LIST_USERS_FAIL';

export const ADMIN_CREATE_USER_REQUEST = 'ADMIN_CREATE_USER_REQUEST';
export const ADMIN_CREATE_USER_SUCCESS = 'ADMIN_CREATE_USER_SUCCESS';
export const ADMIN_CREATE_USER_FAIL = 'ADMIN_CREATE_USER_FAIL';

export const ADMIN_UPDATE_USER_REQUEST = 'ADMIN_UPDATE_USER_REQUEST';
export const ADMIN_UPDATE_USER_SUCCESS = 'ADMIN_UPDATE_USER_SUCCESS';
export const ADMIN_UPDATE_USER_FAIL = 'ADMIN_UPDATE_USER_FAIL';

export const ADMIN_DELETE_USER_REQUEST = 'ADMIN_DELETE_USER_REQUEST';
export const ADMIN_DELETE_USER_SUCCESS = 'ADMIN_DELETE_USER_SUCCESS';
export const ADMIN_DELETE_USER_FAIL = 'ADMIN_DELETE_USER_FAIL';

export const ADMIN_GET_STATS_REQUEST = 'ADMIN_GET_STATS_REQUEST';
export const ADMIN_GET_STATS_SUCCESS = 'ADMIN_GET_STATS_SUCCESS';
export const ADMIN_GET_STATS_FAIL = 'ADMIN_GET_STATS_FAIL';

export const ADMIN_CREATE_DEFAULT_REQUEST = 'ADMIN_CREATE_DEFAULT_REQUEST';
export const ADMIN_CREATE_DEFAULT_SUCCESS = 'ADMIN_CREATE_DEFAULT_SUCCESS';
export const ADMIN_CREATE_DEFAULT_FAIL = 'ADMIN_CREATE_DEFAULT_FAIL';

export const signInAsAdmin = (email, password) => async (dispatch) => {
  dispatch({ type: ADMIN_SIGNIN_REQUEST });
  try {
    const response = await axios.post('/api/users/signin', {
      email,
      password
    });
    
    if (response.data.isAdmin) {
      dispatch({ type: ADMIN_SIGNIN_SUCCESS, payload: response.data });
    } else {
      dispatch({ 
        type: ADMIN_SIGNIN_FAIL, 
        payload: new Error('Access denied. Admin privileges required.') 
      });
    }
  } catch (error) {
    dispatch({ 
      type: ADMIN_SIGNIN_FAIL, 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  dispatch({ type: ADMIN_LIST_USERS_REQUEST });
  try {
    const token = getToken();
    const { data } = await axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: ADMIN_LIST_USERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: ADMIN_LIST_USERS_FAIL, 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const createUser = (userData) => async (dispatch, getState) => {
  dispatch({ type: ADMIN_CREATE_USER_REQUEST });
  try {
    const token = getToken();
    const { data } = await axios.post('/api/admin/users', userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: ADMIN_CREATE_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ 
        type: ADMIN_CREATE_USER_FAIL, 
        payload: error.response?.data?.message || error.message 
    });
  }
};

export const updateUser = (userId, userData) => async (dispatch, getState) => {
  dispatch({ type: ADMIN_UPDATE_USER_REQUEST });
  try {
    const token = getToken();
    const { data } = await axios.put(`/api/admin/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: ADMIN_UPDATE_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ 
      type: ADMIN_UPDATE_USER_FAIL, 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const deleteUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: ADMIN_DELETE_USER_REQUEST });
  try {
    const token = getToken();
    await axios.delete(`/api/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: ADMIN_DELETE_USER_SUCCESS, payload: userId });
  } catch (error) {
    dispatch({ 
      type: ADMIN_DELETE_USER_FAIL, 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const getAdminStats = () => async (dispatch, getState) => {
  dispatch({ type: ADMIN_GET_STATS_REQUEST });
  try {
    const token = getToken();
    const { data } = await axios.get('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: ADMIN_GET_STATS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: ADMIN_GET_STATS_FAIL, 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const createDefaultAdmin = () => async (dispatch) => {
  dispatch({ type: ADMIN_CREATE_DEFAULT_REQUEST });
  try {
    const { data } = await axios.post('/api/admin/createadmin');
    dispatch({ type: ADMIN_CREATE_DEFAULT_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ 
      type: ADMIN_CREATE_DEFAULT_FAIL, 
      payload: error.response?.data?.message || error.message 
    });
  }
};
