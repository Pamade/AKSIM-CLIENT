import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import styles from "./SideContent.module.scss";
import { useEffect } from "react";
import { AksimContent } from "../Types/types";

function SideContent(){
    const {responseData, error, isLoading, fetchData} = useFetchOnLoad<AksimContent[]>('http://localhost:8080/api/content/get-articles', false)

    useEffect(() => {
        fetchData()
    }, [])

    const content = !isLoading && responseData?.map((item) => <div>
        <p>{item.title}</p>
        <p>{item.description}</p>
        <p>{item.userId}</p>
        {item.imageLink && <img className={styles.thumbnail} src={item.imageLink} alt="article" />}
        {/* <div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(item.content)}}></div> */}
        </div>)
    return (
        <section className={styles.wrapper}>
            {content}
        </section>
    )
}
export default SideContent;