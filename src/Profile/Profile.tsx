import styles from "./Profile.module.scss" 
import userNotFound from "../assets/user.png"
import HeadingWithLink from "../HeadingWithLink/HeadingWithLink";
import { Outlet, useParams } from "react-router";
import { useUserContext } from "../Context/UserContext";
import { MdArticle } from "react-icons/md";
import { IoSettings } from "react-icons/io5";

const sections = 
    [ 
    {text:"YOUR ARTICLES", path:"./", icon:MdArticle},
    {text:"ACCOUNT SETTINGS", path:"./settings", icon:IoSettings}] as const;


function Profile() {
    
    const {state} = useUserContext()
    const {userName} = useParams()
    const isCurrentLoggedUser = userName === state.user?.name
    

    const loggedUserContent = (
        <ul className={styles.list}>
            {sections.map((section) => <li><HeadingWithLink path={section.path} text={section.text} Icon={section.icon}/></li>)}
        </ul>
    )
   
   return (
        <section className={styles.wrapper}>
            <div className={styles.profile}>
                <div className={styles.avatar_name}>
                    <img className={styles.user_avatar} src={userNotFound} alt="user" /> 
                    <p className={styles.name}>{userName}</p>
                </div>
                {isCurrentLoggedUser && loggedUserContent}
            </div>
            <div className={styles.content_wrapper}>
                    <Outlet />
                
            </div>
        </section>
    )
}

export default Profile;