import ReactDOM from 'react-dom/client';
import './index.scss';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Login from './Login/Login.tsx';
import Form from './Form/Form.tsx';
import Header from "./Header/Header.tsx";
import AddArticle from './AddArticle/AddArticle.tsx';
import { UserProvider } from './Context/UserContext.tsx';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.tsx';
import App from './App.tsx';
import SideNavigation from "./SideNavigation/SideNavigation.tsx"
import SideContent from './SideContent/SideContent.tsx';
import MainContent from './MainContent/MainContent.tsx';
import UserLoggedRoute from './UserLoggedRoute/UserLoggedRoute.tsx';
// Layout Component
const MainLayout = () => (
  <>
    <Header /> {/* Header now inside Router context */}
    <div className="wrapper">
      <SideNavigation isNavigationOpen={false}/>
          <Outlet /> {/* Renders the nested route components */}
      <SideContent />
    </div>
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Use MainLayout as the root layout
    children: [
      { path: "/", element: <MainContent sectionName='New' apiContent="search?sort_by=newest&show-fields=thumbnail"/> },
      {path:"/commentisfree/:authorID", element: <MainContent />},
      {path:"/section/:sectionID", element:<MainContent />},
      { 
        path: "/forgotPassword", 
        element: (
            <UserLoggedRoute><Form formType="forgotPassword" /></UserLoggedRoute>
        ),
      },
      { 
        path: "/resetPassword/:token", 
        element: (
            <UserLoggedRoute>
              <Form formType="resetPassword" />
            </UserLoggedRoute>
        ),
      },
      { 
        path: "/login", 
        element: (
          <UserLoggedRoute>
            <Login />
          </UserLoggedRoute>
        ),
      },
      { 
        
        path: "/user/add-article", 
        element: 
         <ProtectedRoute>
            <AddArticle />
          </ProtectedRoute>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <App>
      <RouterProvider router={router} />
    </App>
  </UserProvider>
);