import axios from "axios";

// Base API URL
const REST_API_BASE_URL = import.meta.env.VITE_APIURL; // Configure your environment variable for the base URL

// User API URL
const REST_API_URL = `${REST_API_BASE_URL}/user`;

// Function to check user credentials
export const checkUser = (userId: string, userPw: string) => {
  return axios.get(`${REST_API_URL}/check/${userId}/${userPw}`);
};

// Function to get a user by ID
export const getUser = (userId: string) => {
  return axios.get(`${REST_API_URL}/${userId}`);
};

// Function to register a new user
export const registerUser = (userEntity: any) => {
  return axios.post(`${REST_API_URL}/register`, userEntity);
};

// Function to update a user
export const updateUser = (userId: string, formData: FormData) => {
    return axios.put(`${REST_API_URL}/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
  };

// Function to delete a user
export const deleteUser = (userId: string, password: string) => {
    return axios.delete(`${REST_API_URL}/delete/${userId}/${password}`);
};

// Function to follow another user
export const followUser = (fromUserId: string, toUserId: string) => {
  const params = {
    fromUserId: fromUserId,
    toUserId: toUserId,
  };
  return axios.post(`${REST_API_URL}/follow`, null, { params });
};

// Function to delete a user from followers
export const deleteUserFromFollower = (fromUserId: string, toUserId: string) => {
  const params = {
    fromUserId: fromUserId,
    toUserId: toUserId,
  };
  return axios.post(`${REST_API_URL}/deleteUserFromFollowers`, null, { params });
};
