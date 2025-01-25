import { AksimContent } from "../Types/types"
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import Article from "./Article"
import { useParams } from "react-router"
import { apiAksimBaseUrl } from "../main"

function SingleAksimArticle(){
    const {articleID} = useParams()
    const {responseData, isLoading, error} = useFetchOnLoad<AksimContent>(`${apiAksimBaseUrl}/content/get-article/${articleID}`)
    
    if (isLoading) return <Loader />
    if (error) return <ErrorMessage error={error}/>
    if (responseData) {
        const {content, imageLink, title, userNameID, creationDate, } = responseData
        return <Article isAksim={true} webTitle={title} body={content} thumbnail={imageLink} byline={String(userNameID)} publicationDate={creationDate}/>
    }
}

export default SingleAksimArticle