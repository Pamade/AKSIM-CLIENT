import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import { FiltersContent, GuardianApi, AksimResponse } from "../Types/types";
import styles from "./MainContent.module.scss";
import { apiKey } from "../main";
import Loader from "../Loader/Loader";
import { useSearchParams } from "react-router-dom";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useEffect, useState } from "react";
import PaginationButtons from "../PaginationButtons/PaginationButtons";
import Filters from "../Filters/Filters";
import DisplayContent from "../DisplayContent/DisplayContent";
import Button from "./Button";
import { apiAksimBaseUrl } from "../main";

const pageSize = 18 as const;

function MainContent() {
    const [searchParams] = useSearchParams();
    const [isTheGuardianSelected, setIsTheGuardianSelected] = useState(true)
    const objFromParams = Object.fromEntries([...searchParams])
      
    const buildQueryString = (filters:{[key:string]:string}) => {
        return Object.entries(filters)
            .filter(([, value]) => value !== "")
            .map(([key, value]) => {
                // Convert camelCase keys to kebab-case
                const kebabCaseKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
                return `${encodeURIComponent(kebabCaseKey)}=${encodeURIComponent(value)}`;
            })
            .join("&")
    }
    const getFirstPatge = (Number(searchParams.get("page"))) || 1
    const [filtersAksim, setFiltersAksim] = useState<Pick<FiltersContent, "page">>({
        page: getFirstPatge
    })

    const [filters, setFilters] = useState<FiltersContent>({
        q:searchParams.get("q") || "",
        page: getFirstPatge,
        section:searchParams.get("section") || "",
        lang:searchParams.get("lang") || "",
        fromDate:searchParams.get("from-date") || "",
        toDate:searchParams.get("to-date") || "",
    })

    useEffect(() => {
        setFilters(objFromParams as any)
        setFiltersAksim(objFromParams as any)

        if (searchParams.get("section")) {
            setIsTheGuardianSelected(true) //alow switching to section, when on Aksim articles
        }
        
    }, [searchParams])
    

    const { responseData, error, isLoading } = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/search?${buildQueryString(objFromParams)}&page-size=${pageSize}&show-fields=thumbnail&api-key=${apiKey}`);
    const {responseData:responseAksim} = useFetchOnLoad<AksimResponse>(`${apiAksimBaseUrl}/content/get-articles?size=${pageSize}&${buildQueryString(objFromParams)}`)
    
    // const sectionHeading = (sectionName || sectionID?.toUpperCase() || authorID || q)?.replace(/-/g, " ");
    // API DOES NOT SUPPORT PAGING THAT FAR, SO I WANT TO INCLUDE MAX 100 PAGES
    const pagesTotalGuardian = responseData ? responseData?.response.pages > 100 ? 100 : responseData.response.pages : 0
    const noContent = responseData?.response.total === 0 || error;
    const results = responseData?.response.results;
    const pagesAksim = responseAksim?.totalPages || 0;

    if (isLoading) return <>
        <div className={styles.btn_select_content_wrapper}>
            <Button setIsTheGuardianSelected={setIsTheGuardianSelected} isSelected={isTheGuardianSelected} text="The Guardian"/>
            <Button setIsTheGuardianSelected={setIsTheGuardianSelected} isSelected={!isTheGuardianSelected} text="Aksim"/>
        </div>
        <Filters filters={filters}/>
        <Loader />
    </>
    
    return (
        <>
        {/* Always render Filters at the top */}
        <div className={styles.btn_select_content_wrapper}>
            <Button setIsTheGuardianSelected={setIsTheGuardianSelected} isSelected={isTheGuardianSelected} text="The Guardian"/>
            <Button setIsTheGuardianSelected={setIsTheGuardianSelected} isSelected={!isTheGuardianSelected} text="Aksim"/>
        </div>
        {isTheGuardianSelected && <Filters  filters={filters} />}
        {noContent ? (
            // Show ErrorMessage if no content is available
            <ErrorMessage error="Content Not Found" />
        ) : (
            <>
                {responseAksim && !isTheGuardianSelected && 
                <>
                    <DisplayContent isTheGuardian={isTheGuardianSelected} data={responseAksim.results}/>
                    <div className={styles.buttons_wrapper}>
                        {pagesAksim !== 0 &&<PaginationButtons filters={filtersAksim} page={Number(filtersAksim.page)} pagesTotal={pagesAksim} />}
                    </div>
                </>
                }
                {results && isTheGuardianSelected && (
                    <>
                        <DisplayContent isTheGuardian={isTheGuardianSelected} data={results}/>
                        <div className={styles.buttons_wrapper}>
                            {pagesTotalGuardian !== 0 &&<PaginationButtons filters={filters} page={Number(filters.page)} pagesTotal={pagesTotalGuardian} />}
                        </div>
                    </>
                )  }
                
            </>
        )}
    </>
    );
}

export default MainContent;
