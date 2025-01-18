import styles from "./Button.module.scss";

interface ButtonSelectAksimTheGuardian {
    text:"The Guardian" | "Aksim",
    isSelected:boolean,
    setIsTheGuardianSelected: React.Dispatch<React.SetStateAction<boolean>>
}

function Button({text, isSelected, setIsTheGuardianSelected}:ButtonSelectAksimTheGuardian){
    return <button onClick={() =>{
         setIsTheGuardianSelected(text === "The Guardian" ? true : false)
    }} className={isSelected ? `${styles.btn} ${styles.selected}` : styles.btn}>{text}</button>
}

export default Button;