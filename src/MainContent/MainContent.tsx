import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { FiltersContent, GuardianApi } from "../Types/types";
import styles from "./MainContent.module.scss";
import photoNotFound from "../assets/photo.png";
import { useLocation, useParams } from "react-router";
import { apiKey } from "../main";
import Loader from "../Loader/Loader";
import { Link, useSearchParams } from "react-router-dom";
import { stringDateToLocaleDateString } from "../utils/Utils";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useEffect, useState, useRef } from "react";
import PaginationButtons from "../PaginationButtons/PaginationButtons";
import Filters from "../Filters/Filters";

interface Props {
    apiContent?: string;
    sectionName?: string;
}

function MainContent({ apiContent: api, sectionName }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const objFromParams = Object.fromEntries([...searchParams])
      
    const buildQueryString = (filters:{[key:string]:string}) => {
        return Object.entries(filters)
            .filter(([key, value]) => value !== "")
            .map(([key, value]) => {
                // Convert camelCase keys to kebab-case
                const kebabCaseKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
                return `${encodeURIComponent(kebabCaseKey)}=${encodeURIComponent(value)}`;
            })
            .join("&")
    }
    
    const [filters, setFilters] = useState<FiltersContent>({
        pageSize:searchParams.get("page-size") || 18,
        q:searchParams.get("q") || "",
        page: (Number(searchParams.get("page"))) || 1,
        section:searchParams.get("section") || "",
        lang:searchParams.get("lang") || "",
        fromDate:searchParams.get("from-date") || "",
        toDate:searchParams.get("to-date") || "",
    })

    

    useEffect(() => {
        setFilters(objFromParams as any)
    }, [searchParams])
    
    const { responseData, error, isLoading, fetchData } = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/search?${buildQueryString(objFromParams)}&api-key=${apiKey}`);

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

    
    

    // const sectionHeading = (sectionName || sectionID?.toUpperCase() || authorID || q)?.replace(/-/g, " ");
    // API DOES NOT SUPPORT PAGING THAT FAR, SO I WANT TO INCLUDE MAX 100 PAGES
    const pagesTotal = responseData ? responseData?.response.pages > 100 ? 100 : responseData.response.pages : 0
    const noContent = responseData?.response.total === 0;

    if (isLoading) return <>
        <Filters   filters={filters}/>
        <Loader />
    </>
    return (
        <>
        {/* Always render Filters at the top */}
        <Filters  filters={filters} />
        {noContent ? (
            // Show ErrorMessage if no content is available
            <ErrorMessage error="Content Not Found" />
        ) : (
            <>
                {/* <h2 className={styles.section_heading}>{sectionHeading}</h2> */}
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
                {pagesTotal !== 0 && (
                    <div className={styles.buttons_wrapper}>
                        <PaginationButtons filters={filters} page={Number(filters.page)} pagesTotal={pagesTotal} />
                    </div>
                )}
            </>
        )}
    </>
    );
}

export default MainContent;
