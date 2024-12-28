import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './DengueDataList.css'; // Import the CSS file for styling

function CsvUploader({ setDengueData }) {  // Accept setDengueData as a prop
  const [csvFile, setCsvFile] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  // Handle file upload and parsing
  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const data = [];

      // Parse CSV rows assuming columns: loc, cases, deaths, date, region
      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 5 && index > 0) { // Skip header row
          const dengueData = {
            loc: columns[0].trim(),
            cases: Number(columns[1].trim()),
            deaths: Number(columns[2].trim()),
            date: columns[3].trim(),
            region: columns[4].trim(),
          };

          data.push(dengueData);  // Add parsed data to array
        }
      });

      try {
        // Add data to Firestore
        const batch = data.map(async (item) => {
          await addDoc(collection(db, 'dengueData'), item); // Save to Firebase
        });

        await Promise.all(batch);
        alert('CSV data uploaded successfully!');

        // After upload, update the local dengueData state
        setDengueData((prevData) => [...prevData, ...data]);  // Merge with existing data

      } catch (error) {
        console.error('Error uploading CSV data:', error);
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="CsvUploader">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button className="upload" onClick={handleFileUpload}>Upload CSV</button>
    </div>
  );
}

export default CsvUploader;
