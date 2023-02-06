import { Box } from "@mui/system";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useState } from "react";
import { useEffect } from "react";
import { baseurl } from "../../api/apiConfig";
import "./QrView.css";
export const QrView = () => {
  const [qrScanData, setQrScanData] = useState([]);

  useEffect(() => {
    getQrView();
  }, []);

  function getQrView() {
    const data = {
      start_date: "2023-01-11",
      end_date: "2023-01-22",
    };
    axios({
      method: "post",
      url: `${baseurl.base_url}/qrapp/get-qr-view`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
    })
      .then((res) => {
        console.log(res);
        setQrScanData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(err.response.data.message);
      });
  }

  const options = {
    tableBodyMaxHeight: "64vh",
    responsive: "standard",
    selectableRowsHideCheckboxes: true,
    elevation: 1,
    setTableProps: () => {
      return {
        // material ui v4 only
        size: "small",
      };
    },
    setCellProps: () => {
      return {
        style: { border: "1px solid black" },
      };
    },
  };
  const columns = [
    { name: "batch_no", label: "Batch No", options: { filter: true, sort: true } },
    { name: "created_by", label: "Scanned By", options: { filter: true, sort: true } },
    { name: "serial_number", label: "Serial Number", options: { filter: true, sort: true } },
  ];

  return (
    <Box>
      <Box className="table-ceam">
        <MUIDataTable title={"Last Scans"} data={qrScanData} columns={columns} options={options} />
      </Box>
    </Box>
  );
};
