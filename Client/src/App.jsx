import React from 'react'
import Registraion from './assets/Components/Registraion'
import Homepage from "./assets/Components/HomePage"
import Login from './assets/Components/Login';
import NotFound from './assets/Components/NotFound';
import Dashboard from './assets/Components/Dashboard';
import ViewChats from './assets/Components/ViewChats';
import "./index.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const App = () => {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Homepage/>
    },
    {
      path:"*",
      element:<NotFound/>
    },
    {
      path:"/register",
      element:<Registraion/>
    },
    {
      path:"/login",
      element:<Login/>
    },
    {
      path:"/chatdashboard",
      element:<Dashboard/>,
      children:[
        {
          path:":id",
          element:<ViewChats/>
        }
      ]
    },
  ])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
