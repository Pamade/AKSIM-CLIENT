import styles from "./Profile.module.scss" 
import userNotFound from "../assets/user.png"
import HeadingWithLink from "../HeadingWithLink/HeadingWithLink";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { AksimContent } from "../Types/types";
import { AksimArticleAsLinkProps } from "../Types/types";
import AksimArticleAsLink from "../AksimArticleAsLink/AksimArticleAsLink";
import { useParams } from "react-router";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useUserContext } from "../Context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { MdArticle } from "react-icons/md";
import { IoSettings } from "react-icons/io5";

const sections = 
    [ 
    {text:"YOUR ARTICLES", path:"/", icon:MdArticle},
    {text:"ACCOUNT SETTINGS", path:"/", icon:IoSettings}] as const;

function Profile() {
    const {userName} = useParams()
    const {state} = useUserContext()
    const [messageRemoving, setMessageRemoving] = useState("")
    let {responseData, error, isLoading} = useFetchOnLoad<AksimContent[]>(`http://localhost:8080/api/content/get-articles/${userName}`, true)
    const [articles, setArticles] = useState<AksimContent[] | null>(responseData)
    const isCurrentLoggedUser = userName === state.user?.name

    const handleRemoveArticle = async (id:number) => {
        if (isCurrentLoggedUser) {
            try {
                const res = await axios.delete(`http://localhost:8080/api/user/remove-article/${id}`, {
                    headers:{
                        Authorization:"Bearer " + localStorage.getItem("access_token")
                    }
                })
                if (res.status === 200) {
                    if (articles) setArticles(articles.filter((item:any) => item.id !== id))
                    setMessageRemoving("Article removed")
                } else setMessageRemoving("Error removing article")
            } catch (e) {
                setMessageRemoving("Error removing article")
            } 
        }
    }

    useEffect(() => {
        if (!isLoading) {
            setArticles(responseData)
        }
    }, [isLoading])

    const loggedUserContent = (
        <ul className={styles.list}>
            {sections.map((section) => <li><HeadingWithLink path={"/"} text={section.text} Icon={section.icon}/></li>)}
        </ul>
    )
   
   return (
        <section className={styles.wrapper}>
            <div className={styles.profile}>
                <div className={styles.avatar_name}>
                    <img className={styles.user_avatar} src={userNotFound} alt="user" /> 
                    <p className={styles.name}>{userName}</p>
                </div>
                {isCurrentLoggedUser && loggedUserContent}
            </div>
            <div className={styles.content_wrapper}>
                    {error && <ErrorMessage error={messageRemoving} />}
                    {isLoading && <Loader />}
                    {!isLoading && articles && articles.map((content) => <AksimArticleAsLink containsThumbnail={true} handleRemoveArticle={handleRemoveArticle} path={isCurrentLoggedUser ? `/profile/${userName}/article-${content.id}` : `/aksim-article/${content.id}`} content={content}/>)}
            </div>
        </section>
    )
}

export default Profile;