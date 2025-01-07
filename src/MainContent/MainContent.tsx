import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import { GuardianApi } from "./MainContentTypes"
import styles from "./MainContent.module.scss"
import photoNotFound from "../assets/photo.png"
import { useParams } from "react-router"

interface Props {
    apiContent?:string,
    sectionName?:string
}

const apiKey = import.meta.env.VITE_API_KEY
const pageSize = 20 as const
function MainContent({apiContent:api, sectionName}:Props){
    const {sectionID, authorID} = useParams()
        // if api content is provided get api, if not s
    let apiContent;
    if (api) {
        apiContent = api;
    } else if (!api && !authorID && sectionID) { // if no api provided author id, this means whe nredirect ther will be sectionid
        apiContent = "search?show-fields=thumbnail&section=" + sectionID
    } 
    else if (!sectionID && !apiContent && authorID) {
        apiContent = "/search?show-fields=thumbnail&byline=" + authorID
    }

    const {responseData, error, isLoading} = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/${apiContent}&page-size=${pageSize}&api-key=${apiKey}`)
    return (
        <section className={styles.wrapper}>
        <h2>{sectionName || sectionID?.toUpperCase() || authorID}</h2>
        <div className={styles.content}>
             {responseData?.response.results.map((item) => (
                <div key={item.id} className={styles.single_item}>
                    <h3 className={styles.title}>{item.webTitle}</h3>
                    <img className={styles.thumbnail} src={item.fields.thumbnail || photoNotFound} alt="article" />
                    {<p className={styles.date}>{new Date(item.webPublicationDate).toLocaleDateString('en-US', {
                            weekday: 'long', // "Monday"
                            year: 'numeric', // "2025"
                            month: 'long', // "December"
                            day: 'numeric' // "29"
                            })}</p>}
                    {/* <article dangerouslySetInnerHTML={{__html:item.fields.body}}></article> */}
                </div>
            ))}
        </div>
        </section>
    )
}

export default MainContent;