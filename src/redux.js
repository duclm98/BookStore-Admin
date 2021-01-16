import jwt_decode from "jwt-decode";
import * as localStorageVariable from "./variables/LocalStorage";
import instance from "./services/AxiosServices";

const LOGIN_SUCCESS = "LOGIN_SUCESS";
const LOGOUT_SUCCESS = "LOGOUT_SUCCES";

export const authAction = {
  login: (username, password) => async (dispatch) => {
    try {
      const { data } = await instance.post("auth/login", {
        tenDangNhap: username,
        matKhau: password,
      });

      const account = jwt_decode(data.access_token);

      localStorage.setItem(
        localStorageVariable.storeAccessToken,
        data.access_token
      );

      localStorage.setItem(
        localStorageVariable.storeAccount,
        JSON.stringify(account)
      );

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          accessToken: data.access_token,
          account,
        },
      });

      return {
        status: true,
      };
    } catch (error) {
      let msg = "Có lỗi xảy ra, vui lòng thử lại.";
      if (error.response) {
        msg = error.response.data.message;
      }

      return {
        status: false,
        msg,
      };
    }
  },
  logout: () => (dispatch) => {
    localStorage.clear();

    dispatch({
      type: LOGOUT_SUCCESS,
    });
  },
};

const GET_ACCOUNTS_LIST_SUCCESS = "GET_ACCOUNTS_LIST_SUCCESS";

export const accountAction = {
  getAccounts: () => async (dispatch) => {
    try {
      instance.defaults.headers.common[
        "Authorization"
      ] = `bearer ${localStorage.getItem(
        localStorageVariable.storeAccessToken
      )}`;

      const { data } = await instance.get(`auth/users`);

      dispatch({
        type: GET_ACCOUNTS_LIST_SUCCESS,
        payload: data.data,
      });

      return {
        status: true,
        data: data.data,
      };
    } catch (error) {
      return {
        status: false,
      };
    }
  },
};

const GET_CATEGORIES_LIST_SUCCES = "GET_CATEGORIES_LIST_SUCCES";
const ADD_CATEGORY_SUCCESS = "ADD_CATEGORY_SUCCESS";
const DELETE_CATEGORY_SUCCESS = "DELETE_CATEGORY_SUCCESS";
const HANDLE_EDIT_CATEGORY = "HANDLE_EDIT_CATEGORY";
const EDIT_CATEGORY_SUCCESS = "EDIT_CATEGORY_SUCCESS";

export const categoryAction = {
  getCategories: () => async (dispatch) => {
    try {
      instance.defaults.headers.common[
        "Authorization"
      ] = `bearer ${localStorage.getItem(
        localStorageVariable.storeAccessToken
      )}`;

      const { data } = await instance.get(`categories`);

      dispatch({
        type: GET_CATEGORIES_LIST_SUCCES,
        payload: data,
      });

      return {
        status: true,
        data: data,
      };
    } catch (error) {
      return {
        status: false,
      };
    }
  },
  addCategory: (ten) => async (dispatch) => {
    try {
      instance.defaults.headers.common[
        "Authorization"
      ] = `bearer ${localStorage.getItem(
        localStorageVariable.storeAccessToken
      )}`;

      const { data } = await instance.post(`categories`, { ten });

      dispatch({
        type: ADD_CATEGORY_SUCCESS,
        payload: data,
      });

      return {
        status: true,
        data: data,
      };
    } catch (error) {
      let msg = "Có lỗi xảy ra, vui lòng thử lại.";
      if (error.response) {
        msg = error.response.data.message;
      }

      return {
        status: false,
        msg,
      };
    }
  },
  deleteCategory: (id) => async (dispatch) => {
    try {
      instance.defaults.headers.common[
        "Authorization"
      ] = `bearer ${localStorage.getItem(
        localStorageVariable.storeAccessToken
      )}`;

      await instance.delete(`categories/${id}`);

      dispatch({
        type: DELETE_CATEGORY_SUCCESS,
        payload: {
          id,
        },
      });

      return {
        status: true,
      };
    } catch (error) {
      let msg = "Có lỗi xảy ra, vui lòng thử lại.";
      if (error.response) {
        msg = error.response.data.message;
      }

      return {
        status: false,
        msg,
      };
    }
  },
  handleEditCategory: (id) => async (dispatch) => {
    dispatch({
      type: HANDLE_EDIT_CATEGORY,
      payload: {
        id,
      },
    });
  },
  editCategory: (id, ten) => async (dispatch) => {
    try {
      instance.defaults.headers.common[
        "Authorization"
      ] = `bearer ${localStorage.getItem(
        localStorageVariable.storeAccessToken
      )}`;

      await instance.patch(`categories/${id}/name`, {
        ten,
      });

      dispatch({
        type: EDIT_CATEGORY_SUCCESS,
        payload: {
          id,
          ten,
        },
      });

      return {
        status: true,
      };
    } catch (error) {
      let msg = "Có lỗi xảy ra, vui lòng thử lại.";
      if (error.response) {
        msg = error.response.data.message.toString();
      }

      return {
        status: false,
        msg,
      };
    }
  },
};

const initialState = {
  accessToken: localStorage.getItem(localStorageVariable.storeAccessToken),
  account: localStorage.getItem(localStorageVariable.storeAccount),
  accountsList: {
    data: [],
    change: true,
  },
  categoriesList: {
    data: [],
    change: true,
  },
  editCategory: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    // Reducer cho auth action
    case LOGIN_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        account: action.payload.account,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        accessToken: null,
        account: null,
      };

    // Reducer cho account action
    case GET_ACCOUNTS_LIST_SUCCESS:
      return {
        ...state,
        accountsList: {
          data: action.payload,
          change: false,
        },
      };

    // Reducer cho categories action
    case GET_CATEGORIES_LIST_SUCCES:
      return {
        ...state,
        categoriesList: {
          data: action.payload,
          change: false,
        },
      };
    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        categoriesList: {
          change: false,
          data: [...state.categoriesList.data, action.payload],
        },
      };
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categoriesList: {
          change: false,
          data: state.categoriesList.data.filter(
            (i) => i.id !== action.payload.id
          ),
        },
      };
    case HANDLE_EDIT_CATEGORY:
      return {
        ...state,
        editCategory: action.payload.id,
      };
    case EDIT_CATEGORY_SUCCESS:
      return {
        ...state,
        categoriesList: {
          change: false,
          data: state.categoriesList.data.map((i) => {
            if (i.id === action.payload.id) {
              i.ten = action.payload.ten;
            }
            return i;
          }),
        },
      };

    default:
      return state;
  }
};
