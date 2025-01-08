import logo from "../assets/aksim logo.jpg"
import styles from "./Loader.module.scss"

function Loader(){
    return <img className={styles.loader} src={logo} alt="spinner" />
}
export default Loader;