import ArticleCreator from "../ArticleCreator/ArticleCreator";
import styles from "../AddArticle/AddArticle.module.scss"
import { useState } from "react";
import axios, {AxiosResponse} from "axios";

interface Article {
    id:number,
    title:string,
    description?:string,
    content:string,
    imageLink?:string,
    creationDate:Date,
    userid:number
}

const AddArticle = () => {
    const [article, setArticle] = useState<Partial<Article>>({creationDate: new Date()} as Article)
    
    const handlePostArticle = async(e:React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token')
        try {
            const res = await axios.post<AxiosResponse<any>>("http://localhost:8080/api/auth/add-article", 
            article,
            {
                headers:{
                      Authorization: `Bearer ${token}`, // Include the JWT token here
                      "Content-Type": "application/json",
                },
            })
            if (res.status != 200) {
                console.log('failed')
            }
            console.log(res)            
        } catch (e) {
            console.log(e)
        }
        console.log(article)
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setArticle((prev) => ({
            ...prev,
            [name]:value
        }))
    }
    const handleChangeArticleContent = (html:string) => {
        setArticle({...article, content:html})
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setArticle((prev) => ({
                ...prev,
                imageLink:URL.createObjectURL(file)
            }))
        }
    }

    return <section className={styles.section}>
        <h2>Add Article</h2>
        <form onSubmit={handlePostArticle} className={styles.form}>
            <input name="title" onChange={handleChange} className={styles.input} type="text" placeholder="Name" />
            <input name="description" onChange={handleChange} className={styles.input} type="text" placeholder="Description" />
            <div className={styles.label_and_file}>
                <label>Thumbnail</label>
                <input onChange={handleFileChange} type="file" />
            </div>
            <ArticleCreator handleChangeArticleContent={handleChangeArticleContent}/>
            <button onSubmit={e => handlePostArticle(e)}>SUBMIT ARTICLE</button>
        </form>
        {/* <article>
            
        </article> */}
        
    </section>
}
export default AddArticle;

