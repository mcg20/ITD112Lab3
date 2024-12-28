import React, { useState, useEffect } from "react";
import AddDengueData from "./Components/AddDengueData";
import DengueDataList from "./Components/DengueDataList";  // Adjust the path as needed
import CsvUploader from "./Components/CsvUploader";
import DengueMap from "./Components/DengueMap";  // Import the DengueMap component
import { collection, getDocs } from "firebase/firestore";
import { db } from './firebase';  
import './App.css';

function App() {
  const [selectedOption, setSelectedOption] = useState("addDengue");
  const [dengueData, setDengueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dengueCollection = collection(db, "dengueData");
        const dengueSnapshot = await getDocs(dengueCollection);
        const dataList = dengueSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDengueData(dataList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error.message);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div className="main-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <ul className="sidebarlist">
            <li onClick={() => setSelectedOption("addDengue")}>Add Dengue Data</li>
            <li onClick={() => setSelectedOption("displayTable")}>Display Dengue Data</li>
            <li onClick={() => setSelectedOption("dengueMap")}>View Map</li>  {/* Update to "dengueMap" */}
          </ul>
        </div>

        {/* Main content */}
        <div className="content">
          <header className="App-header">
            <h1 className="app-title">DENGUE DATA MANAGEMENT</h1>
          </header>

          {selectedOption === "addDengue" && (
            <div className="two-column-section">
              <div className="form-column">
                <AddDengueData />
              </div>
              <div className="form-column">
                <CsvUploader setDengueData={setDengueData} />
              </div>
            </div>
          )}

          {selectedOption === "displayTable" && (
            <div className="single-column-section">
              <DengueDataList data={dengueData} />
            </div>
          )}

          {selectedOption === "dengueMap" && (  // Show DengueMap when selected
            <div className="single-column-section">
              <DengueMap dengueData={dengueData} />  {/* Pass dengueData as props to the map */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
