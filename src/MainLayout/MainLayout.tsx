import Header from "../Header/Header";
import { Outlet } from "react-router";
import { useLocation } from "react-router";
import SideNavigation from "../SideNavigation/SideNavigation";
import SideContent from "../SideContent/SideContent";

const MainLayout = () => {
    // Use the useLocation hook to get the current pathname
    const location = useLocation();
    const isProfilePage = location.pathname.includes('/profile');
  
    return (
      <>
        <Header />
        <div className="wrapper">
          <SideNavigation isNavigationOpen={false} />
          <main className="wrapper-main">
            <Outlet /> 
          </main>
          {/* Conditionally render SideSection only when on profile page */}
          {!isProfilePage && <SideContent />}
        </div>
      </>
    );
  };
  
  export default MainLayout;