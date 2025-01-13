import { useParams } from "react-router";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { apiKey } from "../main";
import {GuardianContentSingle } from "../Types/types";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Article from "./Article";

function SingleArticle(){
    let {articleID} = useParams()
    articleID = articleID?.replace(/ /g, "/") //re replace cuz api works like that content/asdf, this makes react router dom working not correctly

    const {responseData, isLoading, error} = useFetchOnLoad<GuardianContentSingle>(`https://content.guardianapis.com/${articleID}?show-fields=body,thumbnail,byline&api-key=${apiKey}`)
    
    if (isLoading) return <Loader />
    if (error) return <ErrorMessage error={error}/>
    if (responseData) {
        const {body, thumbnail, byline} = responseData?.response.content.fields
        const {webTitle, webPublicationDate} = responseData?.response.content
        return <Article {...{webTitle, publicationDate:webPublicationDate, body, thumbnail, byline}} />
    }   
}

export default SingleArticle;