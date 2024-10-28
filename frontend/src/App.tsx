import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useEffect, useState } from "react";

export const API_URL = "http://localhost:5040";
export const TOKEN_STORAGE_KEY = "id";
export const ID_STORAGE_KEY="id";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [id, setId] = useState(localStorage.getItem(ID_STORAGE_KEY));


  const changeToken = (string: string) => {
    setToken(string);
  };
  const changeId = (string: string) => {
      setId(string);
  };

  useEffect(()=>{
    if(token){
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    }else{
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    if(id){
      localStorage.setItem(ID_STORAGE_KEY, id);
    }
    else{
      localStorage.removeItem(ID_STORAGE_KEY)
    }
  },[token,id])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage token={token} id={id} />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default App;
