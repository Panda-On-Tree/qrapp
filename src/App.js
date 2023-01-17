import "./App.css";
import QRcode from "react-qr-code";
import { useState } from "react";
import QrSheet from "./Pages/QrSheet/QrSheet";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import QrMake from "./Pages/qrmake/QrMake";
import Appbar from "./components/appbar/appbar";

function App() {
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
      {/*  <h1>QR Code Generator</h1>
      <QRcode value = {readUploadFile}></QRcode>
      <div classname ="input-here">
        <p>input value </p>
        <input type="file" value = {readUploadFile} onChange={(e)=>{handleChange(e)}}/>
        
      </div> */}
    </div>
  );
}

export default App;
