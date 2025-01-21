import logo from "../assets/aksim logo.jpg"
import styles from "./Loader.module.scss"

interface Props {
    // [key:string]:string
}

function Loader({}:Props){
    return <img className={styles.loader} src={logo} alt="spinner" />
}
export default Loader;