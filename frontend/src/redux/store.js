import { configureStore } from "@reduxjs/toolkit";
import taskReducer,{ addTask } from "./taskSlice";
import authReducer from "./authSlice";
import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:5137");

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
  },
});


// Listen for "new_task" event and dispatch action
socket.on("new_task", (task) => {
  store.dispatch(addTask(task));
});

export default store;
