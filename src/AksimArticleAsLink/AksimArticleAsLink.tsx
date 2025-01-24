import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./AksimArticleAsLink.module.scss";
import { AksimArticleAsLinkProps } from "../Types/types";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useUserContext } from "../Context/UserContext";


function AksimArticleAsLink({content, path, handleRemoveArticle, containsThumbnail}:AksimArticleAsLinkProps) {
    const navigate = useNavigate();
    const {articleID} = useParams();
    const {id, title, description, userNameID, creationDate, imageLink} = content;
    const {state} = useUserContext()

    // fire only user profile
    return (
        <li key={id} className={articleID &&  Number(articleID) === id ? `${styles.single_item} ${styles.single_item_selected}` :  styles.single_item}> 
            <Link className={styles.link} to={path || `/aksim-article/${id}`} >
                <div className={styles.content_wrapper}>
                    <div>
                        <p>{title}</p>
                        <p>{description}</p>
                        <div className={styles.user_creation_date}>
                            {!path &&<p>{userNameID}</p>}
                            <p>{creationDate}</p>
                        </div>
                    </div>
                    {state.user?.name === userNameID && handleRemoveArticle &&  <div className={styles.remove_edit_wrapper}>
                        <button className={styles.btn}>
                            <IoCloseCircleOutline onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveArticle(id)
                            }} className={`${styles.icon} ${styles.icon_remove}`}/>
                        </button>
                        <button className={styles.btn}>
                            <MdEdit onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                navigate(`/user/edit-article/${id}`)
                            }} className={styles.icon}/>
                        </button>
                        </div>
                    }   
                </div>
            </Link>     
            {containsThumbnail && imageLink && <img className={styles.img} src={imageLink} alt="" />}
        </li>
    )
}

export default AksimArticleAsLink;