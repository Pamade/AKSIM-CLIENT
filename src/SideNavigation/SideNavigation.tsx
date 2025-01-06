import { NavLink, useParams, Link } from "react-router-dom"
import styles from "./SideNavigation.module.scss";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IconType } from "react-icons";
import { MdSportsFootball } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { MdScience } from "react-icons/md";
import { AiFillEnvironment } from "react-icons/ai";
import { IoHome } from "react-icons/io5";

interface Props{
    isNavigationOpen:boolean,
    setIsNavigationOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const sections = [{type:"sport", icon:MdSportsFootball},
     {type:"politics", icon:FaHandsHelping }, {type:"science", icon:MdScience}, {type:"environment", icon:AiFillEnvironment}] as const;

function SideNavigation({isNavigationOpen, setIsNavigationOpen}:Props) {
    return (
            <nav className={!isNavigationOpen ? styles.navigation : `${styles.navigation} ${styles.navigation_open}`}>
                    <div className={styles.close_container}>
                        <IoCloseCircleOutline className={styles.close_button} onClick={() => {typeof setIsNavigationOpen !== "undefined" && setIsNavigationOpen(false)}}/>
                    </div>
                    <section className={styles.content}>
                        <Link to="/"><h4 className={`${styles.heading} ${styles.heading_home}`}><IoHome className={styles.icon}/> Home</h4></Link>
                        <div>
                            <h4 className={styles.heading}>Popular Topics</h4>
                            <ul className={styles.list}>
                                {sections.map(({type, icon}) => <NavigationLink Icon={icon} text={type}/>)}
                            </ul>
                        </div>
                        <div>
                        <h4 className={styles.heading}><NavLink to="/commentisfree">Opinions</NavLink></h4>
                            <ul className={styles.list}>
                                <NavLink to="/">Author 1</NavLink>
                                <NavLink to="/">Author 1</NavLink>
                            </ul>
                        </div>
                    </section>   
            </nav>
    )
}
interface NavigationLinkProps{
    Icon?:IconType,
    text:string,
}

function NavigationLink({ Icon, text}:NavigationLinkProps) {
    const {sectionID} = useParams();
    // console.log(sectionID)
    return <NavLink to={text}><div className={`${sectionID == text ? `${styles.item_content} ${styles.selected}` : styles.item_content}`}>{Icon && <Icon className={styles.icon} />}{text}</div></NavLink>
}
export default SideNavigation