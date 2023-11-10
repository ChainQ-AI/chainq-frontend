// api.js

import axios from "axios";

// const API_BASE_URL = "http://localhost:3002/";
const API_BASE_URL = "https://chainqscroll.lampros.tech/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Function to add a user
export const addUser = (userAddress, signature) => {
  return axiosInstance.post("/login", { userAddress, signature });
};

// Function to add a chat
export const addChat = (userAddress, chatId, promptText, token) => {
  return axiosInstance.post(
    "/dummyChat",
    // "/chat",
    { userAddress, chatId, promptText },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Function to delete a chat
export const deleteChat = (chatId, token) => {
  return axiosInstance.delete(`/deleteChat/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserChatIds = (userAddress, token) => {
  return axiosInstance.get(`/getUserChatIds/${userAddress}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUserData = (userAddress, token) => {
  return axiosInstance.delete(`/deleteUserData/${userAddress}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getChatPromptsAndResponses = (chatId, token) => {
  return axiosInstance.get(`/getChatPromptsAndResponses/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
