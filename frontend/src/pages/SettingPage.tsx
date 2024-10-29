import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TOKEN_STORAGE_KEY, ID_STORAGE_KEY, API_URL } from "../App";
import axios, { AxiosError } from 'axios';
import { deleteTokenAndId } from '../ts/utils/utils';
import MainHeading from '../components/MainHeading';
import ConfirmModal from '../components/ConfirmModal';
import { Trash2 } from 'lucide-react';

const SettingPage = ({
    token,
    id,
}: {
    token: string | null;
    id: string | null;
}) => {
    const [username, setUsername] = useState<string>("");
    const [verified, setVerified] = useState<boolean>(false);
    const navigate = useNavigate();
    const [deleteAccountConfirm, setDeleteAccountConfirm] =
        useState<boolean>(false);


    const deleteAccountFn = () => {
        console.log("account deleted");
        axios
            .post(
                `${API_URL}/api/accounts/delete/${id}`,
                {},
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then(({ data }) => {
                if (data.success) {
                    deleteTokenAndId(TOKEN_STORAGE_KEY, ID_STORAGE_KEY);
                    navigate("/");
                    window.location.reload();
                } else {
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        axios
            .get(`${API_URL}/api/accounts/id/${id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then(({ data }) => {
                setUsername(data.username);
                setVerified(true);
            })
            .catch((e: AxiosError) => {
                console.log(e);
                if (
                    (e.response?.data as { success: boolean; message: string })
                        .success === false
                ) {
                    navigate("/sorry");
                    setVerified(false);
                }
            });

    }, [])
    return (
        <div className='bodyImg px-[12px]'>
            {verified ? (
                <MainHeading
                    data={{
                        username: username || "",
                        items: [
                            {
                                text: "Problem List",
                                link_path: "/problemset",
                            },
                        ],
                    }}
                />
            ) : (
                <MainHeading data={{ status: "none" }} />
            )}

            <div className="px-[8px] mt-[10%] text-white">
                <div className="bg-[#0000006d] border  border-borders rounded-lg mx-auto justify-center mt-[8px] max-w-[1000px] h-fit px-6 py-2">
                    <h1 className="setting-title text-3xl text-center text-red-600">
                        Delete Account?
                    </h1>
                    <p className="mt-10 text-center">
                    Oh, leaving already? 😢 We’ll miss you like code misses a semicolon! If you're sure, hit delete. If not, let’s pretend this never happened.
                    </p>
                    <div className='flex items-center justify-center mt-10'>
                    <button
                        className="border border-white  bg-opacity-10 py-2 px-4 rounded-lg mt-4 hover:bg-[#ffffff28] "
                        onClick={() => setDeleteAccountConfirm(true)}
                    >
                        <div className="flex gap-2 justify-center items-center">
                            <Trash2 /> <p className="text-sm font-semibold">Delete Your Account</p></div>
                    </button>
                    </div>
                    <ConfirmModal
                        display={deleteAccountConfirm}
                        displayFn={setDeleteAccountConfirm}
                        onOkFn={deleteAccountFn}
                        title="Delete Account"
                        message={`Are you sure you want to delete account ${username}?`}
                    />

                </div>
            </div>
        </div>
    )
}

export default SettingPage;