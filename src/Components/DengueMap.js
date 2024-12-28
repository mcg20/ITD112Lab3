import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import { db } from "../firebase";  // Corrected import path for Firebase
import { collection, getDocs } from "firebase/firestore";
import philippineData from './../data/ph.json';
import "leaflet/dist/leaflet.css";

// CSS styles for the map container
const mapContainerStyle = {
  width: '100%',
  height: '1000px',  // Adjust the height of the map as needed
  marginTop: '20px'
};

// CSS styles for the legend
const legendStyle = {
  backgroundColor: 'white',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  fontSize: '14px',
  position: 'absolute',
  top: '20px',
  right: '20px',
  zIndex: 1000
};

const DengueMap = ({ dengueData }) => {
  const [geoJsonData, setGeoJsonData] = useState(philippineData);

  useEffect(() => {
    // You may fetch additional data from Firebase here if needed
  }, [dengueData]);

  // Color coding function for cases
  const getColor = (cases) => {
    return cases > 5000 ? '#FF0000' :  // Red for very high cases
      cases > 1000 ? '#BD0026' :
      cases > 500  ? '#E31A1C' :
      cases > 100  ? '#FC4E2A' :
      cases > 50   ? '#FD8D3C' :
      cases > 10   ? '#FEB24C' :
      cases > 0    ? '#FED976' :
      '#FFEDA0';
  };

  const normalizeString = (str) => str.toUpperCase().trim();

  // Function to find a matching region
  const findMatchingRegion = (regionName) => {
    // Compare region names by checking if the regionName is a substring of any region in dengueData
    return dengueData.find(data => normalizeString(data.region).includes(normalizeString(regionName)));
  };

  // Styling function for each feature
  const styleFeature = (feature) => {
    const regionName = normalizeString(feature.properties.name);
    const regionData = findMatchingRegion(regionName); // Try to find the matching region based on substring match
    const cases = regionData ? regionData.cases : 0;
    return {
      fillColor: getColor(cases),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  // Tooltip to show case information on hover
  const onEachFeature = (feature, layer) => {
    const regionName = normalizeString(feature.properties.name);
    const regionData = findMatchingRegion(regionName); // Get matching region data
    const cases = regionData ? regionData.cases : 0;
    layer.bindTooltip(
      `<strong>${feature.properties.name}</strong><br>Cases: ${cases}`,
      { direction: "center", className: "custom-tooltip", permanent: false }
    );
  };

  return (
    <div className="map-container" style={mapContainerStyle}>
      <h1>Philippines Dengue Cases Choropleth Map</h1>
      <MapContainer 
        center={[12.8797, 121.7740]} // Coordinates for the Philippines
        zoom={6} 
        className="leaflet-container"
        maxBounds={[ // Limit map view to the Philippines
          [4.5, 116.5], // Southwest bound (bottom left)
          [21.5, 127.5] // Northeast bound (top right)
        ]}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        {dengueData.length > 0 && (
          <GeoJSON 
            data={geoJsonData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Legend for color indicators */}
      <div style={legendStyle}>
        <h4>Dengue Case Severity</h4>
        <div>
          <span style={{ backgroundColor: '#FF0000', width: '20px', height: '20px', display: 'inline-block' }}></span> Very High Cases (5000+)
        </div>
        <div>
          <span style={{ backgroundColor: '#BD0026', width: '20px', height: '20px', display: 'inline-block' }}></span> High Cases (1000+)
        </div>
        <div>
          <span style={{ backgroundColor: '#E31A1C', width: '20px', height: '20px', display: 'inline-block' }}></span> Medium High Cases (500+)
        </div>
        <div>
          <span style={{ backgroundColor: '#FC4E2A', width: '20px', height: '20px', display: 'inline-block' }}></span> Moderate Cases (100+)
        </div>
        <div>
          <span style={{ backgroundColor: '#FD8D3C', width: '20px', height: '20px', display: 'inline-block' }}></span> Low Cases (50+)
        </div>
        <div>
          <span style={{ backgroundColor: '#FEB24C', width: '20px', height: '20px', display: 'inline-block' }}></span> Very Low Cases (10+)
        </div>
        <div>
          <span style={{ backgroundColor: '#FED976', width: '20px', height: '20px', display: 'inline-block' }}></span> Low/No Cases
        </div>
      </div>
    </div>
  );
};

export default DengueMap;
