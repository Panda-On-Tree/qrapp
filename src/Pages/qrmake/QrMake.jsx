import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { QRCodeSVG } from "qrcode.react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./QrMake.css";
import { debounce } from "lodash";
import axios from "axios";
import { baseurl } from "../../api/apiConfig";
import ReactToPrint from "react-to-print";

const QrMake = () => {
  const [disabledButton, setDisabledButton] = useState(true)
  const [qrcodeValue, setQrcodeValue] = useState();
  const [productList, setProductList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [printSize, setPrintSize] = useState({
    height: "40",
    width: "40",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const componentToPrint = useRef(null);
  const inputRef = useRef();
  const [sapCode, setSapCode] = useState("");
  useEffect(() => {
    fetchProductList();
  }, []);
  const scanNo = useRef(1);
  const lines = useRef(0)


  const handleDebounce = useCallback(debounce(handleNext, 500), []);
  function handleNext() {
    const element = document.getElementById("outlined-multiline-flexible");
    if (lines.current + 1 == scanNo.current) {
      element.disabled = true;
      setDisabledButton(false)
      return;
    }
    element.value += "\n";
    lines.current = lines.current + 1;
   
  }

  function fetchProductList() {
    axios({
      method: "get",
      url: `${baseurl.base_url}/sim/get-product-external`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setProductList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(err.response.data.message);
      });
  }

  function sendData() {
    const data = {
      serial_numbers: qrcodeValue,
      sap_part_code: sapCode,
      employee_id: localStorage.getItem("employee_id"),
    };
    axios({
        method: "post",
        url: `${baseurl.base_url}/mhere/log-serial-qr-record`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          // toast.error(err.response.data.message);
        });
  }

  function fetchModelList(value) {
    const data = {
      product_id: value,
    };
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/get-model`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
    })
      .then((res) => {
        setModelList(res.data.data);
       // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(err.response.data.message);
      });
  }

  return (
    <div>
      <Box sx={{ px: 2, pb: 1, display: "flex", gap: "40px", flexWrap:'wrap' }}>
        <Autocomplete
          size="small"
          className="autocomp-input"
          onChange={(event, newValue) => {
            if (newValue?.id) {
              fetchModelList(newValue?.id);
            }
          }}
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) => `${option.product_name} (${option.product_code})`}
          options={productList}
          sx={{ width: 280 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product Name"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />
        <Autocomplete
          size="small"
          className="autocomp-input"
          onChange={(event, newValue) => {
            if (newValue?.id) {
              setSapCode(newValue.sap_part_code);
            }
          }}
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) => `${option.model_name} (${option.model_code}) \n SAP-${option.sap_part_code}`}
          options={modelList}
          sx={{ width: 280 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Model Name"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />

        <TextField
          size="small"
          label="Enter Number"
          type="number"
          onChange={(e) => {
            scanNo.current = e.target.value;
          }}
        ></TextField>
        <Button
          sx={{ minWidth: "100px" }}
          variant="contained"
          onClick={() => {
            lines.current =0
            setQrcodeValue("");
            document.getElementById("outlined-multiline-flexible").disabled = false;
            inputRef.current.focus();
          }}
        >
          Set
        </Button>
        <Button 
            color='warning'
          onClick={() => {
            setOpenDialog(true);
          }}
          variant="contained"
        >
          Print Settings
        </Button>
      </Box>
      <Box sx={{ p: 2,display: "flex", gap: "40px" , alignItems:'flex-start', flexWrap:'wrap' }}>
        <TextField
          inputRef={inputRef}
          sx={{
            width: "250px",
            "& .css-dpjnhs-MuiInputBase-root-MuiOutlinedInput-root": {
              padding: "8px",
            },
            "& .MuiInputBase-inputMultiline": {
              textTransform: "uppercase",
            },
          }}
          id="outlined-multiline-flexible"
          multiline
          value={qrcodeValue}
          onChange={(e) => {
            setQrcodeValue(e.target.value.toUpperCase());
            handleDebounce();
          }}
        />
        <ReactToPrint
          onAfterPrint={() => {
      setDisabledButton(true)

            sendData()
            setQrcodeValue("");
            lines.current =0;
            document.getElementById("outlined-multiline-flexible").disabled = false;
            inputRef.current.focus();
          }}
          trigger={() => {
            return (
              <Button disabled={disabledButton} id={"print"} variant="contained">
                {"Print"}
              </Button>
            );
          }}
          content={() => componentToPrint.current}
        />
      
      </Box>
      <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
        <DialogTitle id="alert-dialog-title">Set Height And Width (in mm)</DialogTitle>
        <DialogContent sx={{ minWidth: "500px", display: "flex", gap: "30px" }}>
          <TextField
            type="number"
            value={printSize.height}
            sx={{ mt: 2, maxWidth: "100px" }}
            label="Height"
            size="small"
            onChange={(e) => {
              setPrintSize({ ...printSize, height: e.target.value });
            }}
          ></TextField>
          <TextField
            type="number"
            value={printSize.width}
            sx={{ mt: 2, maxWidth: "100px" }}
            label="Width"
            size="small"
            onChange={(e) => {
              setPrintSize({ ...printSize, width: e.target.value });
            }}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
      <p style={{ marginLeft: "20px" }} id="height-data"></p>
      <div className="sheets-inner">
        <div ref={(el) => (componentToPrint.current = el)} style={{ justifyContent: "space-around", height: `${printSize.height}mm`, width: `${printSize.width}mm` }} id="sheet" className="sheet sheet-resize">
          <div className="sheet-right-second">
            <QRCodeSVG size={80} value={qrcodeValue} />
            <h4></h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrMake;
