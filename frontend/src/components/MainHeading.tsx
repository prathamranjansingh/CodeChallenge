import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import SidePanel from "./SidePanel";
import Tooltip from "./Tooltip";
import Notification from "./Notification";

export const SlideTabsExample = () => {
  return (
    <div className="py-20">
      <MainHeading />
    </div>
  );
};

const MainHeading = ({ data }: { data?: MainHeadingData }) => {
  const [sidePanelState, setSidePanelState] = useState<boolean>(false);
  const [notifDisplayState, setNotifDisplayState] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center justify-end md:justify-between mx-2 h-20">
        <Link to="/" className="select-none hidden md:block">
          <h1 className="text-white text-2xl font-normal ">CodeStakes</h1>
        </Link>
        {data != undefined &&
          "items" in data &&
          data.items != undefined &&
          data.items.length !== 0 &&
          data.items.map((elem) => (
            <Link
              to={elem.link_path}
              className="mt-[15px] hidden md:inline-block text-[14px] h-fit p-[5px] text-[#808080] hover:text-white transition"
            >
              <div id={elem.text}>{elem.text}</div>
            </Link>
          ))}
        {data?.status === "loggedin" || data?.status == undefined ? (
          <div className="flex flex-row right-[36px] items-center h-[60px]">
            <div className="inline-block p-[5px] text-[14px] text-[#808080] md:hidden">
              
            </div>

            <div
              id="notification"
              className="inline-block p-[5px] text-[14px] text-[#808080] "
            >
              <Notification
                display={notifDisplayState}
                displayFn={setNotifDisplayState}
              />
            </div>
            <div
              id="profile-picture"
              className="inline-block relative p-[5px] text-[14px] text-[#808080] "
              onClick={() => setSidePanelState(!sidePanelState)}
            >
              <Tooltip text={data?.username || ""}>
                <div className="w-[32px] h-[32px] border rounded-[99px]"></div>
              </Tooltip>
            </div>
            <SidePanel
              displayFn={setSidePanelState}
              display={sidePanelState}
              data={{
                username: data?.username || "",
              }}
            />
          </div>
        ) : data?.status === "not-loggedin" ? (<div className="flex flex-row right-[36px] items-center h-[60px]">
          <Link
            to="/login"
            className="inline-block font-bold py-[6px] px-[16px] bg-black hover:bg-[#ffffff26] border rounded-md  text-white text-[14px]"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="ml-[8px] font-bold inline-block py-[6px] px-[16px] bg-gradient-to-r from-orange-500 to-red-600  rounded-md text-black text-[14px] hover:bg-red-800"
          >
            Sign Up
          </Link>
        </div>)

          : (<></>)}


      </div>
      
    </>
  );
};



export default MainHeading;
