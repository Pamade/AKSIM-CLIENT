import ArticleCreator from "../ArticleCreator/ArticleCreator";
import styles from "../AddArticle/AddArticle.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useUserContext } from "../Context/UserContext";
import { apiAksimBaseUrl } from "../main";

interface Article {
    id?: number; // Allow for optional ID for editing
    title: string;
    description?: string;
    content: string;
    creationDate: Date;
    imageFile?: File;
    userNameID?:string
}

interface Errors {
    title?: string;
    content?: string;
    server?: string;
}

interface Data {
    errors: Errors;
    success_message: string | null;
}

interface AddArticleProps {
    articleToEdit?: Article;  // Prop to accept an existing article for editing
}

const AddArticle = ({ articleToEdit }: AddArticleProps) => {
    const {articleID} = useParams()
    const [article, setArticle] = useState<Partial<Article>>(articleToEdit || { creationDate: new Date() });
    const [errors, setErrors] = useState<Errors>({} as Errors);
    const navigate = useNavigate();
    const { state } = useUserContext();

    // Handle POST or PUT depending on whether it's add or edit
    const handlePostArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        const formData = new FormData();

        if (article.imageFile) {
            formData.append("imageFile", article.imageFile); // Append the actual file to the FormData
        }

        if (articleToEdit && articleID) {
            formData.append("userNameID", String(article.userNameID))
            formData.append("id", String(article.id))
        }

        formData.append("title", article.title || "");
        formData.append("description", article.description || "");
        formData.append("content", article.content || "");
        formData.append("creationDate", new Date().toISOString());
        
        try {
            const res = articleID 
                ? await axios.put<Data>(`${apiAksimBaseUrl}/user/update-article/${articleID }`, formData, {
                      headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                      },
                  })
                : await axios.post<Data>(`${apiAksimBaseUrl}/user/add-article`, formData, {
                      headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                      },
                  });

            if (res.status !== 200) {
                setErrors({ server: "Server Error" });
            } else {
                const data: Data = res.data;
                const err = data.errors;
                if (err) {
                    setErrors({ title: err.title, content: err.content });
                } else {
                    setErrors({});
                    return navigate("/profile/" + state.user?.name);
                }
            }
        } catch (e) {
            setErrors({ server: "Server Error" });
        }
    };

    useEffect(() => {
        if (articleToEdit) {
            setArticle(articleToEdit); // Pre-fill the form if we're editing an existing article
        }
        
    }, [articleToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setArticle((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeArticleContent = (html: string) => {
        setArticle({ ...article, content: html });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setArticle((prev) => ({
                ...prev,
                imageFile: file,
            }));
        }
    };
    return (
        <section className={styles.section}>
            
            <h2>{articleID ? "Edit Article" : "Publish Article"}</h2>
            <form onSubmit={handlePostArticle} className={styles.form}>
                <p className={styles.error}>{errors.title || errors.server}</p>
                <input
                    name="title"
                    value={article.title || ""}
                    onChange={handleChange}
                    className={styles.input}
                    type="text"
                    placeholder="Name"
                />
                <input
                    name="description"
                    value={article.description || ""}
                    onChange={handleChange}
                    className={styles.input}
                    type="text"
                    placeholder="Description"
                />
                <div className={styles.label_and_file}>
                    <label>Thumbnail</label>
                    <input onChange={handleFileChange} type="file" />
                </div>
                <p className={styles.error}>{errors.content}</p>
                <ArticleCreator initialContent={articleToEdit?.content} handleChangeArticleContent={handleChangeArticleContent} />
                <button className={styles.btn} onSubmit={handlePostArticle}>
                    {article.id ? "UPDATE ARTICLE" : "SUBMIT ARTICLE"}
                </button>
            </form>
        </section>
    );
};

export default AddArticle;
