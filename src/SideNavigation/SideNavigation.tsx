import { NavLink, useParams, Link, useLocation, useNavigate } from "react-router-dom"
import styles from "./SideNavigation.module.scss";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IconType } from "react-icons";
import { MdSportsFootball } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { MdScience } from "react-icons/md";
import { AiFillEnvironment } from "react-icons/ai";
import { IoHome } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useUserContext } from "../Context/UserContext";
import { IoMdSend } from "react-icons/io";
import { useState } from "react";


interface Props{
    isNavigationOpen:boolean,
    setIsNavigationOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const sections = [{type:"sport", icon:MdSportsFootball},
     {type:"politics", icon:FaHandsHelping }, {type:"science", icon:MdScience}, {type:"environment", icon:AiFillEnvironment}] as const;

const authors = ["Siva Vaidhyanathan", "Simon Jenkins", "Polly Toynbee"] as const;

function SideNavigation({isNavigationOpen, setIsNavigationOpen}:Props) {
    const [search, setSearch] = useState("")
    const {state} = useUserContext()


    return (
            <nav className={!isNavigationOpen ? styles.navigation : `${styles.navigation} ${styles.navigation_open}`}>
                    <div className={styles.close_container}>
                        <IoCloseCircleOutline className={styles.close_button} onClick={() => {typeof setIsNavigationOpen !== "undefined" && setIsNavigationOpen(false)}}/>
                    </div>
                    <section className={styles.content}>
                        <HeadingWithLink path={"/"} Icon={IoHome} text="HOME"/>
                        <HeadingWithLink path={`/search/${search}`} Icon={IoMdSend} text="SEARCH"/>
                        <div className={styles.search}>
                            <HeadingWithLink path={`/search/${search}`} Icon={IoMdSend} text="SEARCH"/>
                            <input onChange={(e) => setSearch(e.target.value)} className={styles.search_input} type="text" />
                        </div>
                        <HeadingWithLink path={state.user ? "/user/add-article" : "/login"} Icon={MdEdit} text="PUBLISH ARTICLE"/>
                        {/* <Link className={styles.heading_content_link} to={state.user ? "/user/add-article" : "/login"}><h4 className={`${styles.heading} ${styles.heading_content}`}><MdEdit className={styles.icon}/>ADD ARTICLE</h4></Link> */}
                        <div>
                            <h4 className={styles.heading}>Popular Topics</h4>
                            <ul className={styles.list}>
                                {sections.map(({type, icon}) => <NavigationLink path={`/section/${type}`} Icon={icon} text={type}/>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className={styles.heading}><NavLink to="/section/commentisfree">Opinions</NavLink></h4>
                            <ul className={styles.list}>
                                {authors.map((author) => <NavigationLink path={`/commentisfree/${author}`} text={author}/>)}
                            </ul>
                        </div>
                    </section>   
            </nav>
    )
}
interface NavigationLinkProps{
    Icon?:IconType,
    text:string,
    path:string
}

function NavigationLink({ Icon, text, path}:NavigationLinkProps) {
    const location = useLocation()
        
    return <NavLink to={path}><div className={`${location.pathname.replace("%20", " ") === path ? `${styles.item_content} ${styles.selected}` : styles.item_content}`}>{Icon && <Icon className={styles.icon} />}{text}</div></NavLink>
}

function HeadingWithLink({path, Icon, text}:NavigationLinkProps){
    return (
        <h4 className={styles.heading}>
            <NavLink 
                to={path} 
                className={styles.nav_link} // Optional: Add a specific class for styling
            >
                {Icon && <Icon className={styles.icon}/>}
                <span>{text}</span>
            </NavLink>
        </h4>
    )
}
export default SideNavigation