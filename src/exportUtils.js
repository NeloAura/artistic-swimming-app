// exportUtils.js

import * as XLSX from 'xlsx';
import exportFromJSON from 'export-from-json';
import { saveAs } from 'file-saver';

const calculateAverageScore = (scores) => {
    const total = scores.reduce((sum, score) => sum + score.value, 0);
    return total / scores.length;
  };


  export const exportTableToCsv = (data, fileName) => {
    const exportData = data.map((participant) => ({
      'Participant Name': `${participant.firstName} ${participant.lastName}`,
      Division: participant.division,
      'Age Category': participant.age_category,
      Events: participant.event,
      Types: participant.scores.map((score) => score.type).join(','),
      Scores: participant.scores.map((score) => score.value).join(','),
      'Average Score': calculateAverageScore(participant.scores),
    }));
  
    exportFromJSON({ data: exportData, fileName, exportType: 'csv' });
  };
  
  export const exportTableToExcel = (data, fileName) => {
    const exportData = data.map((participant) => ({
      'Participant Name': `${participant.firstName} ${participant.lastName}`,
      Division: participant.division,
      'Age Category': participant.age_category,
      Events: participant.event,
      Types: participant.scores.map((score) => score.type).join(','),
      Scores: participant.scores.map((score) => score.value).join(','),
      'Average Score': calculateAverageScore(participant.scores),
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(file, fileName);
  };