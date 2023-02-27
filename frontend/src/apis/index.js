import axios from "axios";

const api  = axios.create({
    baseURL: "http://localhost:3500"
});

export const insertUser = payload => api.post("/user/add", payload);
export const loginUser = payload => api.post("user/login", payload);
export const resetUser = payload => api.post("user/reset", payload);
export const getAllUsers = () => api.get("/user");
export const getUser = payload => api.post("/user");
export const deleteUser = email => api.post("/user/delete", email);

const apis = {
    insertUser,
    loginUser,
    resetUser,
    getAllUsers,
    deleteUser
}

export default apis;