import React, { useEffect, useRef, useState } from "react";
import * as xlsx from "xlsx";
import "./QrSheet.css";
//import QRcode from "react-qr-code";
import ReactToPrint from "react-to-print";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import logo from "./assets/logo2.png";
import axios from "axios";
import { baseurl } from "../../api/apiConfig";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
function QrSheet() {
  const [col, setCol] = useState();
  const [file, setFile] = useState([]);
  const [uploadFile, setUploadFile] = useState();
  const [fileName, setFileName] = useState("");
  let navigate = useNavigate();

  const value = useRef(false);

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
        if (json.length > 500) {
          alert("Inserted more than 500");
          return;
        }
        setFile(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  function upload() {
    console.log(uploadFile);
    var formdata = new FormData();
    formdata.append("employee_id", localStorage.getItem("employee_id"));
    formdata.append("qrcode_file", uploadFile);
    for (const value of formdata.values()) {
      console.log(value);
    }
    axios({
      method: "post",
      url: `${baseurl.base_url}/mhere/log-qr-file`,
      headers: {
        "Content-Type": "multipart/formdata",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: formdata,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="qr-sheet-main">
      {/*   <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      /> */}
      <div className="qr-buttons">
        <Box sx={{ display: "flex", gap: "35px", alignItems: "center" }}>
          <Typography variant="body1">{fileName}</Typography>
          <Button variant="contained" component="label">
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => {
                readUploadFile(e);
                setFileName(e.target.files[0].name);
                setUploadFile(e.target.files[0]);
              }}
            />
          </Button>
          <Button
            sx={{ width: "150px" }}
            variant="contained"
            onClick={() => {
              window.print();
              upload();
            }}
          >
            Print
          </Button>
        </Box>
      </div>
      <div className="sheets-inner">
        <div style={{ height: "40px" }} className="sheet">
          <h2>Printing Bar Codes</h2>
        </div>
        {file?.slice(0, 500).map((item, i) => (
          <div key={i} className="sheet">
            <div className="sheet-left">
              <div className="sheet-header">
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
      </div>
    </div>
  );
}

export default QrSheet;
