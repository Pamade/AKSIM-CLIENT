import { useParams } from "react-router";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { apiKey } from "../main";
import {GuardianContentSingle } from "../Types/types";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import styles from "./SingleArticle.module.scss"
import { stringDateToLocaleDateString } from "../utils/Utils";
import ErrorMessage from "../ErrorMessage/ErrorMessage";


function SingleArticle(){
    let {articleID} = useParams()
    articleID = articleID?.replace(/ /g, "/") //re replace cuz api works like that content/asdf, this makes react router dom working not correctly

    const {responseData, isLoading, error} = useFetchOnLoad<GuardianContentSingle>(`https://content.guardianapis.com/${articleID}?show-fields=body,thumbnail,byline&api-key=${apiKey}`)
    
    
    if (isLoading) return <Loader />
    if (error) return <ErrorMessage error={error}/>
    if (responseData) {
        const {body, thumbnail, byline} = responseData?.response.content.fields
        const {webTitle, webPublicationDate} = responseData?.response.content

        return (
            <article className={styles.article}>
                <div>
                    <div className={styles.content_img_wrapper}>
                        <h2 className={styles.title}>{webTitle}</h2>
                        {<img src={thumbnail} alt="content" /> }
                    </div>
                    <p className={styles.date_and_author}>
                        <Link className={styles.author} to={`/search/${byline}`}>{byline}</Link> <span>{stringDateToLocaleDateString(webPublicationDate)}</span>
                    </p>
                </div>
                <div>
                    {String(body).replace(/<[^>]+>/g, '')}
                </div>
            </article>
        )
    }
    // if (!responseData?.isHosted== 0) return <span className={styles.content}>Content not found</span>
   
}

export default SingleArticle;