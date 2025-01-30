import { useParams } from "react-router";
import AddArticle from "../AddArticle/AddArticle";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { AksimContent } from "../Types/types";
import { apiAksimBaseUrl } from "../main";
import { useUserContext } from "../Context/UserContext";

function EditArticle(){
    const {articleID} = useParams()
    const {responseData} = useFetchOnLoad<AksimContent>(`${apiAksimBaseUrl}/content/get-article/${articleID}`)
    const {state} = useUserContext();

    const formData = {
        title:responseData?.title || "",
        description:responseData?.description || "",
        content:responseData?.content || "",
        creationDate:new Date(),
        id:Number(articleID),
        userNameID:state.user!.name
    }
    return (
        <AddArticle articleToEdit={formData}/>
    )
}

export default EditArticle;