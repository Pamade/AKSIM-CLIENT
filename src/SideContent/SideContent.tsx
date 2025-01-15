import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import styles from "./SideContent.module.scss";
import { useEffect} from "react";
import { AksimContent } from "../Types/types";
import AksimArticleAsLink from "../AksimArticleAsLink/AksimArticleAsLink";

function SideContent(){
    
    
    const {responseData, error, isLoading, fetchData} = useFetchOnLoad<AksimContent[]>('http://localhost:8080/api/content/get-articles', false)
    
    useEffect(() => {
        fetchData()
    }, [])

    const content = !isLoading && responseData?.slice(-6).map((content:AksimContent) => <AksimArticleAsLink content={content}/>)

    
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