import ReactDOM from 'react-dom/client';
import './index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Login/Login.tsx';
import Form from './Form/Form.tsx';
import AddArticle from './AddArticle/AddArticle.tsx';
import { UserProvider } from './Context/UserContext.tsx';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.tsx';
import App from './App.tsx';
import MainContent from './MainContent/MainContent.tsx';
import UserLoggedRoute from './UserLoggedRoute/UserLoggedRoute.tsx';
import SelectSections from './SelectSections/SelectSections.tsx';
import SingleArticle from './SingleArticle/SingleArticle.tsx';
import SingleAksimArticle from './SingleArticle/SingleAksimArticle.tsx';
import Profile from './Profile/Profile.tsx';
import MainLayout from './MainLayout/MainLayout.tsx';
import Opinions from './Opinions/Opinions.tsx';
import UserArticlesDisplay from './Profile/UserArticlesDisplay.tsx';
import UserSettings from './Profile/UserSettings.tsx';
import EditArticle from './EditArticle/EditArticle.tsx';
import AksimUsers from './AksimUsers/AksimUsers.tsx';

export const apiKey = import.meta.env.VITE_API_KEY;

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Use MainLayout as the root layout
    children: [
      { path: "/", element: <MainContent /> },
      {path:"/opinions", element:<Opinions />},
      {path:"/opinions/:authorID", element: <Opinions />},
      {path:"/select-sections", element: <SelectSections />},
      {path:"/article/:articleID", element: <SingleArticle />},
      {path:"/aksim-article/:articleID", element: <SingleAksimArticle />},
      {path:"/profile/:userName", element:(<Profile />), children:[{
        path:"",
        element:<UserArticlesDisplay />
      }, 
      {
        path:"settings",
        element: <ProtectedRoute><UserSettings /></ProtectedRoute>
      }
    ]},
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
      {   
        path: "/user/edit-article/:articleID", 
        element: 
         <ProtectedRoute>
            <EditArticle />
          </ProtectedRoute>
      },
      {
        path:"/aksim-users",
        element:<AksimUsers />
      }
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