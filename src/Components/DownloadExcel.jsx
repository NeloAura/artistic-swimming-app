import { saveAs } from "file-saver";
import {writeFileXLSX as XLSX } from "xlsx";

const handleDownloadExcel = (participants, groups)=> {
    const workbook = XLSX.utils.book_new();
  
    // Create a worksheet for participants
    const participantsSheet = XLSX.utils.json_to_sheet(participants);
    XLSX.utils.book_append_sheet(workbook, participantsSheet, "Participants");
  
    // Create a worksheet for groups
    const groupsSheet = XLSX.utils.json_to_sheet(groups);
    XLSX.utils.book_append_sheet(workbook, groupsSheet, "Groups");
  
    // Generate Excel file
    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  
    // Convert array buffer to Blob
    const blob = new Blob([excelFile], { type: "application/octet-stream" });
  
    // Save the file
    saveAs(blob, "participants_groups_numbers.xlsx");
  };
  
  export default handleDownloadExcel;
