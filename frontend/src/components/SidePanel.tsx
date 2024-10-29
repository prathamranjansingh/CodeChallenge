import React, { Dispatch, SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { TOKEN_STORAGE_KEY, ID_STORAGE_KEY } from "../App";
import { deleteTokenAndId } from "../ts/utils/utils";

const SidePanelItem = ({
    text,
    to,
    style,
}: {
    text: string;
    to: string;
    style?: React.CSSProperties;
}) => {
    return (
        <Link
            to={to}
            className="slide block text-lg font-light w-[88%] mx-auto my-[8px] rounded-md py-[6px] px-[10px] text-[14px] hover:text-white"
            style={style}
        >
            <div>{text}</div>
        </Link>
    );
};

const SidePanel = ({
    displayFn,
    display,
    data,
}: {
    display: boolean;
    displayFn: Dispatch<SetStateAction<boolean>>;
    data: SidePanelData;
}) => {
    const [logoutState, setLogoutState] = useState<boolean>(false);

    const navigate = useNavigate();
    const onLogout = () => {
        deleteTokenAndId(TOKEN_STORAGE_KEY, ID_STORAGE_KEY);
        navigate("/");
        window.location.reload();
    };

    return (
        <>
            <div
                onClick={() => displayFn(false)}
                className={`w-screen h-screen ${
                    display ? "fixed" : "hidden"
                } top-0 left-0 z-[80] backdrop-blur-sm `}
            ></div>
            <div
                className={` fixed z-[90] ${
                    display ? "translate-x-[-100%]" : " translate-x-[0]"
                } left-full top-[-1px] rounded-l-lg bg-black bg-opacity-70 text-white font-semibold h-[calc(100vh+2px)] w-[320px] transition ease-in-out `}
            >
                <div className="relative h-[100px] top-4 ">
                    <div className="absolute top-[10px] left-[28px] text-lg font-light">
                       Hello {data.username} ! 👋
                    </div>
                    <button
                        onClick={() => displayFn(false)}
                        className="bg-whtie relative w-[30px] h-[30px] text-white hover:text-white hover:bg-borders rounded-md left-[274px] top-[13px] "
                    >
                        <span className="material-symbols-outlined">
                        close
                        </span>
                    </button>
                </div>
                
                <SidePanelItem
                    text="Your profile"
                    to={`/accounts/${data.username}`}
                />
                <SidePanelItem text="Problem list" to={`/problemset`} />
                <SidePanelItem text="Settings" to={`/settings`} />

                
                <div
                    className=" block w-[88%] mx-auto text-center text-lg font-light border border-1 border-white my-10 rounded-md hover:bg-borders py-[6px] px-[10px] text-[14px] hover:text-white hover:bg-[#ffffff28] cursor-pointer "
                    onClick={() => setLogoutState(!logoutState)}
                >
                    Log out
                </div>

                <ConfirmModal
                    display={logoutState}
                    displayFn={setLogoutState}
                    onOkFn={onLogout}
                    title="Log Out"
                    message={`Are you sure you want to lot out of ${data.username}?`}
                />
            </div>
        </>
    );
};

export default SidePanel;
