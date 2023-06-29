function createClubScoreTable(data) {
    const tableContainer = document.createElement('div');
    const table = document.createElement('table');
    const tableCaption = document.createElement('caption');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
  
    tableCaption.textContent = 'Club Scores';
    table.appendChild(tableCaption);
  
    const headerRow = document.createElement('tr');
    const clubNameHeader = document.createElement('th');
    const scoreHeader = document.createElement('th');
  
    clubNameHeader.textContent = 'Club Name';
    scoreHeader.textContent = 'Score';
  
    headerRow.appendChild(clubNameHeader);
    headerRow.appendChild(scoreHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    data.forEach((club) => {
      const row = document.createElement('tr');
      const clubNameCell = document.createElement('td');
      const scoreCell = document.createElement('td');
  
      clubNameCell.textContent = club.name;
      scoreCell.textContent = club.averageScore.toFixed(2);
  
      row.appendChild(clubNameCell);
      row.appendChild(scoreCell);
      tbody.appendChild(row);
    });
  
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  
    return tableContainer;
  }
  
  // Example usage with socket.on
  socket.on('clubScoresData', (data) => {
    const tableContainer = createClubScoreTable(data);
    const container = document.getElementById('tableContainer');
    container.innerHTML = ''; // Clear previous content
    container.appendChild(tableContainer);
  });
  