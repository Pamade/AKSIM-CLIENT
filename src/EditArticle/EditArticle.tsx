import { useParams } from "react-router";
import AddArticle from "../AddArticle/AddArticle";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { AksimContent } from "../Types/types";
import { apiAksimBaseUrl } from "../main";

function EditArticle(){
    const {articleID} = useParams()
    const {responseData} = useFetchOnLoad<AksimContent>(`${apiAksimBaseUrl}/api/content/get-article/${articleID}`)

    // const {content} = responseData
    console.log(responseData)
    const state = {
        title:responseData?.title || "",
        description:responseData?.description || "",
        content:responseData?.content || "",
        creationDate:new Date()
    }
    return (
        <AddArticle articleToEdit={state}/>
    )
}

export default EditArticle;