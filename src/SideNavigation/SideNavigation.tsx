import { NavLink, useLocation, useSearchParams } from "react-router-dom"
import styles from "./SideNavigation.module.scss";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdSportsFootball } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { MdScience } from "react-icons/md";
import { AiFillEnvironment } from "react-icons/ai";
import { IoHome } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useUserContext } from "../Context/UserContext";
import { IoMdSend } from "react-icons/io";
import { useEffect, useState, useRef } from "react";
import { HiSquares2X2 } from "react-icons/hi2";
import NavigationLink from "../NavigationLink/NavigationLink";
import HeadingWithLink from "../HeadingWithLink/HeadingWithLink";

interface Props{
    isNavigationOpen:boolean,
    setIsNavigationOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const sections = [{type:"sport", icon:MdSportsFootball},
     {type:"politics", icon:FaHandsHelping }, {type:"science", icon:MdScience}, {type:"environment", icon:AiFillEnvironment}] as const;

const authors = ["Siva Vaidhyanathan", "Simon Jenkins", "Polly Toynbee"] as const;

function SideNavigation({isNavigationOpen, setIsNavigationOpen}:Props) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState("")
    const {state} = useUserContext()
    
    const location = useLocation()
    const navRef = useRef<HTMLDivElement | null>(null); // Ref for the navigation
    const isFirstRender = useRef(true); // Tracks if it's the first render


    const closeNavigation = () => {
        if (isNavigationOpen && setIsNavigationOpen) {
            setIsNavigationOpen(false);
        }
    };

    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false
            return 
        }
        closeNavigation();
    }, [location]); // Trigger on location change

    useEffect(() => {
        const handleClickOutside = (event:MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                closeNavigation();
            }
            console.log(navRef.current)
        };

        // Add event listener for clicks
        document.addEventListener("click", handleClickOutside);

        return () => {
            // Cleanup event listener
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isNavigationOpen]); 


    const handleSearch = () => {
        setSearchParams({q:search || "", page:"1", section:"", lang:"", fromDate:"", toDate:""})
    }
    const handleSearchTopic = (topic:string) => {
        setSearchParams({q:"", page:"1", section:topic, lang:"", fromDate:"", toDate:""})
    }

    return (
            <nav ref={navRef} className={!isNavigationOpen ? styles.navigation : `${styles.navigation} ${styles.navigation_open}`}>
                    <div className={styles.close_container}>
                        <IoCloseCircleOutline className={styles.close_button} onClick={() => {typeof setIsNavigationOpen !== "undefined" && setIsNavigationOpen(false)}}/>
                    </div>
                    <section className={styles.content}>
                        <HeadingWithLink path={"/"} Icon={IoHome} text="HOME"/>
                        <HeadingWithLink Icon={HiSquares2X2} path={"/select-sections"} text="SECTIONS"/>
                        <div className={styles.search}>

                            <HeadingWithLink onClick={() => handleSearch()} path={search && `/?q=${search}&page=1`} Icon={IoMdSend} text="SEARCH"/>
                            <input onChange={(e) => setSearch(e.target.value)} className={styles.search_input} type="text" />
                        </div>
                        <HeadingWithLink path={state.user ? "/user/add-article" : "/login"} Icon={MdEdit} text="PUBLISH ARTICLE"/>                        <div>
                            <h4 className={styles.heading}>Popular Topics</h4>
                            <ul className={styles.list}>
                                {sections.map(({type, icon}) => <NavigationLink onClick={() => handleSearchTopic(type)} key={type} path={`/?section=${type}&page=1`} Icon={icon} text={type}/>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className={styles.heading}><NavLink to="/opinions">Opinions</NavLink></h4>
                            <ul className={styles.list}>
                                {authors.map((author) => <NavigationLink key={author} path={`/opinions/${author}`} text={author}/>)}
                            </ul>
                        </div>
                    </section>   
            </nav>
    )
}

export default SideNavigation