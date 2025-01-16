import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import styles from "./SelectSections.module.scss"
import { GuardianApi } from "../Types/types"
import { apiKey } from "../main"
import { useEffect, useState } from "react"
import NavigationLink from "../NavigationLink/NavigationLink"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import Loader from "../Loader/Loader"
function SelectSections(){
    const [sectionsByLetter, setSectionsByLetter] = useState<string[][]>([[]])
    const {responseData, isLoading, error} = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/sections?api-key=${apiKey}`)    
    let sectionsByLetterTemp:string[][] = []
    
    useEffect(() => {
        if (responseData?.response) {
            let firstLetter = "a";
            let table = [];
            
            for (let i = 0; i < responseData?.response.total; i++) {
                const name = responseData.response.results[i].id;

                if (name.charAt(0) === firstLetter) {
                    table.push(name)
                } else {
                    sectionsByLetterTemp.push(table)
                    firstLetter = name.charAt(0)
                    table = []
                    i -= 1;
                }
            }
            sectionsByLetterTemp = sectionsByLetterTemp.filter((item) => item.length !== 0 && item)
            setSectionsByLetter(sectionsByLetterTemp)
        }
    }, [isLoading])
    
    if (isLoading) return <Loader />
    if (error) return <ErrorMessage error={error}/>
    return (
        <section className={styles.content}>
            {sectionsByLetter.map((words) => <ul className={styles.list}><span className={styles.first_letter}>{words.at(0)?.at(0)?.toUpperCase()}</span>{words.map((word) =><NavigationLink text={word.replace(/-/g, " ")} path={`/?section=${word.toLowerCase()}`} 
            />)}</ul>)}
        </section>
    )
}
export default SelectSections