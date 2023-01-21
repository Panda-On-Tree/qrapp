import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { QRCodeSVG } from "qrcode.react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./QrMake.css";
import { debounce } from "lodash";
import axios from "axios";
import { baseurl } from "../../api/apiConfig";
import ReactToPrint from "react-to-print";

const QrMake = () => {
  const [date, setDate] = useState(new Date());

  const [disabledButton, setDisabledButton] = useState(true);
  const [qrcodeValue, setQrcodeValue] = useState();
  const [productList, setProductList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [printSize, setPrintSize] = useState({
    height: "25",
    width: "50",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const componentToPrint = useRef(null);
  const inputRef = useRef();
  const [sapCode, setSapCode] = useState("");
  useEffect(() => {
    fetchProductList();
  }, []);
  const [scanNumber, setScanNumber] = useState()
  const scanNo = useRef(1);
  const lines = useRef(0);
  const [autocompData, setautocompData] = useState({
    product:"",
    model:""
  })
  const [activeStep, setActiveStep] = useState(0);
  const [batchNumber, setBatchNumber] = useState()

  const handleNextStepper = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length
}

  const handleDebounce = useCallback(debounce(handleNext, 500), []);
  function handleNext() {
    const element = document.getElementById("outlined-multiline-flexible");
   if(checkIfDuplicateExists(element.value.split("\n"))){
     alert("Duplicate Value Found")
      setQrcodeValue("")
      lines.current=0;
      return;
   }
    if (lines.current + 1 == scanNo.current) {
      element.disabled = true;
      setDisabledButton(false);
      return;
    }
    console.log(element.value.split("\n"));
   // element.value += "\n";
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
      sap_part_code: sapCode ||"empty",
      employee_id: localStorage.getItem("employee_id"),
      batch_no: batchNumber
    };
    console.log(data);
    axios({
      method: "post",
      url: `${baseurl.base_url}/qrapp/log-serial-qr-record`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
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

  function getBactchNumber(){
    axios({
      method: "get",
      url: `${baseurl.base_url}/qrapp/get-next-batch-no`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
       console.log(res.data.data);
       setBatchNumber(res.data.data.batch_no)
      })
      .catch((err) => {
        console.log(err);
        // toast.error(err.response.data.message);
      });
  }

  return (
    <div>
      {/*  <Box sx={{ px: 2, pb: 1, display: "flex", gap: "40px", flexWrap: "wrap" }}>
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
            lines.current = 0;
            setQrcodeValue("");
            document.getElementById("outlined-multiline-flexible").disabled = false;
            inputRef.current.focus();
          }}
        >
          Set
        </Button>
        <Button
          color="warning"
          onClick={() => {
            setOpenDialog(true);
          }}
          variant="contained"
        >
          Print Settings
        </Button>
      </Box> */}
      {/*  <Box sx={{ p: 2, display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
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
            setDisabledButton(true);

            sendData();
            setQrcodeValue("");
            lines.current = 0;
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
      </Box> */}
      {/*  <p style={{ marginLeft: "20px" }} id="height-data"></p>
      <div className="sheets-inner">
        <div ref={(el) => (componentToPrint.current = el)} style={{ justifyContent: "space-around", height: `${printSize.height}mm`, width: `${printSize.width}mm` }} id="sheet" className="sheet sheet-resize">
          <div className="sheet-right-second">
            <QRCodeSVG size={80} value={qrcodeValue} />
            <h4></h4>
          </div>
        </div>
      </div> */}
      <Box sx={{ width: "90%", ml: 5 }}>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>
              <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
                Configure Product And Model
              </Typography>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
                Scan Barcodes
              </Typography>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
                Print BarCode
              </Typography>
            </StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 ? (
          <React.Fragment>
            <Box sx={{ minHeight: "50vh" }}>
              <Box sx={{ mx: 4, display: "flex", gap: "40px", flexWrap: "wrap", minWidth: "100%", mt: 5 }}>
                <Autocomplete
                  size="small"
                  value={autocompData.product || null}
                  className="autocomp-input"
        
                  defaultValue=""
                  onChange={(event, newValue) => {
                    if (newValue?.id) {
                      fetchModelList(newValue?.id);
                      setautocompData({...autocompData, product:newValue})
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
                  value={autocompData.model || null}
                  onChange={(event, newValue) => {
                    if (newValue?.id) {
                      setautocompData({...autocompData, model:newValue})
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
                    value={scanNumber}
                  onChange={(e) => {
                    setScanNumber(e.target.value)
                    scanNo.current = e.target.value;
                  }}
                ></TextField>
              </Box>
              {/*  <Button
                  sx={{ minWidth: "100px" }}
                  variant="contained"
                  onClick={() => {
                    lines.current = 0;
                    setQrcodeValue("");
                    document.getElementById("outlined-multiline-flexible").disabled = false;
                    inputRef.current.focus();
                  }}
                >
                  Set
                </Button> */}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2, minWidth: "100%", justifyContent: "space-between" }}>
              <Button disabled onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                disabled={autocompData.model && autocompData.product && scanNumber?false:true}
                onClick={() => {
                  getBactchNumber()
                  handleNextStepper();
                  lines.current = 0;
                  setQrcodeValue("");
                  document.getElementById("outlined-multiline-flexible").disabled = false;
                  inputRef.current.focus();
                }}
                sx={{ mt: 1, mr: 1 }}
              >
                Continue
              </Button>
            </Box>
          </React.Fragment>
        ) : null}
        {activeStep === 1 ? (
          <React.Fragment>
            <Box sx={{ mx: 4, display: "flex", gap: "40px",flexDirection:'column', flexWrap: "wrap", minWidth: "100%", mt: 5, minHeight: "50vh" }}>
              <Typography>Batch No. - {batchNumber}</Typography>
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
                focused={activeStep == 1 ? true : false}
                autoFocus={activeStep == 1 ? true : false}
                multiline
                value={qrcodeValue}
                onChange={(e) => {
                  setQrcodeValue(e.target.value.toUpperCase());
                  handleDebounce();
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2, minWidth: "100%", justifyContent: "space-between" }}>
              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                Back
              </Button>
              <Button disabled={disabledButton} variant="contained" onClick={handleNextStepper} sx={{ mt: 1, mr: 1 }}>
                Continue
              </Button>
            </Box>
          </React.Fragment>
        ) : null}
        {activeStep === 2 ? (
          <React.Fragment>
            <Box sx={{ mx: 4, display: "flex", gap: "40px", flexWrap: "wrap", minWidth: "100%", mt: 5, minHeight: "50vh" }}>
              <div className="sheets-inner" >
                <div ref={(el) => (componentToPrint.current = el)} style={{ justifyContent: "space-around", height: `${printSize.height}mm`, width: `${printSize.width}mm`, padding:'2px' }} id="sheet" className="sheet sheet-resize">
                  <div className="sheet-right-second">
                    <QRCodeSVG size={80} value={qrcodeValue} />
                    <h4></h4>
                  </div>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Stack spacing={0}>
                      <Stack sx={{ justifyContent: "space-between", borderBottom: "1px solid black" }} direction="row" spacing={1}>
                        <Typography sx={{fontSize:'10px'}} variant="body2">Batch Number -</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize:'10px' }} variant="body2">
                          {batchNumber}
                        </Typography>
                      </Stack>
                      <Stack sx={{ justifyContent: "space-between", borderBottom: "1px solid black" }} direction="row" spacing={1}>
                        <Typography sx={{fontSize:'10px'}} variant="body2">Date -</Typography>
                        <Typography sx={{ fontWeight: 600,fontSize:'10px' }} variant="body2">
                          {date.getDate()}/{date.getMonth() + 1}/{`${date.getFullYear()}`}
                        </Typography>
                      </Stack>
                      <Stack sx={{ justifyContent: "space-between", borderBottom: "1px solid black" }} direction="row" spacing={1}>
                        <Typography sx={{fontSize:'10px'}} variant="body2">PartCode -</Typography>
                        <Typography sx={{ fontWeight: 600.,fontSize:'10px' }} variant="body2">
                          {sapCode}
                        </Typography>
                      </Stack>
                      <Stack sx={{ justifyContent: "space-between", borderBottom: "1px solid black" }} direction="row" spacing={1}>
                        <Typography sx={{fontSize:'10px'}} variant="body2">Vender Code -</Typography>
                        <Typography sx={{ fontWeight: 600,fontSize:'10px' }} variant="body2">
                          {localStorage.getItem("vendor_code")}
                        </Typography>
                      </Stack>
                      <Stack sx={{ justifyContent: "space-between" }} direction="row" spacing={1}>
                        <Typography sx={{fontSize:'10px'}} variant="body2">Quantity -</Typography>
                        <Typography sx={{ fontWeight: 600,fontSize:'10px' }} variant="body2">
                          {scanNo.current}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </div>
              </div>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2, minWidth: "100%", justifyContent: "space-between" }}>
              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                Back
              </Button>
              <Box sx={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "center" }}>
                <Button
                  color="warning"
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                  variant="contained"
                >
                  Print Settings
                </Button>
                <ReactToPrint
                  onAfterPrint={() => {
                    setActiveStep(0)
                    setDisabledButton(true);
                    setScanNumber("")
            
                    sendData();
                    setQrcodeValue("");
                    lines.current = 0;
                    document.getElementById("outlined-multiline-flexible").disabled = false;
                    inputRef.current.focus();
                  }}
                  trigger={() => {
                    return (
                      <Button disabled={disabledButton} onClick={handleNextStepper} sx={{ mr: 1 }} id={"print"} variant="contained">
                        Print & Continue
                      </Button>
                    );
                  }}
                  content={() => componentToPrint.current}
                />
              </Box>
            </Box>
          </React.Fragment>
        ) : null}
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
    </div>
  );
};

export default QrMake;
