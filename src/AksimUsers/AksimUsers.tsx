import styles from "./AksimUsers.module.scss";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { ProfileDataUser } from "../Types/types";
import DisplayUsers from "../DisplayUsers/DisplayUsers";

function AksimUsers() {
    const {responseData, isLoading, error} = useFetchOnLoad<ProfileDataUser[]>("http://localhost:8080/api/content/get-users-aksim")
    if (isLoading) return <Loader />
    if (error) return <ErrorMessage error="Could not load users"/>
    if (responseData?.length === 0) return <ErrorMessage error="Users not found"/>
    return (
    <section>
        <div>
            <div className={styles.users_wrapper}>
                <DisplayUsers users={responseData!}/>
            </div>
        </div>
    </section>
    )
}

export default AksimUsers;