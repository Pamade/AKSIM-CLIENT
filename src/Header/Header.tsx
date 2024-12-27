import styles from "./Header.module.scss"
import logo from "./aksim logo.jpg"
import { useUserContext } from "../Context/UserContext";
import { Link } from "react-router-dom";

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
                <img className={styles.logo} src={logo} alt="aksim" />
                <h1 className={styles.heading}>AKSIM</h1>
                {!state.user?<div>
                    <Button text="Login" path="/login"/>
                </div> : <div className={styles.buttons}>
                    <Button text="Profile" path="user/profile" />
                    <Button text="Add Article" path="user/add-article" />
                    <Button event={logout} text="Logout" path="/" />
                </div>}              
            </div>
            {children}
        </section>
    )
}



export default Header;

