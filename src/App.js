import "./App.css";
import QRcode from "react-qr-code";
import { useEffect, useState } from "react";
import QrSheet from "./Pages/QrSheet/QrSheet";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import QrMake from "./Pages/qrmake/QrMake";
import Appbar from "./components/appbar/appbar";
import axios from "axios";
import { baseurl } from "./api/apiConfig";

function App() {
  let navigate = useNavigate()
  useEffect(()=>{
    verifyToken()
  },[])
  const verifyToken = () => {
    if (!localStorage.getItem('token')) {
      return
    }
    axios({
      method: 'post',
      url: `${baseurl.base_url}/mhere/verify-token`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(function (response) {
        //console.log(response.data)
      })
      .catch(function (err) {
       // console.log(err)
        localStorage.clear()
        localStorage.removeItem('employee_id')
        localStorage.removeItem('token')
        localStorage.removeItem('fullname')
        localStorage.removeItem('email')
        navigate('/login')
      })
  }
  const Dashboard = () => (
    <div>
      <Appbar></Appbar>
      <div style={{ padding: "30px 20px" }}>
        <Outlet />
      </div>
    </div>
  );
  const Auth = () => (
    <div>
      <Outlet />
    </div>
  );

  return (
    <div className="App">
      <Routes>
        <Route element={<Dashboard />}>
          <Route exact path="/"  element={localStorage.getItem("token") ? (JSON.parse(localStorage.getItem("module_access"))?.qr_gen?<QrSheet />: <Navigate replace to="/makeqr" /> ): <Navigate replace to="/login" />}></Route>
          <Route exact path="/makeqr" element={localStorage.getItem("token") ?(JSON.parse(localStorage.getItem("module_access"))?.scan_to_qr?<QrMake />:<Navigate replace to="/login" />)  : <Navigate replace to="/login" />}></Route>
        </Route>
        <Route element={<Auth />}>
          <Route exact path="/login" element={<Login />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
