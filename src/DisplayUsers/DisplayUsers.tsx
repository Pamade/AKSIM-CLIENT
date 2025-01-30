import { Link } from "react-router-dom";
import { ProfileDataUser} from "../Types/types";
import userNotFound from "../assets/user.png"
import styles from "./DisplayUsers.module.scss";

interface Props {
    users: ProfileDataUser[];
}

function DisplayUsers({users}:Props) {

    return (
        users?.map((user) => 
            <Link key={user.userEmail} to={`/profile/${user.userName}`} className={styles.single_user}>
                <img className={styles.avatar} src={user.profilePictureLink || userNotFound} alt="user"/>
                <h6 className={styles.user_name}>{user.userName}</h6>
            </Link>
    )
)
}

export default DisplayUsers;