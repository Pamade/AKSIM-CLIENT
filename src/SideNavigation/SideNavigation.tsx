import { NavLink } from "react-router-dom"
import styles from "./SideNavigation.module.scss";
import { IoCloseCircleOutline } from "react-icons/io5";
import { TbChartBarPopular } from "react-icons/tb";
import { IconBaseProps, IconType } from "react-icons";

interface Props{
    isNavigationOpen:boolean,
    setIsNavigationOpen?: React.Dispatch<React.SetStateAction<boolean>>
}


function SideNavigation({isNavigationOpen, setIsNavigationOpen}:Props) {
    console.log(isNavigationOpen)
    return (
            <nav className={!isNavigationOpen ? styles.navigation : `${styles.navigation} ${styles.navigation_open}`}>
                    <div className={styles.close_container}>
                        <IoCloseCircleOutline className={styles.close_button} onClick={() => {typeof setIsNavigationOpen !== "undefined" && setIsNavigationOpen(false)}}/>
                    </div>   
                    <NavLink to="/">Home</NavLink>
                    <div>
                    <h4>Articles</h4>
                        <ul className={styles.list}>
                            <NavigationLink Icon={TbChartBarPopular} path="/" text="Popular"/>
                            <NavLink to="/"><div className={styles.item_content}> <TbChartBarPopular />Popular</div></NavLink>
                            <NavLink to="/">New</NavLink>
                            <NavLink to="/">Poland</NavLink>
                        </ul>
                    </div>
                    <div>
                        <h4>Authors</h4>
                        <ul className={styles.list}>
                            <NavLink to="/">Author 1</NavLink>
                            <NavLink to="/">Author 1</NavLink>
                        </ul>
                    </div>
                
            </nav>
    )
}
interface NavigationLinkProps{
    path:string,
    Icon:IconType,
    text:string,
}

function NavigationLink({path, Icon, text}:NavigationLinkProps) {

    return <NavLink to={path}><div className={styles.item_content}><Icon />{text}</div></NavLink>
}
export default SideNavigation