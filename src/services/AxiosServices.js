import axios from "axios";
import { storeAccessToken } from "../variables/LocalStorage";

export default axios.create({
  baseURL: process.env.REACT_APP_BASE_BACKEND_URL,
  timeout: 10000,
  headers: {
    authoriaztion: `bearer ${storeAccessToken}`,
  },
});
