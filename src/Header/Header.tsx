import {useState} from "react";
import styles from "./Header.module.scss"
import logo from "../assets/aksim logo.jpg"
import { useUserContext } from "../Context/UserContext";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import SideNavigation from "../SideNavigation/SideNavigation";
import noAvatar from "../assets/user.png";

function Header() {
    const {state, logout} = useUserContext();
    const [isNavigationOpen, setIsNavigationOpen] = useState(false)
    
    return (
        <section>
            <div  className={styles.wrapper}>
                <div className={styles.logo_bar}>
                     <FaBars onClick={(e) => {
                        e.stopPropagation()
                        setIsNavigationOpen(!isNavigationOpen)
                     }} className={styles.bar}/>
                     <Link to="/" className={styles.link}><img className={styles.logo} src={logo} alt="aksim" /></Link>
                </div>
                {isNavigationOpen && <SideNavigation isNavigationOpen={true} setIsNavigationOpen={setIsNavigationOpen}/>}            
                <h1 className={styles.heading}><Link to={"/"}>AKSIM</Link></h1>
                {!state.user?<div>
                    <Link className={styles.login} to="/login">Login</Link>
                </div> : 
                <div className={styles.avatar_login}>
                    <Link to={`/profile/${state.user.name}`}><img className={styles.avatar} src={state.user.profile_picture_link || noAvatar} alt="user" /></Link>
                    <Link className={styles.login} onClick={logout} to="/">Logout</Link>
                </div>}              
            </div>
        </section>
    )
}



export default Header;

