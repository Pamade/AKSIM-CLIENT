import { useEffect, useState } from 'react';
import { useUserContext } from '../Context/UserContext';
import useFetchOnLoad from '../CustomHooks/useFetchOnLoad';
import DOMPurify from 'dompurify';
interface FieldContent{
    thumbnail:string,
    bodyText:string
}

interface Result{
    id:number,
    fields:FieldContent,
    type:string,
    sectionName:string,
    webPublicationDate:string,
}

interface ArticleGuardian{
    apiUrl:string,
    id:string,
    isHosted:string,
    pillarId:string,
    sectionId:string,
    sectionName:string,
    type:string,
    webPublicationDate:string,
    webTitle:string,
    webUrl:string
    fields:{
        body:string | TrustedHTML,
        thumbnail:string,
    }
}

interface GuardianApi{
    response:{
        currentPage:number,
        orderBy:string,
        pageSize:number,
        pages:number,
        startIndex:1,
        status:string,
        total:number,
        results:ArticleGuardian[];
    }
}

interface AksimContent{
    id:number,
    userId:number,
    title:string,
    description:string,
    content:string,
    imageLink:string,
    creationDate:string
}

function Root(){
    const apiKey = import.meta.env.VITE_API_KEY
    const {responseData, error, isLoading} = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/search?sort_by=newest&show-fields=thumbnail,body&api-key=${apiKey}`)


    // const {responseData:aksimResponseData, error:aksimResponseError, isLoading:aksimIsLoading} = useFetchOnLoad<AksimContent[]>('http://localhost:8080/api/content/get-articles')
    console.log(responseData?.response)
    // console.log(aksimResponseData)

    const {state} = useUserContext();

    return (
        <div>
            {responseData?.response.results.map((item) => (
                <div>
                    <h1>{item.webTitle}</h1>
                    <img src={item.fields.thumbnail} alt="" />
                    <article dangerouslySetInnerHTML={{__html:item.fields.body}}></article>
                </div>
            ))}
            {/* {ids.map((item) => <p key={item}>{item}</p>)} */}
            {/* {responseData?.response.results} */}
            {/* {!aksimIsLoading && aksimResponseData?.map((item) => <div>
                <p>{item.title}</p>
                <p>{item.description}</p>
                <p>{item.userId}</p>
                <div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(item.content)}}>
                    
                </div>
                </div>)} */}
            {/* Aksim articles */}
            
            {/* {state.user?.username} */}
        </div>
    )
} 


export default Root