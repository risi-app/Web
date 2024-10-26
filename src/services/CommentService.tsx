import axios from "axios";

// Base API URL
const REST_API_BASE_URL = import.meta.env.VITE_APIURL;

// Comment API URL
const REST_API_COMMENT_URL = `${REST_API_BASE_URL}/comment`;

export const addComment = (postId: string, userId: string, comment: string) => {
  // Send the comment as plain text
  return axios.post(`${REST_API_COMMENT_URL}/add/${postId}/${userId}`, comment, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

// Function to update a comment
export const editComment = (commentId: string, comment: string) => {
  // Send just the comment string directly
  return axios.put(`${REST_API_COMMENT_URL}/update/${commentId}`, comment, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

// Function to delete a comment
export const deleteComment = (commentId: string) => {
  return axios.delete(`${REST_API_COMMENT_URL}/delete/${commentId}`);
};

// Function to like a comment
export const likeComment = (commentId: string) => {
  return axios.post(`${REST_API_COMMENT_URL}/like/${commentId}`);
};
