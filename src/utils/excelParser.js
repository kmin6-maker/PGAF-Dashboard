import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Assume first sheet is the one we want, since it's the survey response
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        // Normalize the data keys for easier consumption in components
        const normalizedData = jsonData.map(row => {
          return {
            name: row["What's your full name?"] || row["Name"] || "Unknown",
            email: row["Best email to reach you?"] || row["Email"] || "",
            location: row["Where are you based?"] || row["Location"] || "",
            status: row["What best describes your current situation?"] || row["Status"] || "",
            function: row["Back in your P&G days - what was your world?"] || row["Function"] || "",
            tenure: row["How many years were you part of the P&G family?"] || row["Tenure"] || "",
            generation: row["Which generation do you belong to?"] || row["Generation"] || "",
            leadPGAF: row["Nice. Open to leading something at PGAF?"] || row["Lead PGAF?"] || "",
            skills: row["What would you bring to a team? Pick top 3."] || row["Skills"] || "",
            hours: row["Real talk - how much time per month?"] || row["Hours"] || "",
            // Store raw row for backup or full search
            raw: row
          };
        });

        resolve(normalizedData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};

export const fetchGoogleSheetData = async (sheetUrl) => {
  try {
    // Convert standard sharing URL to CSV export URL
    const match = sheetUrl.match(/\/d\/(.*?)(\/|$)/);
    if (!match) throw new Error("Invalid Google Sheet URL");
    
    const sheetId = match[1];
    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    const response = await fetch(exportUrl);
    if (!response.ok) throw new Error("Failed to fetch Google Sheet");
    
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    // Normalize the data keys
    const normalizedData = jsonData.map(row => {
      return {
        name: row["What's your full name?"] || row["Name"] || "Unknown",
        email: row["Best email to reach you?"] || row["Email"] || "",
        location: row["Where are you based?"] || row["Location"] || "",
        status: row["What best describes your current situation?"] || row["Status"] || "",
        function: row["Back in your P&G days - what was your world?"] || row["Function"] || "",
        tenure: row["How many years were you part of the P&G family?"] || row["Tenure"] || "",
        generation: row["Which generation do you belong to?"] || row["Generation"] || "",
        leadPGAF: row["Nice. Open to leading something at PGAF?"] || row["Lead PGAF?"] || "",
        skills: row["What would you bring to a team? Pick top 3."] || row["Skills"] || "",
        hours: row["Real talk - how much time per month?"] || row["Hours"] || "",
        easier: row["What would make it easier to get involved?"] || "",
        ambassadorType: row["ambassador_type"] || "",
        donorStatus: row["donor_status"] || "",
        submittedAt: row["Submitted At"] || "",
        raw: row
      };
    });

    return normalizedData;
  } catch (error) {
    console.error("Error fetching Google Sheet:", error);
    throw error;
  }
};

