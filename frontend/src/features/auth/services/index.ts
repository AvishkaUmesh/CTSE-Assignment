import axios from "axios";
import { LoginFormValues } from "../schemas";

const API_URL = "http://localhost:5010/api/users/login";

export const loginUser = async (loginData: LoginFormValues) => {
  try {
    const response = await axios.post(API_URL, loginData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
