import {
  ADMIN_SIGNIN_REQUEST,
  ADMIN_SIGNIN_SUCCESS,
  ADMIN_SIGNIN_FAIL,
  ADMIN_LIST_USERS_REQUEST,
  ADMIN_LIST_USERS_SUCCESS,
  ADMIN_LIST_USERS_FAIL,
  ADMIN_CREATE_USER_REQUEST,
  ADMIN_CREATE_USER_SUCCESS,
  ADMIN_CREATE_USER_FAIL,
  ADMIN_UPDATE_USER_REQUEST,
  ADMIN_UPDATE_USER_SUCCESS,
  ADMIN_UPDATE_USER_FAIL,
  ADMIN_DELETE_USER_REQUEST,
  ADMIN_DELETE_USER_SUCCESS,
  ADMIN_DELETE_USER_FAIL,
  ADMIN_GET_STATS_REQUEST,
  ADMIN_GET_STATS_SUCCESS,
  ADMIN_GET_STATS_FAIL,
  ADMIN_CREATE_DEFAULT_REQUEST,
  ADMIN_CREATE_DEFAULT_SUCCESS,
  ADMIN_CREATE_DEFAULT_FAIL
} from '../actions/adminActions';

function adminSigninReducer(state = {}, action) {
  switch (action.type) {
    case ADMIN_SIGNIN_REQUEST:
      return { loading: true };
    case ADMIN_SIGNIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case ADMIN_SIGNIN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function adminUsersReducer(state = { users: [] }, action) {
  switch (action.type) {
    case ADMIN_LIST_USERS_REQUEST:
      return { loading: true };
    case ADMIN_LIST_USERS_SUCCESS:
      return { loading: false, users: action.payload };
    case ADMIN_LIST_USERS_FAIL:
      return { loading: false, error: action.payload };
    case ADMIN_CREATE_USER_SUCCESS:
      return { ...state, users: [...state.users, action.payload] };
    case ADMIN_UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        )
      };
    case ADMIN_DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };
    default:
      return state;
  }
}

function adminCreateUserReducer(state = {}, action) {
  switch (action.type) {
    case ADMIN_CREATE_USER_REQUEST:
      return { loading: true };
    case ADMIN_CREATE_USER_SUCCESS:
      return { loading: false, success: true };
    case ADMIN_CREATE_USER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function adminUpdateUserReducer(state = {}, action) {
  switch (action.type) {
    case ADMIN_UPDATE_USER_REQUEST:
      return { loading: true };
    case ADMIN_UPDATE_USER_SUCCESS:
      return { loading: false, success: true };
    case ADMIN_UPDATE_USER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function adminDeleteUserReducer(state = {}, action) {
  switch (action.type) {
    case ADMIN_DELETE_USER_REQUEST:
      return { loading: true };
    case ADMIN_DELETE_USER_SUCCESS:
      return { loading: false, success: true };
    case ADMIN_DELETE_USER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function adminStatsReducer(state = {}, action) {
  switch (action.type) {
    case ADMIN_GET_STATS_REQUEST:
      return { loading: true };
    case ADMIN_GET_STATS_SUCCESS:
      return { loading: false, stats: action.payload };
    case ADMIN_GET_STATS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function adminCreateDefaultReducer(state = {}, action) {
  switch (action.type) {
    case ADMIN_CREATE_DEFAULT_REQUEST:
      return { loading: true };
    case ADMIN_CREATE_DEFAULT_SUCCESS:
      return { loading: false, success: true };
    case ADMIN_CREATE_DEFAULT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export {
  adminSigninReducer,
  adminUsersReducer,
  adminCreateUserReducer,
  adminUpdateUserReducer,
  adminDeleteUserReducer,
  adminStatsReducer,
  adminCreateDefaultReducer
};
