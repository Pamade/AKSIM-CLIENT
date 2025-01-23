import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import userNotFound from "../assets/user.png"
import { ProfileDataUser } from "../Types/types"
import styles from "./UsersProfile.module.scss"
import { Link, useParams } from "react-router-dom"
function UsersProfiles(){
    const {userName} = useParams()
    console.log(userName)
    const {responseData, isLoading} = useFetchOnLoad<ProfileDataUser[]>("http://localhost:8080/api/content/get-users-profiles")
    const users = responseData?.filter((user) => user.userName !== userName)
    if (isLoading) return <></>
    return (
    <section>
        <h5 className={styles.heading}>Other Aksim Users</h5>
        <div className={styles.wrapper}>
            {users?.map((user) => 
            <Link  to={`/profile/${user.userName}`} className={styles.single_user}>
                <img className={styles.avatar} src={user.profilePictureLink || userNotFound} alt="user"/>
                <h6 className={styles.user_name}>{user.userName}</h6>
                {/* <h6>{user.userEmail}</h6> */}
            </Link>
            )}</div>
    </section>)
        
}

export default UsersProfiles