import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import Loading from "../components/Loading";

const Login = ({
  Data,
}: {
  Data: {
    token: string;
    setTokenFunction: (string: string) => void;
    id: string;
    setIdFunction: (string: string) => void;
  };
}) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setisLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setisLoading(true);
    try {
      axios
        .post(`${API_URL}/api/accounts/login`, {
          username_or_email: usernameOrEmail,
          password: password,
        })
        .then(({ data }) => {
          if (data.success === false) {
            setMessage(data.message);
            return;
          }
          Data.setTokenFunction(data.token);
          Data.setIdFunction(data.id);
          navigate("/problemset");
        })
        .catch((e: AxiosError) => {
          setisLoading(false);
          setMessage(
            (
              e.response?.data as {
                success: boolean;
                message: string;
              }
            ).message
          );
        });
    } catch (error) {
      console.error("Sign-up failed:", error);
    }
  };

  return (
    <div className="bodyImg">
      <div className="fixed top-0 w-full py-4 shadow-md">
        <div className="container mx-auto px-4">
          <Link to="/">
            <h1 className="text-white text-3xl text-center font-normal">
              CodeStakes
            </h1>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center h-screen">
        <div className="min-h-fit w-[300px] mx-auto text-[14px]">
          <div className="relative bg-[#ffffff0a] shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-[34px] text-white font-bold mb-[30px] text-center mt-[60px]">
              Log In
            </h2>
            <div className="mb-4">
              <input
                className="appearance-none text-white border w-full py-2 px-3  focus:placeholder:text-orange-500 bg-[#ffffff0a] rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                type="text"
                placeholder="Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required={true}
              />
            </div>
            <div className="mb-6">
              <input
                className="appearance-none text-white border w-full py-2 px-3  focus:placeholder:text-orange-500 bg-[#ffffff0a] rounded border-borders leading-tight focus:outline-none focus:border-orange-500"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-orange-500 hover:bg-red-600 text-white font-bold py-[6px] px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
                type="button"
                onClick={handleLogin}
              >
                {isLoading ? (
                  <div className="w-full block h-[21px]">
                    <div className="absolute left-1/2 -translate-x-1/2">
                      <Loading />
                    </div>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-[20px]">
              <span className="text-white">Don't have an account? </span>
              <Link
                to="/signup"
                className="text-black font-bold hover:text-white"
              >
                Signup
              </Link>
            </div>
            <div className="text-center mt-[20px] text-white w-full overflow-hidden">
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;