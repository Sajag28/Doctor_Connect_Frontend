import { useState } from "react";
import axios from "axios";
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import HomePage from './Components/HomePage'
import PateintLogin from './Components/PateintLogin.jsx'
import PatientSignup from './Components/PatientSignup.jsx'
import DoctorSignup from "./Components/DoctorSignup.jsx";
import DoctorLogin from "./Components/DoctorLogin.jsx"
import PatientDashboard from "./Components/PatientDasboard.jsx"
import DoctorIDPage from "./Components/DoctorIDPage.jsx"
import DoctorDashBoard from "./Components/DoctorDashboard.jsx"
import PatientMainPage from "./Components/PateintMain.jsx"
const App = () => {
  const router=createBrowserRouter(
    [
      {
        path:'/',
        element:<HomePage/>
      },
      {
       path:'/PateintLogin',
       element:<PateintLogin/>
      },
      {
        path:'/PatientSignup',
        element:<PatientSignup/>
      },
      {
        path:'/DoctorSignup',
        element:<DoctorSignup/>
      },
      {
        path:'/DoctorLogin',
        element:<DoctorLogin/>
      },
      {
        path:'/PatientDashboard',
        element:<PatientDashboard/>
      },
      {
        path:'/DoctorIDPage',
        element:<DoctorIDPage/>
      },{
        path:'/DoctorDashBoard',
        element:<DoctorDashBoard/>
      },{
        path:'/PatientMainPage',
        element:<PatientMainPage/>
      }
    ]
  )
  

  return (
    
    <RouterProvider router={router}> </RouterProvider>
    
  );
};

export default App;
