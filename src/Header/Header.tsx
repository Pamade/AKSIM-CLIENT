import {useState} from "react";
import styles from "./Header.module.scss"
import logo from "../assets/aksim logo.jpg"
import { useUserContext } from "../Context/UserContext";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import SideNavigation from "../SideNavigation/SideNavigation";

interface ButtonProps{
    path:string,
    text:string,
    event?:() => void
}
function Button({path,text, event}:ButtonProps){
    return <Link onClick={event} className={styles.button} to={path}>{text}</Link>
}

function Header() {
    const {state, logout} = useUserContext();
    const [isNavigationOpen, setIsNavigationOpen] = useState(false)

    return (
        <section>
            <div  className={styles.wrapper}>
                <div className={styles.logo_bar}>
                     <FaBars onClick={() => setIsNavigationOpen(!isNavigationOpen)} className={styles.bar}/>
                     <Link to="/" className={styles.link}><img className={styles.logo} src={logo} alt="aksim" /></Link>
                </div>
                {isNavigationOpen && <SideNavigation isNavigationOpen={true} setIsNavigationOpen={setIsNavigationOpen}/>}            
                <h1 className={styles.heading}><Link to={"/"}>AKSIM</Link></h1>
                {!state.user?<div>
                    <Button text="Login" path="/login"/>
                </div> : <div className={styles.buttons}>
                    <Button text="Add Article" path="user/add-article" />
                    <Button event={logout} text="Logout" path="/" />
                </div>}              
            </div>
        </section>
    )
}



export default Header;

