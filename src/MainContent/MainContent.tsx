import React, { memo } from "react";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { GuardianApi } from "../Types/types";
import styles from "./MainContent.module.scss";
import photoNotFound from "../assets/photo.png";
import { useParams } from "react-router";
import { apiKey } from "../main";
import Loader from "../Loader/Loader";

interface Props {
    apiContent?: string;
    sectionName?: string;
}

const pageSize = 20 as const;


function MainContent({ apiContent: api, sectionName }: Props) {
    const { sectionID, authorID, q } = useParams();
    
    const formatToId = (title:string) => {
        if (title.includes(" ")) {
          const spaceCount = (title.match(/ /g) || []).length;
          return spaceCount === 1
            ? title.toLowerCase().replace(/ /g, "-")
            : title.toLowerCase().replace(/ /g, "");
        }
        return title.toLowerCase();
      };
    
    let apiContent = "search?sort_by=newest&show-fields=thumbnail";
    console.log(q)
    if (api) {
        apiContent = api;
    } else if (sectionID) {
        apiContent = "search?show-fields=thumbnail&section=" + formatToId(sectionID); // api returns for 2 spaces art-whatever, 3 spaces returns artwhateversomething
    } else if (authorID) {
        apiContent = "search?show-fields=thumbnail&byline=" + authorID;
    } else if (q) {
        apiContent = "search?show-fields=thumbnail&query_fields=webtitle&q=" + q;
    }

    const { responseData, error, isLoading } = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/${apiContent}&page-size=${pageSize}&api-key=${apiKey}`);
    if (isLoading) return <Loader />
    if (error) return <span className={styles.content}>{error}</span>
    if (responseData?.response.total === 0) return <span className={styles.content}>Content not found</span>
    return (
        <>
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
        </>
    );
}

export default MainContent;
