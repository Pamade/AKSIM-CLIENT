import { NavLink } from "react-router-dom"
import styles from "./Navigation.module.scss";
function Navigation() {
    return (
        <nav className={styles.navigation}>
            <ul>
                <NavLink to="/">Home</NavLink>
                <div>
                    <h4>Articles</h4>
                    <NavLink to="/">Popular</NavLink>
                    <NavLink to="/">New</NavLink>
                    <NavLink to="/">Poland</NavLink>
                </div>
                <div>
                    <h4>Authors</h4>
                    <NavLink to="/">Author 1</NavLink>
                    <NavLink to="/">Author 1</NavLink>
                </div>
            </ul>
        </nav>
    )
}
export default Navigation