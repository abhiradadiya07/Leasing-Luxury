import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://leasing-luxury-api.vercel.app/api",
  withCredentials: true,
  timeout: 120000,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    error.message = error?.response?.data?.message || "An error occurred";
    return Promise.reject({ ...error, message: errorMessage });
  }
);
export default axiosInstance;
