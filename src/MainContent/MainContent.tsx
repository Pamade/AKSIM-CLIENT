import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { GuardianApi } from "./MainContentTypes";
import styles from "./MainContent.module.scss"
interface Props {
    api_content:string
}

const apiKey = import.meta.env.VITE_API_KEY

function MainContent({api_content}:Props){
    const {responseData, error, isLoading} = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/${api_content}&api-key=${apiKey}`)
    return (
        <section className={styles.wrapper}>
             {responseData?.response.results.map((item) => (
                <div className={styles.single_item}>
                    <h1>{item.webTitle}</h1>
                    <img className={styles.thumbnail} src={item.fields.thumbnail} alt="article" />
                    {/* <article dangerouslySetInnerHTML={{__html:item.fields.body}}></article> */}
                </div>
            ))}
        </section>
    )
}
export default MainContent;