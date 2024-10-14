import axios from "axios";

// Base API URL
const REST_API_BASE_URL = import.meta.env.VITE_APIURL; // Configure your environment variable for the base URL

// Post API URL
const REST_API_URL = `${REST_API_BASE_URL}/post`;

// Function to get all posts
export const getPosts = () => {
  return axios.get(`${REST_API_URL}/get`);
};

// Function to get a specific post by ID
export const getPost = (postId: string) => {
  return axios.get(`${REST_API_URL}/get/${postId}`);
};

// Function to upload a new post
export const uploadPost = (userId: string, formData: FormData) => {
    return axios.post(`${REST_API_URL}/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// Function to update an existing post
export const updatePost = (postId: string, formData: FormData) => {
    return axios.put(`${REST_API_URL}/update/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// Function to delete a post by ID
export const deletePost = (postId: string) => {
  return axios.delete(`${REST_API_URL}/delete/${postId}`);
};
