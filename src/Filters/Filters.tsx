import { apiKey } from "../main"
import useFetchOnLoad from "../CustomHooks/useFetchOnLoad"
import { GuardianApi } from "../Types/types"
import { ChangeEvent, useEffect, useState } from "react";
import { FiltersContent } from "../Types/types";
import styles from "./Filters.module.scss";

interface FiltersProps {
    filters:FiltersContent,
    setFilters:React.Dispatch<React.SetStateAction<FiltersContent>>
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
    { id: "it", title: "Italian" },
    { id: "pt", title: "Portuguese" },
    { id: "ru", title: "Russian" },
    { id: "zh", title: "Chinese" },
    { id: "ja", title: "Japanese" },
    { id: "ko", title: "Korean" },
    { id: "ar", title: "Arabic" },
    { id: "hi", title: "Hindi" },
    { id: "bn", title: "Bengali" },
    { id: "pa", title: "Punjabi" },
    { id: "ur", title: "Urdu" },
    { id: "vi", title: "Vietnamese" },
    { id: "th", title: "Thai" },
    { id: "id", title: "Indonesian" },
    { id: "tr", title: "Turkish" },
    { id: "ms", title: "Malay" },
    { id: "fa", title: "Persian" },
    { id: "pl", title: "Polish" },
    { id: "uk", title: "Ukrainian" },
    { id: "cs", title: "Czech" },
    { id: "sv", title: "Swedish" },
    { id: "fi", title: "Finnish" },
    { id: "hu", title: "Hungarian" },
    { id: "el", title: "Greek" },
    { id: "nl", title: "Dutch" },
    { id: "he", title: "Hebrew" }
] as const;
//get all possible sections
function Filters({filters, setFilters}:FiltersProps){
    const {responseData, isLoading, error} = useFetchOnLoad<GuardianApi>(`https://content.guardianapis.com/sections?api-key=${apiKey}`)    
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
        setFilters({...filters, [type]:e.target.value})
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

function SelectDate({onChange, value, label}:Omit<SelectProps, "items">){
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

function Select({items, onChange, value, label}:SelectProps){
    return (
        <div className={styles.single_item_wrapper}>
            <label className={styles.label}>{label}</label>
            <select className={styles.input} value={value} onChange={onChange}>
                <option value="">Select content</option>
                {items.map((item) => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                ))}
            </select>
        </div>
    )
}

export default Filters