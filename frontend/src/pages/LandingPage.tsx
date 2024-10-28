import { useEffect, useState } from "react";
import Header from "../components/Header";
import MainHeading from "../components/MainHeading";
import axios, { AxiosError } from "axios";
import { API_URL } from "../App";

const LandingPage = ({
  token,
  id
  }:{
    token:string | null, 
    id:string | null;
  }) => {

  const [username, setUsername] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [verifiedCertain, setVerifiedCertain] = useState<boolean>(false);


  useEffect(()=>{
    if (!id) {
      setVerified(false);
      setVerifiedCertain(true);
  }
  axios
      .get(`${API_URL}/api/accounts/id/${id}`, {
          headers: {
              Authorization: token,
          },
      })
      .then(({ data }) => {
          setUsername(data.username);
          setVerified(true);
          setVerifiedCertain(true);
      })
      .catch((e: AxiosError) => {
          setVerified(false);
          setVerifiedCertain(true);
      });
  },[])


  return (
    <div className="px-[12px]">

    {verifiedCertain && verified ? (
                <MainHeading
                    data={{
                        username: username,
                        status: "loggedin",
                    }}
                />
            ) : verifiedCertain === true && verified === false ? (
                <MainHeading
                    data={{
                        status: "not-loggedin",
                    }}
                />
            ) : (
              <>
                <MainHeading
                    data={{
                        status: "none",
                    }}
                />
                
                </>
            )}


<Header />
      
    </div>
  );
};

export default LandingPage;
