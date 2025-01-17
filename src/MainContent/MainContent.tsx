import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { FiltersContent, GuardianApi } from "../Types/types";
import styles from "./MainContent.module.scss";
import photoNotFound from "../assets/photo.png";
import { apiKey } from "../main";
import Loader from "../Loader/Loader";
import { Link, useSearchParams } from "react-router-dom";
import { stringDateToLocaleDateString } from "../utils/Utils";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useEffect, useState } from "react";
import PaginationButtons from "../PaginationButtons/PaginationButtons";
import Filters from "../Filters/Filters";
import DisplayContent from "../DisplayContent/DisplayContent";

const pageSize = 18 as const;

function MainContent() {
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
    
    const { responseData, error, isLoading } = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/search?${buildQueryString(objFromParams)}&page-size=${pageSize}&show-fields=thumbnail&api-key=${apiKey}`);

    // const sectionHeading = (sectionName || sectionID?.toUpperCase() || authorID || q)?.replace(/-/g, " ");
    // API DOES NOT SUPPORT PAGING THAT FAR, SO I WANT TO INCLUDE MAX 100 PAGES
    const pagesTotal = responseData ? responseData?.response.pages > 100 ? 100 : responseData.response.pages : 0
    const noContent = responseData?.response.total === 0 || error;
    const results = responseData?.response.results;

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
                {results && <DisplayContent data={results} />}
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
