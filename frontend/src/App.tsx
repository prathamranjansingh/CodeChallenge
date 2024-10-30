import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useEffect, useState } from "react";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import ProblemSet from "./pages/ProblemSet";

export const API_URL = "http://localhost:80";
export const TOKEN_STORAGE_KEY = "authToken";
export const ID_STORAGE_KEY = "id";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [id, setId] = useState(localStorage.getItem(ID_STORAGE_KEY));

  const changeToken = (string: string) => {
    setToken(string);
  };
  const changeId = (string: string) => {
    setId(string);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    if (id) {
      localStorage.setItem(ID_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(ID_STORAGE_KEY);
    }
  }, [token, id]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage token={token} id={id} />}></Route>
          <Route path="/problemset" element={<ProblemSet token={token} id={id} />} />



          <Route path="/login" element={<Login Data={{
            token: token || "",
            setTokenFunction: changeToken,
            id: id || "",
            setIdFunction: changeId,
          }} />}></Route>
          <Route path="/signup" element={<SignUp Data={{
            token: token || "",
            setTokenFunction: changeToken,
            id: id || "",
            setIdFunction: changeId,
          }} />}></Route>
          <Route
            path="/settings"
            element={<SettingPage token={token} id={id} />}
          />
          <Route
            path="/accounts/:name"
            element={<ProfilePage token={token} id={id} />}
          />
        </Routes>

      </BrowserRouter>
    </>
  );
};
export default App;
