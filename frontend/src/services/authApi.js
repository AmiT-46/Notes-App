import axiosInstance from "../utils/axiosInstance";

export const login = (credentials) => axiosInstance.post("/login", credentials);
export const signUp = (details) => axiosInstance.post("/create-account", details);
export const getUser = () => axiosInstance.get("/get-user");
export const updateProfile = (details) => axiosInstance.patch("/update-profile", details);
