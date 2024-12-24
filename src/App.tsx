import { useEffect } from "react"
import { useUserContext } from "./Context/UserContext"

interface Props {
    children: React.ReactNode
}

const App = ({children}:Props) => {
    const {fetchUserData} = useUserContext();
    useEffect(() => {
        const token = localStorage.getItem("access_token")
        if (token) fetchUserData(token)
    }, [])
    return <>{children}</>
}
export default App