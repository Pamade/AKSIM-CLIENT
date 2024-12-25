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
    element: <Header><Root /></Header>,
  },
  {
    path:"/forgotPassword",
    element:
    (
    <ProtectedRoute>
      <Header>
        <Form formType="forgotPassword"/>
      </Header>
      </ProtectedRoute>
    )
  },
  { 
    path:"/resetPassword/:token", 
    element:
    (
    <ProtectedRoute>
        <Header>
          <Form formType="resetPassword"/>
        </Header>
      </ProtectedRoute>
    )
  },
  {
    path:"/login",
    element:(
      <ProtectedRoute>
        <Header>
          <Login />
        </Header>
      </ProtectedRoute>
    )
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <App>
      <div className="wrapper">
            <RouterProvider router={router}/>
      </div>
    </App>
  </UserProvider>,
)  