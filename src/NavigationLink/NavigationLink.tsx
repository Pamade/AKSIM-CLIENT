import styles from "./NavigationLink.module.scss"
import { NavLink, useLocation } from "react-router-dom"
import { NavigationLinkProps } from "../Types/types"


function NavigationLink({ Icon, text, path}:NavigationLinkProps) {
    const location = useLocation()
        
    return <NavLink to={path}><div className={`${location.pathname.replace("%20", " ") === path ? `${styles.item_content} ${styles.selected}` : styles.item_content}`}>{Icon && <Icon className={styles.icon} />}{text}</div></NavLink>
}
export default NavigationLink