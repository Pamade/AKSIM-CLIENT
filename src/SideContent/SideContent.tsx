import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import styles from "./SideContent.module.scss";
import { useEffect} from "react";
import { AksimContent, AksimResponse } from "../Types/types";
import AksimArticleAsLink from "../AksimArticleAsLink/AksimArticleAsLink";
import { apiAksimBaseUrl } from "../main";
import Loader from "../Loader/Loader";
function SideContent(){
    
    let {responseData, error, isLoading, fetchData} = useFetchOnLoad<AksimResponse>(`${apiAksimBaseUrl}/content/get-articles`, false)

    useEffect(() => {
        fetchData()
    }, [])

    const content = !isLoading && responseData?.results.slice(0,5).map((content:AksimContent) => <AksimArticleAsLink key={content.id} content={content}/>) || <></>
    if (error) return <></>
    return (
        <section className={styles.wrapper}>
            <h4 className={styles.heading}>AKSIM</h4>
            {isLoading && <Loader />}
            <ul className={styles.content_wrapper}>
                {content}
            </ul>
        </section>
    )
}
export default SideContent;