import ReactDOM from 'react-dom/client'
import './index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Root/Root.tsx'
import Login from './Login/Login.tsx'
import Form from './Form/Form.tsx'
import Header from "./Header/Header.tsx";
import { UserProvider } from './Context/UserContext.tsx'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.tsx'
import App from './App.tsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path:"/forgotPassword",
    element:
    (
    <ProtectedRoute>
      <Form formType="forgotPassword"/>
      </ProtectedRoute>
    )
  },
  { 
    path:"/resetPassword/:token", 
    element:
    (
    <ProtectedRoute>
      <Form formType="resetPassword"/>
      </ProtectedRoute>
    )
  },
  {
    path:"/login",
    element:(
      <ProtectedRoute>
        <Login />
      </ProtectedRoute>
    )
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <UserProvider>
      <App>
        <div className="wrapper">
            <Header>
              <RouterProvider router={router}/>
            </Header>
        </div>
      </App>
    </UserProvider>,
)
