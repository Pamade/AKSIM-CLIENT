import styles from "./Header.module.scss"
import logo from "./aksim logo.jpg"
import { useUserContext } from "../Context/UserContext";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Navigation from "./Navigation/Navigation";
interface Props {
    children:React.ReactNode;
}
interface ButtonProps{
    path:string,
    text:string,
    event?:() => void
}
function Button({path,text, event}:ButtonProps){
    return <Link onClick={event} className={styles.button} to={path}>{text}</Link>
}

function Header({children}:Props) {
    const {state, logout} = useUserContext();

    return (
        <section>
            <div className={styles.wrapper}>
                <div className={styles.logo_bar}>
                     <FaBars className={styles.bar}/>
                     <Link to="/" className={styles.link}><img className={styles.logo} src={logo} alt="aksim" /></Link>
                </div>
                <Navigation />
                <h1 className={styles.heading}><Link to={"/"}>AKSIM</Link></h1>
                {!state.user?<div>
                    <Button text="Login" path="/login"/>
                </div> : <div className={styles.buttons}>
                    <Button text="Add Article" path="user/add-article" />
                    <Button event={logout} text="Logout" path="/" />
                </div>}              
            </div>
            {children}
        </section>
    )
}



export default Header;

