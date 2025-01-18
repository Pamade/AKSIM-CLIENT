import styles from "./Profile.module.scss" 
import userNotFound from "../assets/user.png"
import HeadingWithLink from "../HeadingWithLink/HeadingWithLink";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { AksimContent } from "../Types/types";
import AksimArticleAsLink from "../AksimArticleAsLink/AksimArticleAsLink";
import { useParams } from "react-router";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useUserContext } from "../Context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { MdArticle } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import PaginationButtons from "../PaginationButtons/PaginationButtons";

const sections = 
    [ 
    {text:"YOUR ARTICLES", path:"/", icon:MdArticle},
    {text:"ACCOUNT SETTINGS", path:"/", icon:IoSettings}] as const;

const pageSize = 3;

function Profile() {
    const {userName} = useParams()
    const {state} = useUserContext()
    const [messageRemoving, setMessageRemoving] = useState("")
    const [page, setPage] = useState(1)
    let {responseData, error, isLoading} = useFetchOnLoad<AksimContent[]>(`http://localhost:8080/api/content/get-articles/${userName}`, true)
    
    const [articles, setArticles] = useState<AksimContent[] | null>(null)
    const [pagesTotal, setPagesTotal] = useState(0)
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
                    setArticles((prev) => {
                        const updatedArticles = prev ? prev.filter((article) => article.id !== id) : prev;
                        const newPagesTotal = updatedArticles ? Math.ceil(updatedArticles.length / pageSize) : 1;
              
                        // Adjust the page if necessary
                        setPagesTotal(newPagesTotal)
                        if (page > newPagesTotal) {
                          setPage(newPagesTotal);
                          
                        }
              
                        return updatedArticles;
                      });

                    setMessageRemoving("Article removed")
                } else setMessageRemoving("Error removing article")
            } catch (e) {
                setMessageRemoving("Error removing article")
            } 
        }
    }

    useEffect(() => {

          if (responseData) {
            setArticles(responseData)
            const pages = responseData ? Math.ceil(responseData.length / pageSize) : 1;
            setPagesTotal(pages)
          }
    
    }, [responseData])

    const paginatedArticles = articles ? articles.slice((page - 1) * pageSize, page * pageSize) : [];

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
                    <h5 className={styles.heading}>Published Articles</h5>
                    {paginatedArticles.map((content) => <AksimArticleAsLink containsThumbnail={true} handleRemoveArticle={handleRemoveArticle} path={ `/aksim-article/${content.id}`} content={content}/>)}
                                                                                                                                                    {/* isCurrentLoggedUser ? `/profile/${userName}/article-${content.id}` : */}
                    {articles && articles?.length > 0 && <PaginationButtons setPage={setPage} page={page} pagesTotal={pagesTotal}/>}
            </div>
        </section>
    )
}

export default Profile;