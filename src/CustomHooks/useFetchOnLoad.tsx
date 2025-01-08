import axios from "axios";
import { errorMonitor } from "events";
import { useEffect, useState } from "react";

function useFetchOnLoad<T>(URL:string) {
    const [isLoading, setIsLoading] = useState(false)
    const [responseData, setResponseData] = useState<T | null>(null)
    const [error, setError] = useState("")
    
    console.log(error, responseData)
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
            
            fetchData();
            
        }, [URL]
    )
    return {isLoading, responseData, error};
}
    
export default useFetchOnLoad