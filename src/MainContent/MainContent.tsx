import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { FiltersContent, GuardianApi } from "../Types/types";
import styles from "./MainContent.module.scss";
import photoNotFound from "../assets/photo.png";
import { useLocation, useParams } from "react-router";
import { apiKey } from "../main";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import { stringDateToLocaleDateString } from "../utils/Utils";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useEffect, useState } from "react";
import PaginationButtons from "../PaginationButtons/PaginationButtons";
import Filters from "../Filters/Filters";

interface Props {
    apiContent?: string;
    sectionName?: string;
}

const pageSize = 18 as const;

function MainContent({ apiContent: api, sectionName }: Props) {
    
    const { sectionID, authorID, q} = useParams();
    const [page, setPage] = useState(1)
    const location = useLocation();
    const [filters, setFilters] = useState<FiltersContent>({
        section:"",
        lang:"",
        fromDate:null,
        toDate:null,
    })
    const {section, lang, fromDate, toDate} = filters
    let stringFilter = `&section=${section}&lang=${lang}&from-date=${fromDate}&to-date=${toDate}`;
    console.log(filters)
    const formatToId = (title:string) => {
        if (title.includes(" ")) {
          const spaceCount = (title.match(/ /g) || []).length;
          return spaceCount === 1
            ? title.toLowerCase().replace(/ /g, "-")
            : title.toLowerCase().replace(/ /g, "");
        } else if (title.includes("/")) {
            return title.toLowerCase().replace(/\//g, " ")
        }
        return title.toLowerCase();
      };
    
    let apiContent = "search?sort_by=newest&show-fields=thumbnail" + stringFilter;
    if (api) {
        apiContent = api;
    } else if (sectionID) {
        apiContent = "search?show-fields=thumbnail&section=" + formatToId(sectionID); // api returns for 2 spaces art-whatever, 3 spaces returns artwhateversomething
    } else if (authorID) {
        apiContent = "search?show-fields=thumbnail&byline=" + authorID;
    } else if (q) {
        apiContent = "search?show-fields=thumbnail&query_fields=webtitle&q=" + q;
    }
    
    const { responseData, error, isLoading, fetchData } = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/${apiContent}&page=${page}&page-size=${pageSize}&api-key=${apiKey}`);

    useEffect(() => {
            fetchData()
    }, [page, filters])

    useEffect(() => {
        setPage(1)
    }, [location])

    const sectionHeading = (sectionName || sectionID?.toUpperCase() || authorID || q)?.replace(/-/g, " ");
    // API DOES NOT SUPPORT PAGING THAT FAR, SO I WANT TO INCLUDE MAX 100 PAGES
    const pagesTotal = responseData ? responseData?.response.pages > 100 ? 100 : responseData.response.pages : 0
    
    if (isLoading) return <Loader />
    if (error) return <ErrorMessage error={error}/>
    if (responseData?.response.total === 0) return <ErrorMessage error="Content Not Found"/>
    return (
        <>
            <Filters filters={filters} setFilters={setFilters}/>
            <h2 className={styles.section_heading}>{sectionHeading}</h2>
            <div className={styles.content}>
                {responseData?.response.results.map((item) => (
                    <Link to={`/article/${formatToId(item.id)}`} key={item.id} className={styles.single_item}>
                        <h3 className={styles.title}>{item.webTitle}</h3>
                        <img
                            className={styles.thumbnail}
                            src={item.fields?.thumbnail || photoNotFound}
                            alt="article"
                        />
                        <p className={styles.date}>
                            {stringDateToLocaleDateString(item.webPublicationDate)}
                        </p>
                    </Link>
                ))}
            </div>
            {pagesTotal !== 0 && 
            <div className={styles.buttons_wrapper}>
                <PaginationButtons setPage={setPage} currentPage={page} pagesTotal={pagesTotal} />
            </div> }
        </>
    );
}

export default MainContent;
