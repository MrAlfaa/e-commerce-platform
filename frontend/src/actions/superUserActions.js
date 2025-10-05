import axios from 'axios';

export const SUPERUSER_CHECK_REQUEST = 'SUPERUSER_CHECK_REQUEST';
export const SUPERUSER_CHECK_SUCCESS = 'SUPERUSER_CHECK_SUCCESS';
export const SUPERUSER_CHECK_FAIL = 'SUPERUSER_CHECK_FAIL';

export const SUPERUSER_CREATE_REQUEST = 'SUPERUSER_CREATE_REQUEST';
export const SUPERUSER_CREATE_SUCCESS = 'SUPERUSER_CREATE_SUCCESS';
export const SUPERUSER_CREATE_FAIL = 'SUPERUSER_CREATE_FAIL';

export const SUPERUSER_SIGNIN_REQUEST = 'SUPERUSER_SIGNIN_REQUEST';
export const SUPERUSER_SIGNIN_SUCCESS = 'SUPERUSER_SIGNIN_SUCCESS';
export const SUPERUSER_SIGNIN_FAIL = 'SUPERUSER_SIGNIN_FAIL';

// Check if superuser exists
export const checkSuperUserExists = () => async (dispatch) => {
  try {
    dispatch({ type: SUPERUSER_CHECK_REQUEST });
    const { data } = await axios.get('/api/superuser/check');
    dispatch({ type: SUPERUSER_CHECK_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: SUPERUSER_CHECK_FAIL, 
      payload: error.response ? error.response.data.message : error.message 
    });
  }
};

// Create superuser
export const createSuperUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: SUPERUSER_CREATE_REQUEST });
    const { data } = await axios.post('/api/superuser/create', userData);
    dispatch({ type: SUPERUSER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: SUPERUSER_CREATE_FAIL, 
      payload: error.response ? error.response.data.message : error.message 
    });
  }
};

// Superuser signin
export const signInSuperUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: SUPERUSER_SIGNIN_REQUEST });
    const { data } = await axios.post('/api/superuser/signin', { email, password });
    dispatch({ type: SUPERUSER_SIGNIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: SUPERUSER_SIGNIN_FAIL, 
      payload: error.response ? error.response.data.message : error.message 
    });
  }
};
