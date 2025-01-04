import DOMPurify from "dompurify"
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import styles from "./SideContent.module.scss";
interface AksimContent{
    id:number,
    userId:number,
    title:string,
    description:string,
    content:string,
    imageLink:string,
    creationDate:string
}

function SideContent(){
    const {responseData, error, isLoading} = useFetchOnLoad<AksimContent[]>('http://localhost:8080/api/content/get-articles')
    console.log(responseData)

    const content =             !isLoading && responseData?.map((item) => <div>
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