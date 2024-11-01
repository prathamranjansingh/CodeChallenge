import axios, { AxiosError } from 'axios';
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../App';

export const ProblemPage = ({
    data,
    token,
    id,
}: {
    data?: ProblemPageData;
    token: string | null;
    id: string | null;
}) => {
    const [username, setUsername] = useState<string>("");
    const [initCode, setInitCode] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const explanationRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentLang, setCurrentLang] = useState<string>("javascript");
    const handleSlider = (event: React.MouseEvent<HTMLDivElement>) => {
        const mouseX = event.clientX;
        const newWidth = mouseX - 8;
        if (explanationRef.current)
            explanationRef.current.style.width = newWidth + "px";
    };

    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

    const [editorial, setEditorial] = useState<string>("");

    const activeNavOption = data?.activeNavOption || "description";

    const [problemDescriptionData, setProblemDescriptionData] =
        useState<DescriptionData>();

    const [submissionData, setSubmissionData] = useState<Submission[]>();
    const navigate = useNavigate();

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const { name } = useParams();

    const submitCode = () => {
        setIsSubmitLoading(true);

        if(!id || !name){
            console.log("id not found");
            setIsSubmitLoading(false);
            return;    
        }

        const problem_name = name;
        axios
            .post<
                {},
                {data: Submission[]},
                { code: string; id: string; problem_name: string }
            >(`${API_URL}/api/problem/submit/${name}`,{
                code,
                id,
                problem_name
            })
            .then(({data})=>{
                setIsSubmitted(true);
                setSubmissionData(data);
                navigate(`/problem/${name}/submissions`);
                setIsSubmitLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsSubmitLoading(false);
                setIsSubmitted(true);
            });
    }

    useEffect(()=>{
        axios
            .post(`${API_URL}/api/problem/${name}`,{id:id})
            .then(({data}) =>{
                setProblemDescriptionData(
                    data.main as unknown as SetStateAction<
                        DescriptionData | undefined
                    >
                );
                if(
                    "code_body" in data.main &&
                    "javascript" in data.main.code_body
                ){
                    setInitCode(
                        data.main.code_body.javascript as unknown as string
                    )
                }
            })
            .catch((e)=> console.error(e));
            
            if (!token) return;

            axios
            .get(`${API_URL}/api/accounts/id/${id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then(({ data }) => {
                setUsername(data.username);
            })
            .catch((e: AxiosError) => {
                console.log(e);
                navigate("/sorry");
            });

        if (!id || !name) {
            console.log("id not found");
            return;
        }

        axios
            .post<{}, { data: Submission[] }, { id: string }>(
                `${API_URL}/api/problem/submissions/${name}`,
                { id: id || "" }
            )
            .then(({ data }) => {
                if (data.length !== 0) {
                    setCode(data[0].code_body);
                }
                setSubmissionData(data);
            })
            .catch((e) => console.log(e));

    },[])

    useEffect(() => {
        if (activeNavOption === "description") return;

        axios
            .get(`${API_URL}/api/problem/${name}/${activeNavOption}`)
            .then(({ data }) => {
                if (activeNavOption === "editorial") {
                    if ("editorial_body" in data) {
                        setEditorial(data.editorial_body);
                    }
                }
            })
            .catch((e) => console.error(e));
    }, [activeNavOption]);

  return (
    <>
        
    </>
  )
}
