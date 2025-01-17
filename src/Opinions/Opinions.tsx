import { apiKey } from "../main";
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad";
import DisplayContent from "../DisplayContent/DisplayContent";
import { GuardianApi } from "../Types/types";
import Loader from "../Loader/Loader";
import { useEffect, useState } from "react";
import PaginationButtons from "../PaginationButtons/PaginationButtons";
import { useSearchParams } from "react-router-dom";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const pageSize = 36 as const;

function Opinions(){
    const [searchParams] = useSearchParams();
    const getPage = searchParams.get("page")
    const [filters, setFilters] = useState({page:getPage || 1 })
    const { responseData, error, isLoading } = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/commentisfree?sectionName=Opinion&page=${!getPage ? 1 : getPage}&show-fields=byline,body,thumbnail&page-size=${pageSize}&api-key=${apiKey}`);
    const results = responseData?.response.results;
    const pagesTotal = responseData ? responseData?.response.pages > 100 ? 100 : responseData.response.pages : 0

    useEffect(() => {
        setFilters({page:Number(searchParams.get("page"))})
    }, [searchParams])
    
    if (error) return <ErrorMessage error={error}/>
    if (isLoading) return <Loader />
    return <>
        {results && <DisplayContent data={results}/>}
        <PaginationButtons filters={filters} page={Number(filters.page) || 1} pagesTotal={pagesTotal}/>
    </>
}

export default Opinions