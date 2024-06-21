import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://content.guardianapis.com/" as const;


const API_GET_CONTENT = (
    axios.create({
        baseURL:BASE_URL,
        method:"GET"
    })
)

function useFetchOnLoad<T>(URL:string) {
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<T | null>(null)
    const [error, setError] = useState("")


    useEffect(() => {
        const fetchData= async () => {
                setIsLoading(true);
                // + `&api-key=${API_KEY}
                try {
                    const res = await API_GET_CONTENT.get<AxiosResponse<any>>(URL + `&api-key=${API_KEY}`);
                    if (res.status === 200 && res.data) {
                        const content = res.data as T;
                        setResults(content)
                    }
                } catch (e) {
                    console.log(e)
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

// import axios, { AxiosResponse } from "axios";
// import { useEffect, useState } from "react";

// const API_KEY = import.meta.env.VITE_API_KEY;
// const BASE_URL = "https://content.guardianapis.com/" as const;


// const API_CALL = (
//     axios.create({
//         baseURL:"http://localhost:8080/api/auth",
//         // method:"GET"
//     })
// )

// function useFetchOnLoad<T>(URL:string, value:string) {
//     const [isLoading, setIsLoading] = useState(false)
//     const [results, setResults] = useState<T | undefined>(undefined)
//     const [error, setError] = useState("")


//     useEffect(() => {
//         const fetchData= async () => {
//                 setIsLoading(true);
//                 // + `&api-key=${API_KEY}
//                 try {
//                     const res = await API_CALL.post<AxiosResponse<any>>(URL, {"value":`${value}`, "type":"forgot_password"});
//                     console.log(res)
//                     if (res.status === 200 && res.data) {
//                         const content = res.data as T;
//                         setResults(content)
//                     }
//                     // else setError("Could not load content")
//                 } catch (e) {
//                     console.log(e)
//                     setError("Could not load content");
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };
//             fetchData();
//         }, []
//     )
//     return {isLoading, results, error};
// }
    
// export default useFetchOnLoad