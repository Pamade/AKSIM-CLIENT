import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { GuardianApi } from "./MainContentTypes";
import styles from "./MainContent.module.scss"
interface Props {
    apiContent:string,
    sectionName?:string
}

const apiKey = import.meta.env.VITE_API_KEY

function MainContent({apiContent, sectionName}:Props){
    const {responseData, error, isLoading} = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/${apiContent}&api-key=${apiKey}`)
    
    return (
        <section className={styles.wrapper}>
        {sectionName && <h2>{sectionName}</h2>}
        <div className={styles.content}>
             {responseData?.response.results.map((item) => (
                <div key={item.id} className={styles.single_item}>
                    <h3 className={styles.title}>{item.webTitle}</h3>
                    <img className={styles.thumbnail} src={item.fields.thumbnail} alt="article" />
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