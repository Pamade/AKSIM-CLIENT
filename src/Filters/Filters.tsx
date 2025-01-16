import { apiKey } from "../main"
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import { GuardianApi } from "../Types/types"
import { ChangeEvent, useEffect, useState, memo } from "react";
import { FiltersContent } from "../Types/types";
import styles from "./Filters.module.scss";
import { useSearchParams } from "react-router-dom";

interface FiltersProps {
    filters:FiltersContent,
}

interface SelectProps {
    items:IdAndWebTitle[],
    onChange:(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void,
    value:string,
    label:string,
}

interface IdAndWebTitle {
    id:string,
    title:string
}

const languages:IdAndWebTitle[] = [
    { id: "en", title: "English" },
    { id: "fr", title: "French" },
    { id: "es", title: "Spanish" },
    { id: "de", title: "German" },
    { id: "ru", title: "Russian" },
    { id: "zh", title: "Chinese" },
    { id: "ja", title: "Japanese" },
] as const;
//get all possible sections
const Filters = ({filters}:FiltersProps) => {
    const {responseData, isLoading, error} = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/sections?api-key=${apiKey}`)    
    const [searchParams, setSearchParams] = useSearchParams()
    const [sections, setSections] = useState<IdAndWebTitle[]>([])


    const {section, lang, fromDate, toDate} = filters
    const results = responseData?.response.results

    useEffect(() => {
        const temp:IdAndWebTitle[] = [];
        if (!isLoading && results &&  results.length > 0) {
            results?.forEach((result) => temp.push({id:result.id, title:result.webTitle}))    
        }
        setSections(temp)
    }, [isLoading])

    const handleChange = (e:ChangeEvent<HTMLSelectElement | HTMLInputElement> , type:string) => {        
        // setFilters({...filters, [type]:e.target.value, page:String(1)})
        setSearchParams({...filters, [type]:e.target.value, page:String(1)} as any)
        // buildQueryString({...filters, [type]:e.target.value, page:String(1)} as any)
    }

    return (
        <section>
            <div>
                <form className={styles.form}>
                        <Select value={section} onChange={(e) => handleChange(e, "section")} items={sections} label="Section"/>
                        <Select value={lang} onChange={(e) => handleChange(e, "lang")} items={languages} label="Languages"/>
                        <SelectDate value={String(fromDate)} onChange={(e) => handleChange(e, "fromDate")} label="From Date"/>
                        <SelectDate value={String(toDate)} onChange={(e) => handleChange(e, "toDate")} label="To date"/>
                </form>
            </div>
        </section>
    )
}

const SelectDate = ({onChange, value, label}:Omit<SelectProps, "items">) =>{
    return (
        <div className={styles.single_item_wrapper}>
            <label className={styles.label}>{label}</label>
            <input
            className={styles.input}
            type="date"
            value={value}
            onChange={onChange}
            />
        </div>
    )
}

const Select = ({items, onChange, value, label}:SelectProps) => {
    return (
        <div className={styles.single_item_wrapper}>
            <label className={styles.label}>{label}</label>
            <select className={styles.input} value={value} onChange={onChange}>
                <option value="">All</option>
                {items.map((item) => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                ))}
            </select>
        </div>
    )
}

export default Filters