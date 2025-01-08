import React, { memo } from "react";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { GuardianApi } from "./MainContentTypes";
import styles from "./MainContent.module.scss";
import photoNotFound from "../assets/photo.png";
import { useParams } from "react-router";

interface Props {
    apiContent?: string;
    sectionName?: string;
}
const apiKey = import.meta.env.VITE_API_KEY;
const pageSize = 20 as const;


function MainContent({ apiContent: api, sectionName }: Props) {
    const { sectionID, authorID, q } = useParams();

    console.log("LOG");

    let apiContent;
    if (api) {
        apiContent = api;
    } else if (sectionID) {
        apiContent = "search?show-fields=thumbnail&section=" + sectionID;
    } else if (authorID) {
        apiContent = "search?show-fields=thumbnail&byline=" + authorID;
    } else if (q) {
        apiContent = "search?show-fields=thumbnail&query_fields=webtitle&q=" + q;
    }

    const { responseData, error, isLoading } = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/${apiContent}&page-size=${pageSize}&api-key=${apiKey}`);
    console.log(responseData)
    if (isLoading) return <h1>Loading</h1>
    if (error) return <h1>{error}</h1>
    if (responseData?.response.total === 0) return <h1>Resutls not found</h1>
    return (
        <section className={styles.wrapper}>
            <h2>{sectionName || sectionID?.toUpperCase() || authorID}</h2>
            <div className={styles.content}>
                {responseData?.response.results.map((item) => (
                    <div key={item.id} className={styles.single_item}>
                        <h3 className={styles.title}>{item.webTitle}</h3>
                        <img
                            className={styles.thumbnail}
                            src={item.fields?.thumbnail || photoNotFound}
                            alt="article"
                        />
                        <p className={styles.date}>
                            {new Date(item.webPublicationDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default MainContent;
