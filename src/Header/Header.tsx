import styles from "./Header.module.scss"
import logo from "./aksim logo.jpg"
import { useUserContext } from "../Context/UserContext";
import { Link } from "react-router-dom";

interface Props {
    children:React.ReactNode;
}
interface ButtonProps{
    path:string,
    text:string
}
function Button({path,text}:ButtonProps){
    return <Link className={styles.button} to={path}>{text}</Link>
}

function Header({children}:Props) {
    const {state} = useUserContext();
    return (
        <section>
            <div className={styles.wrapper}>
                <img className={styles.logo} src={logo} alt="aksim" />
                <h1 className={styles.heading}>AKSIM</h1>
                {!state.user?<div>
                    <Button text="Login" path="/login"/>
                    <button>Register</button>
                </div> : <div className={styles.buttons}>
                    <Button text="Profile" path="user/profile" />
                    <Button text="Logout" path="/" />
                </div>}              
            </div>
            {children}
        </section>
    )
}



export default Header;

