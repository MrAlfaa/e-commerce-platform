import {
  SUPERUSER_CHECK_REQUEST,
  SUPERUSER_CHECK_SUCCESS,
  SUPERUSER_CHECK_FAIL,
  SUPERUSER_CREATE_REQUEST,
  SUPERUSER_CREATE_SUCCESS,
  SUPERUSER_CREATE_FAIL,
  SUPERUSER_SIGNIN_REQUEST,
  SUPERUSER_SIGNIN_SUCCESS,
  SUPERUSER_SIGNIN_FAIL
} from '../constants/superUserConstants';

function superUserCheckReducer(state = { exists: false, loading: false }, action) {
  switch (action.type) {
    case SUPERUSER_CHECK_REQUEST:
      return { loading: true };
    case SUPERUSER_CHECK_SUCCESS:
      return { loading: false, exists: action.payload.exists };
    case SUPERUSER_CHECK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function superUserCreateReducer(state = {}, action) {
  switch (action.type) {
    case SUPERUSER_CREATE_REQUEST:
      return { loading: true };
    case SUPERUSER_CREATE_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case SUPERUSER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function superUserSigninReducer(state = {}, action) {
  switch (action.type) {
    case SUPERUSER_SIGNIN_REQUEST:
      return { loading: true };

    case SUPERUSER_SIGNIN_SUCCESS:
      return { loading: false, userInfo: action.payload };

    case SUPERUSER_SIGNIN_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
}

export {
  superUserCheckReducer,
  superUserCreateReducer,
  superUserSigninReducer
};
