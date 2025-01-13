import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import styles from "./SideContent.module.scss";
import { useEffect} from "react";
import { AksimContent } from "../Types/types";
import { Link, useParams } from "react-router-dom";

function SideContent(){
    const {articleID} = useParams();
    
    const {responseData, error, isLoading, fetchData} = useFetchOnLoad<AksimContent[]>('http://localhost:8080/api/content/get-articles', false)
    
    useEffect(() => {
        fetchData()
    }, [])
    
    const content = !isLoading && responseData?.slice(-6).map((item) => 
        <li key={item.id} className={articleID &&  Number(articleID) === item.id ? `${styles.single_item} ${styles.single_item_selected}` :  styles.single_item}> 
            <Link className={styles.link} to={`aksim-article/${item.id}`} >
                <p>{item.title}</p>
                <p>{item.description}</p>
                <div className={styles.user_creation_date}>
                    <p>{item.userNameID}</p>
                    <p>{item.creationDate}</p>
                </div>
            </Link>
        </li>
        )

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