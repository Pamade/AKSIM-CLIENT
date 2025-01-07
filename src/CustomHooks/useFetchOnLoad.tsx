import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function useFetchOnLoad<T>(URL:string) {
    const [isLoading, setIsLoading] = useState(false)
    const [responseData, setResponseData] = useState<T | null>(null)
    const [error, setError] = useState("")
    const location = useLocation();

    useEffect(() => {
        const fetchData= async () => {
                setIsLoading(true);
                try {
                    const res = await axios.get(URL);
                    if (res.status === 200 && res.data) {
                        setResponseData(res.data)
                    }
                } catch (e) {
                    setError("Could not load content");
                } finally {
                    setIsLoading(false);
                }
            };
            console.log(isLoading)
            fetchData();
        }, [location]
    )
    return {isLoading, responseData, error};
}
    
export default useFetchOnLoad