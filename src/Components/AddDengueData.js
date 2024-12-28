import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const AddDengueData = ({ setDengueData }) => {
  const [formData, setFormData] = useState({
    loc: "",
    cases: "",
    deaths: "",
    date: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Adding data to Firestore
      const docRef = await addDoc(collection(db, "dengueData"), formData);
      console.log("Document added with ID: ", docRef.id);

      // Update state with new data
      setDengueData((prevData) => [...prevData, { id: docRef.id, ...formData }]);

      // Show success pop-up
      alert("Data added successfully!");

      // Reset the form fields after submission
      setFormData({
        loc: "",
        cases: "",
        deaths: "",
        date: "",
        region: "",
      });
    } catch (error) {
      // Log errors for debugging
      console.error("Error adding document to Firestore: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    backgroundColor: "#e0f7fa",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    margin: "auto",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #0288d1",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    backgroundColor: "#0288d1",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0277bd",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#1e88e5",
    marginBottom: "20px",
    fontSize: "24px",
  };

  return (
    <div className="add-disease-data-container">
      <h3 style={headingStyle}>Add New Dengue Data</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          name="loc"
          placeholder="Location"
          value={formData.loc}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="number"
          name="cases"
          placeholder="Cases"
          value={formData.cases}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="number"
          name="deaths"
          placeholder="Deaths"
          value={formData.deaths}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="text"
          name="region"
          placeholder="Region"
          value={formData.region}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = buttonStyle.backgroundColor)
          }
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Data"}
        </button>
      </form>
    </div>
  );
};

export default AddDengueData;
