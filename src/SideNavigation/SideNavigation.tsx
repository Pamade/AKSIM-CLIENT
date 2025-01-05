import { NavLink } from "react-router-dom"
import styles from "./SideNavigation.module.scss";
import { IoCloseCircleOutline } from "react-icons/io5";
import { TbChartBarPopular } from "react-icons/tb";
import { IconBaseProps, IconType } from "react-icons";
import { MdSportsFootball } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { MdScience } from "react-icons/md";
import { AiFillEnvironment } from "react-icons/ai";




interface Props{
    isNavigationOpen:boolean,
    setIsNavigationOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const sections = [{type:"sport", icon:MdSportsFootball},
     {type:"politics", icon:FaHandsHelping }, {type:"science", icon:MdScience}, {type:"environment", icon:AiFillEnvironment}] as const;

function SideNavigation({isNavigationOpen, setIsNavigationOpen}:Props) {
    console.log(isNavigationOpen)
    return (
            <nav className={!isNavigationOpen ? styles.navigation : `${styles.navigation} ${styles.navigation_open}`}>
                    <div className={styles.close_container}>
                        <IoCloseCircleOutline className={styles.close_button} onClick={() => {typeof setIsNavigationOpen !== "undefined" && setIsNavigationOpen(false)}}/>
                    </div>   
                    <h4  className={styles.heading}><NavLink to="/">Home</NavLink></h4>
                    <div>
                        <ul className={styles.list}>
                            {sections.map(({type, icon}) => <NavigationLink Icon={icon} text={type}/>)}
                            {/* <NavigationLink Icon={TbChartBarPopular} path="/" text="Popular"/>
                            <NavLink to="/"><div className={styles.item_content}> <TbChartBarPopular />Popular</div></NavLink>
                            <NavLink to="/">New</NavLink>
                            <NavLink to="/">Poland</NavLink> */}
                        </ul>
                    </div>
                    <div>
                    <h4  className={styles.heading}><NavLink to="/commentisfree">Opinions</NavLink></h4>
                        <ul className={styles.list}>
                            <NavLink to="/">Author 1</NavLink>
                            <NavLink to="/">Author 1</NavLink>
                        </ul>
                    </div>
                
            </nav>
    )
}
interface NavigationLinkProps{
    Icon?:IconType,
    text:string,
}

function NavigationLink({ Icon, text}:NavigationLinkProps) {

    return <NavLink to={text}><div className={styles.item_content}>{Icon && <Icon className={styles.icon} />}{text}</div></NavLink>
}
export default SideNavigation