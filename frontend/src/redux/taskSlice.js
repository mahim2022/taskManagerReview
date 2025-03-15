import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/api";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// Fetch tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await API.get("/tasks");
  return response.data;
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [], loading: false },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      });
  },
});

export const { addTask } = taskSlice.actions;
export default taskSlice.reducer;

// // Listen for new tasks
// socket.on("new_task", (task) => {
//   store.dispatch(addTask(task));
// });
