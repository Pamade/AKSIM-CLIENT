import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { useUserContext } from "../Context/UserContext"
import { AksimContent } from "../Types/types"
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import axios from "axios"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import AksimArticleAsLink from "../AksimArticleAsLink/AksimArticleAsLink"
import Loader from "../Loader/Loader"
import PaginationButtons from "../PaginationButtons/PaginationButtons"
import styles from "./Profile.module.scss"
import { Link } from "react-router-dom"
const pageSize = 3 as const;

function UserArticlesDisplay(){
    const {userName} = useParams()
    const {state} = useUserContext()
    const [page, setPage] = useState(1)
    const [articles, setArticles] = useState<AksimContent[] | null>(null)
    const [messageRemoving, setMessageRemoving] = useState("")
    const [pagesTotal, setPagesTotal] = useState(0)
    let {responseData, error, isLoading} = useFetchOnLoad<AksimContent[]>(`http://localhost:8080/api/content/get-articles/${userName}`, true)
    const paginatedArticles = articles ? articles.slice((page - 1) * pageSize, page * pageSize) : [];
    const isCurrentLoggedUser = userName === state.user?.name
    
    useEffect(() => {

        if (responseData) {
          setArticles(responseData.reverse())
          const pages = responseData ? Math.ceil(responseData.length / pageSize) : 1;
          setPagesTotal(pages)
        }
  
  }, [responseData])

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

    const heading = <h5 className={styles.heading}>
            {state.user?.name === userName
            ? paginatedArticles.length > 0
                ? "Published Articles"
                : <>
                    <h5 className={styles.heading}>You don't have any articles</h5>
                    <Link to="/user/add-article" className={styles.link}>Publish article</Link>
                </>
            : paginatedArticles.length > 0
                ? "Published Articles"
                : "This user does not have any articles"}
        </h5>// display different info for logged user

    return (
        <>
            {error && <ErrorMessage error={messageRemoving} />}
            {isLoading && <Loader />}
            {heading}
            <section className={styles.articles_and_buttons}>
                <div className={styles.paginated_articles}>
                    {paginatedArticles.map((content) => <AksimArticleAsLink containsThumbnail={true} handleRemoveArticle={handleRemoveArticle} path={ `/aksim-article/${content.id}`} content={content}/>)}                                                                                                                            
                </div>
                {articles && articles?.length > 0 && <PaginationButtons setPage={setPage} page={page} pagesTotal={pagesTotal}/>}
            </section>
        </>
    )
}

export default UserArticlesDisplay;