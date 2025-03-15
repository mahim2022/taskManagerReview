import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"; 
import { Provider } from "react-redux";
import store from "./redux/store";
import TaskList from "./components/TaskList";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
    <Router>
       <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<TaskList />} />
      </Routes>
    </Router>
    </Provider>
  );
}

export default App
