import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/ai",
});

export const uploadFile = (file, action) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("action", action);

  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
