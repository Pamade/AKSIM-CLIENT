import { AksimContent } from "../Types/types"
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import Article from "./Article"
import { useParams } from "react-router"
import { apiAksimBaseUrl } from "../main"
import { useEffect, useState } from "react"

function SingleAksimArticle(){
    const {articleID} = useParams()
    const {responseData, isLoading, error} = useFetchOnLoad<AksimContent>(`${apiAksimBaseUrl}/content/get-article/${articleID}`)
    const [isDelayed, setIsDelayed] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setIsDelayed(false)
        }, 500)
    }, [])

    // add delay, to avoid blinking

    if (isDelayed) return <></>
    if (isLoading) return <Loader />
    if (error) return <ErrorMessage error={error}/>
    if (responseData) {
        const {content, imageLink, title, userNameID, creationDate, } = responseData
        return <Article isAksim={true} webTitle={title} body={content} thumbnail={imageLink} byline={String(userNameID)} publicationDate={creationDate}/>
    }
    else if (!responseData && !isLoading && !isDelayed) return <ErrorMessage error={"Article Not Found"}/>
}

export default SingleAksimArticle