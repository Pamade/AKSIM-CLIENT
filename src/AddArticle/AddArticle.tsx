import ArticleCreator from "../ArticleCreator/ArticleCreator";
import styles from "../AddArticle/AddArticle.module.scss"
import { useState } from "react";
import axios from "axios";

interface Article {
    id:number,
    title:string,
    description?:string,
    content:string,
    creationDate:Date,
    imageFile?:File,
}

interface Errors {
    title?:string, content?:string,server?:string
}

interface Data {
        errors: Errors,
        success_message:string | null
}

const AddArticle = () => {
    const [article, setArticle] = useState<Partial<Article>>({creationDate: new Date()} as Article)
    const [errors, setErrors] = useState<Errors>({} as Errors)
    const handlePostArticle = async(e:React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token')
        const formData = new FormData();
        if (article.imageFile) {
            formData.append("imageFile", article.imageFile);  // Append the actual file to the FormData
        }
        formData.append("title", article.title || "");
        formData.append("description", article.description || "");
        formData.append("content", article.content || "");
        formData.append("creationDate", new Date().toISOString());
        try {
            const res = await axios.post<Data>("http://localhost:8080/api/auth/add-article", 
            formData,
            {
                headers:{
                      Authorization: `Bearer ${token}`, // Include the JWT token here
                      "Content-Type": "multipart/form-data",
                },
            })
            if (res.status != 200) {
                setErrors({server:"Server Error"})
            } else {
                const data:Data = res.data
                const err = data.errors
                if (err) {
                    setErrors({title:err.title, content:err.content})
                } else  setErrors({})
                
            }      
        } catch (e) {
            setErrors({server:"Server Error"})
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
                imageFile:file
            }))
        }
    }

    return <section className={styles.section}>
        <h2>Add Article</h2>
        <form onSubmit={handlePostArticle} className={styles.form}>
            <p className={styles.error}>{errors.title || errors.server}</p>
            <input name="title" onChange={handleChange} className={styles.input} type="text" placeholder="Name" />
            <input name="description" onChange={handleChange} className={styles.input} type="text" placeholder="Description" />
            <div className={styles.label_and_file}>
                <label>Thumbnail</label>
                <input onChange={handleFileChange} type="file" />
            </div>
            <p className={styles.error}>{errors.content}</p>
            <ArticleCreator handleChangeArticleContent={handleChangeArticleContent}/>
            <button className={styles.btn} onSubmit={e => handlePostArticle(e)}>SUBMIT ARTICLE</button>
        </form>
    </section>
}
export default AddArticle;

