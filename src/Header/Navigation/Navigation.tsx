import { NavLink } from "react-router-dom"
import styles from "./Navigation.module.scss";
import { IoCloseCircleOutline } from "react-icons/io5";

function Navigation() {
    return (
        <section>
            <div className={styles.close_container}>
                <IoCloseCircleOutline />
                d
            </div>            
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
        </section>
    )
}
export default Navigation