import axios from "axios";

const BASE_URL = "https://dosewise-2p1n.onrender.com/api";

export const registerPatient = async (data) => {
  return axios.post(`${BASE_URL}/auth/patient/register`, data);
};

export const login = async (data) => {
  return axios.post(`${BASE_URL}/auth/login`, data);
};
