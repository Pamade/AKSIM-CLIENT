import { NavigationLinkProps } from "../Types/types";
import { NavLink } from "react-router-dom";
import styles from "./HeadingWithLink.module.scss"
function HeadingWithLink({path, Icon, text}:NavigationLinkProps){
    return (
        <h4 className={styles.heading}>
            <NavLink 
                to={path} 
                className={styles.nav_link} // Optional: Add a specific class for styling
            >
                {Icon && <Icon className={styles.icon}/>}
                <span>{text}</span>
            </NavLink>
        </h4>
    )
}
export default HeadingWithLink