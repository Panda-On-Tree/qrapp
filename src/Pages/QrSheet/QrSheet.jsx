import React, { useRef, useState } from "react";
import * as xlsx from "xlsx";
import "./QrSheet.css";
//import QRcode from "react-qr-code";
import ReactToPrint from "react-to-print";
import { useNavigate } from 'react-router-dom';
import {QRCodeSVG} from 'qrcode.react';
import logo from "./assets/logo2.png";
function QrSheet() {
    const [col, setCol] = useState();
    const [file, setFile] = useState([]);
    let navigate = useNavigate()

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                console.log(json);
                if(json.length>500){
                    alert("Inserted more than 500")
                    return
                }
                setFile(json);
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    };
    const componentRef = useRef();

    return (
        <div className="qr-sheet-main">
            {/*   <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      /> */}
            <div className="qr-buttons">
                <input
                    type="file"
                    name=""
                    id=""
                    onChange={(e) => {
                        readUploadFile(e);
                    }}
                />
                <button
                    className="print-button"
                    onClick={() => {
                        window.print();
                    }}>
                    Print
                </button>
                <button
                    className="logout-button"
                    onClick={() => {
                        localStorage.clear();
                        navigate('/login')
                    }}>
                    Logout
                </button>
            </div>
            <div className="sheets-inner">
                <div style={{"height":"40px"}} className="sheet">
                    <h2>Printing Bar Codes</h2>
                </div>
                {file?.slice(0,500).map((item, i) => (
                    <div key={i} className="sheet">
                        <div className="sheet-left">
                            <div  className="sheet-header" >
                                <h4>ASSET IDENTIFICATION TAG</h4>
                                <h4 className="do-not-remove">(DO NOT REMOVE)</h4>
                            </div>
                            
                                <h5>{item["Location of Asset"]}</h5>
                                <p>{item["Discription"]}</p>
                            
                        </div>
                        <div className="sheet-right">
                            <img height="55px" src={logo} alt="" />
                            <QRCodeSVG size={80} value={item["QR Code"]} />
                           {/*  <QRcode size={80} value={item["QR Code"]}></QRcode> */}
                            <h4>{item["Asset Code"]}</h4>
                        </div>
                    </div>
                ))}

                {/*  <div  ref={componentRef}  id='sheet-one' className='sheet'>
            <div className='sheet-left'>
                <h3>Asset Identification Tag</h3>
                <h4>(DO NOT REMOVE)</h4>
                <div className='asset-description'>
                    <h5>MIPL/LP/21-22/001</h5>
                    <p>Laptop</p>
                </div>
            </div>
            <div className='sheet-right'>
                <h3>MICROTEK</h3>
                 <QRcode  size={100}  value ="111"></QRcode>
                <h4>S.No:026442310453</h4>
            </div>
        </div>
        <div  ref={componentRef}  id='sheet-one' className='sheet'>
            <div className='sheet-left'>
                <h3>Asset Identification Tag</h3>
                <h4>(DO NOT REMOVE)</h4>
                <div className='asset-description'>
                    <h5>MIPL/LP/21-22/001</h5>
                    <p>Laptop</p>
                </div>
            </div>
            <div className='sheet-right'>
                <h3>MICROTEK</h3>
                 <QRcode  size={100}  value ="111"></QRcode>
                <h4>S.No:026442310453</h4>
            </div>
        </div> */}
            </div>
        </div>
    );
}

export default QrSheet;
