import styles from "./PaginationButtons.module.scss"
import { PaginationButtonsProps } from "../Types/types";

interface ButtonProps {
    label:number,
    onClick?:() => void,
    disabled?:boolean
}

const PaginationButtons = ({pagesTotal, currentPage, setPage}:PaginationButtonsProps) => {

    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1
    const showFirstButton = currentPage > 1
    const showSecondButton = currentPage < pagesTotal
    const showForthButton = currentPage !== pagesTotal && nextPage !== pagesTotal

    return (
        <div className={styles.wrapper}>
            {showFirstButton && <Button label={prevPage} onClick={() => setPage(prevPage)} />}
            <Button label={currentPage} disabled={true} />
            {showSecondButton && <Button label={nextPage} onClick={() => setPage(nextPage)} />}
            {showForthButton && <Button label={pagesTotal} onClick={() => setPage(pagesTotal)} />}
        </div>
    )
}

const Button = ({label, onClick, disabled = false }:ButtonProps) => {
    return(
        <button
            onClick={onClick}
            disabled={disabled}
            className={styles.button}
            >
            {label}
        </button>
    )

}
export default PaginationButtons