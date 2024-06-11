import axios from "axios";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://content.guardianapis.com/" as const;


const API_CALL = (
    axios.create({
        baseURL:BASE_URL,
    })
)

function useFetchOnLoad<T>(URL:string) {
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<T>()
    const [error, setError] = useState("")


    useEffect(() => {
        const fetchData= async () => {
                setIsLoading(true);
                try {
                    const res = await API_CALL.get<{ response:{results:T}, status:number}>(URL + `&api-key=${API_KEY}`);
                    if (res.status === 200) {
                        const content = res.data.response.results;
                        setResults(content)
                    }
                    else setError("Could not load content")
                } catch {
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