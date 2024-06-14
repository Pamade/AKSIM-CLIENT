import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Root/Root.tsx'
import Login from './Login/Login.tsx'
import { UserProvider } from './Context/UserContext.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // Nested Routes
    // children:[
    //   {
    //     path:"somepath",
    //     element:Somecomponent
    //   }
    // ]
  },
  
  {
    path:"/login",
    element:<Login />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <UserProvider>
      <div className="wrapper">
        <RouterProvider router={router}/>
      </div>
    </UserProvider>,
)
