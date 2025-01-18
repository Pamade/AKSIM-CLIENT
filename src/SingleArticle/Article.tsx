import styles from "./Article.module.scss";
import { ArticleProps } from "../Types/types"
import { stringDateToLocaleDateString } from "../utils/Utils"
import { Link } from "react-router-dom";
import photoNotFound from "../assets/photo.png";

function Article({webTitle, thumbnail, byline, publicationDate, body, description, isAksim}:ArticleProps){
    return (
        <article className={styles.article}>
            <div>
                <div className={styles.content_img_wrapper}>
                    <h2 className={styles.title}>{webTitle}</h2>
                    {<img className={styles.thumbnail} src={thumbnail || photoNotFound} alt="content" /> }
                </div>
                <p className={styles.date_and_author}>
                    <Link className={styles.author} to={isAksim ? `/profile/${byline}` : `/opinions/${byline}`   }>{byline}</Link> <span>{stringDateToLocaleDateString(publicationDate)}</span>
                </p>
            </div>
            <p>{description}</p>
            <div dangerouslySetInnerHTML={{__html:body}}>
            </div>
        </article>
    )
}
export default Article