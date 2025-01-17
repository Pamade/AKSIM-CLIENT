import { ArticleGuardian} from "../Types/types"
import { Link } from "react-router-dom"
import { stringDateToLocaleDateString } from "../utils/Utils"
import photoNotFound from "../assets/photo.png";
import styles from "./DisplayContent.module.scss"

function DisplayContent({data}:{data:ArticleGuardian[]}){

    const formatToId = (title:string) => {
        if (title.includes(" ")) {
          const spaceCount = (title.match(/ /g) || []).length;
          return spaceCount === 1
            ? title.toLowerCase().replace(/ /g, "-")
            : title.toLowerCase().replace(/ /g, "");
        } else if (title.includes("/")) {
            return title.toLowerCase().replace(/\//g, " ")
        }
        return title.toLowerCase();
      };

    return (
        <div className={styles.content}>
        {data.map((item) => (
            <Link to={`/article/${formatToId(item.id)}`} key={item.id} className={styles.single_item}>
                <h3 className={styles.title}>{item.webTitle}</h3>
                <img
                    className={styles.thumbnail}
                    src={item.fields?.thumbnail || photoNotFound}
                    alt="article"
                />
                <p className={styles.date}>
                    {stringDateToLocaleDateString(item.webPublicationDate)}
                </p>
            </Link>
        ))}
    </div>
    )
}

export default DisplayContent