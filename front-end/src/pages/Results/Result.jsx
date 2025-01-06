import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import "./Result.css";
import NavigationHeader from '../../components/ui/NavigationHeader';

const ResponsesTable = () => {
  const location = useLocation();
  const { formID } = location.state || {};
  const [groupName, setGroupName] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isFetched, setIsFetched] = useState(false); // Track if responses were already fetched

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        // console.log("Fetching group name...");
        const response = await fetch(`http://localhost:1000/groups/${formID}`, {
          method: "GET",
        });
        const data = await response.json();
        if (data.length > 0) {
          setGroupName(data[0].GroupName);
        } else {
          setGroupName("Group name not found");
        }
      } catch (error) {
        console.error("Error fetching group name:", error);
        setGroupName("Error loading group name");
      }
    };

    const fetchResponses = async () => {
      if (isFetched) return; // Prevent additional fetch calls if already fetched
      try {
        // console.log("Fetching responses...");
        const response = await fetch("http://localhost:1000/answers/getAllAnswersByForm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formID }),
        });

        const data = await response.json();
        // console.log("Fetched data:", data); // Log the data to confirm its structure

        // Filter duplicates based on unique identifier or key combination
        // const uniqueData = Array.from(
        //   new Map(data.map((item) => [JSON.stringify(item), item])).values()
        // );

        const questionColumns = new Set();
        const formattedRows = data.map((item, index) => {
          const answers = typeof item.Answers === "string" ? JSON.parse(item.Answers) : item.Answers;
          Object.keys(answers).forEach(question => questionColumns.add(question));

          return {
            id: index + 1,
            Team: item.Team,
            Reviewer: item.Reviewer,
            Reviewee: item.Reviewee || "N/A",
            ...answers,
          };
        });

        const staticColumns = [
          { field: "Team", headerName: "Team", width: 150 },
          { field: "Reviewer", headerName: "Reviewer", width: 200 },
          { field: "Reviewee", headerName: "Reviewee", width: 200 }
        ];

        const dynamicColumns = Array.from(questionColumns).map(question => ({
          field: question,
          headerName: question,
          width: 300
        }));

        setColumns([...staticColumns, ...dynamicColumns]);
        setRows(formattedRows);
        setIsFetched(true); // Mark as fetched to prevent duplicate calls
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };


    if (formID) {
      fetchGroupName();
      fetchResponses();
    }
  }, [formID, isFetched]); // Add isFetched to dependencies to prevent unnecessary refetching

  const handleExportCSV = () => {
    const escapeCSVValue = (value) => {
      if (typeof value === 'string') {
        // Escape double quotes by replacing " with ""
        const escapedValue = value.replace(/"/g, '""');
        // Enclose the value in double quotes if it contains a comma, new line, or double quote
        if (escapedValue.includes(',') || escapedValue.includes('\n') || escapedValue.includes('"')) {
          return `"${escapedValue}"`;
        }
        return escapedValue;
      }
      return value; // Return as-is for non-string values
    };

    const csvContent = [
      columns.map((col) => escapeCSVValue(col.headerName)).join(","),
      ...rows.map((row) => columns.map((col) => escapeCSVValue(row[col.field] || "")).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "responses.csv");
  };

  return (
    <main>
      <NavigationHeader />
      <div className="responses-table-container">
        <h3>{groupName || "Loading Group Name..."}</h3>
        <div className="responses-buttons">
          {/* <Button variant="contained" className="pdf-export" onClick={() => alert("PDF Export (Coming Soon)")}>
            PDF
          </Button> */}
          {/* <Button variant="contained" className="excel-export" onClick={() => alert("Excel Export (Coming Soon)")}>
            EXCEL
          </Button> */}
          <Button variant="contained" className="csv-export" onClick={handleExportCSV}>
            Save As CSV
            <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faSave} size="lg" />
          </Button>
          {/* <Button variant="contained" className="summary" onClick={() => alert("Team Summary (Coming Soon)")}>
            TEAM SUMMARY
          </Button> */}
        </div>

        <div className="data-grid-container">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f57c00",
                color: "#fff",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default ResponsesTable;
