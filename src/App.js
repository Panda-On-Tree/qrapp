import './App.css';
import QRcode from "react-qr-code";
import { useState } from 'react';
import QrSheet from './Pages/QrSheet/QrSheet';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Pages/Login/Login';


function App() {





  return (
    <div className="App">
      <Routes>
      <Route
          exact
          path="/"
          element={
            localStorage.getItem('token') ? (
              <QrSheet />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        ></Route>
      <Route
          exact
          path="/login"
          element={
            <Login />
          }
        ></Route>
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
