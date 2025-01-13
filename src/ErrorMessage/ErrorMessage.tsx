import styles from "./ErrorMessage.module.scss"

function ErrorMessage({error}:{error:string}){
    return <span className={styles.error}>{error}</span>
}
export default ErrorMessage;