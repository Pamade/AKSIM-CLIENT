import ReactDOM from 'react-dom/client';
import './index.scss';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Root from './Root/Root.tsx';
import Login from './Login/Login.tsx';
import Form from './Form/Form.tsx';
import Header from "./Header/Header.tsx";
import AddArticle from './AddArticle/AddArticle.tsx';
import { UserProvider } from './Context/UserContext.tsx';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.tsx';
import App from './App.tsx';
import SideNavigation from "./SideNavigation/SideNavigation.tsx"

// Layout Component
const MainLayout = () => (
  <>
    <Header /> {/* Header now inside Router context */}
    <div className="navigation_content_wrapper">
      <SideNavigation isNavigationOpen={false}/>
      <div className="wrapper">
        <Outlet /> {/* Renders the nested route components */}
      </div>
    </div>
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Use MainLayout as the root layout
    children: [
      { path: "/", element: <Root /> },
      { 
        path: "/forgotPassword", 
        element: (
          <ProtectedRoute>
            <Form formType="forgotPassword" />
          </ProtectedRoute>
        ),
      },
      { 
        path: "/resetPassword/:token", 
        element: (
          <ProtectedRoute>
            <Form formType="resetPassword" />
          </ProtectedRoute>
        ),
      },
      { 
        path: "/login", 
        element: (
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        ),
      },
      { 
        path: "/user/add-article", 
        element: <AddArticle /> 
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