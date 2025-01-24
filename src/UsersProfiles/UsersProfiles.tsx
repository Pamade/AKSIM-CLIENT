import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import { ProfileDataUser } from "../Types/types"
import styles from "./UsersProfile.module.scss"
import { useParams } from "react-router-dom"
import DisplayUsers from "../DisplayUsers/DisplayUsers"
function UsersProfiles(){
    const {userName} = useParams()
    const {responseData, isLoading} = useFetchOnLoad<ProfileDataUser[]>("http://localhost:8080/api/content/get-users-profiles")
    const users = responseData?.filter((user) => user.userName !== userName)

    if (isLoading) return <></>
    return (
    <section>
        <h5 className={styles.heading}>Other Aksim Users</h5>
        <div className={styles.wrapper}>
            <DisplayUsers users={users || []}/>   
        </div>
    </section>)
        
}

export default UsersProfiles