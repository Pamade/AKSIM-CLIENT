import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_API_KEY;
// const BASE_URL = "https://content.guardianapis.com/" as const;


// const API_GET_CONTENT = (
//     axios.create({
//         baseURL:BASE_URL,
//         method:"GET"
//     })
// )

function useFetchOnLoad<T>(URL:string) {
    const [isLoading, setIsLoading] = useState(false)
    const [results, setContent] = useState<T | null>(null)
    const [error, setError] = useState("")


    useEffect(() => {
        const fetchData= async () => {
                setIsLoading(true);
                // + `&api-key=${API_KEY}
                try {
                    const res = await axios.get<AxiosResponse<any>>(`https://content.guardianapis.com/&api-key=${API_KEY}`);
                    if (res.status === 200 && res.data) {
                        const content = res.data as T;
                        setContent(content)
                    }
                } catch (e) {
                    setError("Could not load content");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }, []
    )
    return {isLoading, results, error};
}
    
export default useFetchOnLoad