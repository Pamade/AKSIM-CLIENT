import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import styles from "./SideContent.module.scss";
import { useEffect} from "react";
import { AksimContent, AksimResponse } from "../Types/types";
import AksimArticleAsLink from "../AksimArticleAsLink/AksimArticleAsLink";

function SideContent(){
    
    const {responseData, error, isLoading, fetchData} = useFetchOnLoad<AksimResponse>('http://localhost:8080/api/content/get-articles', false)
    console.log(responseData)
    useEffect(() => {
        fetchData()
    }, [])

    const content = !isLoading && responseData?.results.map((content:AksimContent) => <AksimArticleAsLink key={content.id} content={content}/>)
    
    if (error) return <></>
    return (
        <section className={styles.wrapper}>
            <h4 className={styles.heading}>AKSIM CONTENT</h4>
            <ul className={styles.content_wrapper}>
                {content}
            </ul>
        </section>
    )
}
export default SideContent;