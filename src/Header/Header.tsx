import styles from "./Header.module.scss"

interface Props {
    children:React.ReactNode;
}

function Header({children}:Props) {

    return (
        <section>
            <h1 className={styles.heading}>AKSIM</h1>
            {children}
        </section>
    )
}
export default Header;