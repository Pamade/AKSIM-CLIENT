import { AksimContent, ArticleGuardian} from "../Types/types"
import { Link } from "react-router-dom"
import { stringDateToLocaleDateString } from "../utils/Utils"
import photoNotFound from "../assets/photo.png";
import styles from "./DisplayContent.module.scss"

interface ContentProps{
    data:ArticleGuardian[] | AksimContent[],
    isTheGuardian:boolean,
}

function DisplayContent({data, isTheGuardian}:ContentProps){

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
      {data.map((item) => {
        // Determine the dynamic mapping of properties
        const title = (item as ArticleGuardian).webTitle || (item as AksimContent).title;
        const thumbnail = (item as ArticleGuardian).fields?.thumbnail || (item as AksimContent).imageLink || photoNotFound;
        const publicationDate = (item as ArticleGuardian).webPublicationDate || (item as AksimContent).creationDate;

        return (
          <Link
            to={isTheGuardian ? `/article/${formatToId(String(item.id))}` : `/aksim-article/${formatToId(String(item.id))}`}
            key={item.id}
            className={styles.single_item}
          >
            <h3 className={styles.title}>{title}</h3>
            <img
              className={styles.thumbnail}
              src={thumbnail}
              alt="article"
            />
            <p className={styles.date}>
              {stringDateToLocaleDateString(publicationDate)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

export default DisplayContent