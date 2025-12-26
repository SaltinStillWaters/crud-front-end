import axios from "axios";
import { useSnackbarStore } from "./snackbar";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export const web = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Accept: "application/json",
  }
});

api.interceptors.request.use(config => {
  const token = Cookies.get('XSRF-TOKEN')

  if (token) {
    config.headers['X-CSRF-TOKEN'] = decodeURIComponent(token)
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("FROM AXIOS");
    console.error({ err });
    const snackbar = useSnackbarStore();

    if (!err.response) {
      snackbar.error("Network error. Please check your connection");
      return Promise.reject(err);
    }

    const { status, data } = err.response;

    switch (status) {
      case 401:
        snackbar.error("Unauthorized. Please log in");
        break;

      case 403:
        snackbar.error("You do not have permission to perform this action");
        break;

      case 404:
        snackbar.error("Resource not found");
        break;

      case 422:
        snackbar.error(data.message ?? "Invalid input");
        break;

      case 500:
        snackbar.error("Something went wrong. Please try again");
        break;

      default:
        snackbar.error("Something went wrong");
    }

    return Promise.reject(err);
  }
);
