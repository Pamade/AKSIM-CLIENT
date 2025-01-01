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
    const [responseData, setResponseData] = useState<T | null>(null)
    const [error, setError] = useState("")


    useEffect(() => {
        const fetchData= async () => {
                setIsLoading(true);
                try {
                    const res = await axios.get(URL);
                    if (res.status === 200 && res.data) {
                        // const content = res.data as T;
                        setResponseData(res.data)
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
    return {isLoading, responseData, error};
}
    
export default useFetchOnLoad