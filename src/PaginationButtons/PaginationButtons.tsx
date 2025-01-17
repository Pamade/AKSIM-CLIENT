import styles from "./PaginationButtons.module.scss"
import { PaginationButtonsProps } from "../Types/types";
import { useSearchParams } from "react-router-dom";

interface ButtonProps {
    label:number,
    onClick?:() => void,
    disabled?:boolean
}

const PaginationButtons = ({pagesTotal, page, filters}:PaginationButtonsProps) => {
    console.log(page)
    const [searchParams, setSearchParams] = useSearchParams()
    page = Number(page)
    const prevPage = page - 1;
    const nextPage = page + 1
    const showFirstButton = page > 1
    const showSecondButton = page < pagesTotal
    const showForthButton = page !== pagesTotal && nextPage !== pagesTotal

    const handleSetPage = (value:number) => {
        setSearchParams({...filters, page:String(value)} )
    }

    return (
        <div className={styles.wrapper}>
            {showFirstButton && <Button label={prevPage} onClick={() => handleSetPage(prevPage)} />}
            <Button label={page} disabled={true} />
            {showSecondButton && <Button label={nextPage} onClick={() => handleSetPage(nextPage)} />}
            {showForthButton && <Button label={pagesTotal} onClick={() => handleSetPage(pagesTotal)} />}
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