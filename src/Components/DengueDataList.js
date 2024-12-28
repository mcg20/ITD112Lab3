import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import './DengueDataList.css'; // Import the CSS file

const ITEMS_PER_PAGE = 20;

const DengueDataList = () => {
  const [diseaseData, setDiseaseData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    loc: "",
    cases: "",
    deaths: "",
    date: "",
    region: "",
  });

  // State for filters
  const [regionFilter, setRegionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const diseaseCollection = collection(db, "dengueData"); // Update the collection to "dengueData"
      const diseaseSnapshot = await getDocs(diseaseCollection);
      const dataList = diseaseSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setDiseaseData(dataList);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const diseaseDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(diseaseDocRef);
      setDiseaseData(diseaseData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      loc: data.loc || "",
      cases: data.cases || "",
      deaths: data.deaths || "",
      date: data.date || "",
      region: data.region || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const diseaseDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(diseaseDocRef, {
        loc: editForm.loc,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        region: editForm.region,
      });
      setDiseaseData(diseaseData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Filter data based on region and date
  const filteredData = diseaseData.filter((data) => {
    return (
      (regionFilter === "" || data.region.toLowerCase().includes(regionFilter.toLowerCase())) &&
      (dateFilter === "" || data.date.includes(dateFilter))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="disease-data-container">
      <h2 className="disease-data-title">Dengue Data List</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by Region"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Filter by Date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      <table className="disease-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Cases</th>
            <th>Deaths</th>
            <th>Date</th>
            <th>Region</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((data) => (
            <React.Fragment key={data.id}>
              <tr>
                <td>{data.loc}</td>
                <td>{data.cases}</td>
                <td>{data.deaths}</td>
                <td>{data.date}</td>
                <td>{data.region}</td>
                <td>
                  <button onClick={() => handleEdit(data)} className="blue-button">Edit</button>
                  <button onClick={() => handleDelete(data.id)} className="blue-button delete">Delete</button>
                </td>
              </tr>
              {editingId === data.id && (
                <tr>
                  <td colSpan="6">
                    <form onSubmit={handleUpdate} className="edit-form">
                      <input
                        type="text"
                        placeholder="Location"
                        value={editForm.loc}
                        onChange={(e) => setEditForm({ ...editForm, loc: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Cases"
                        value={editForm.cases}
                        onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Deaths"
                        value={editForm.deaths}
                        onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Region"
                        value={editForm.region}
                        onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                        required
                      />
                      <button type="submit" className="blue-button">Update Data</button>
                      <button type="button" onClick={() => setEditingId(null)} className="blue-button cancel">Cancel</button>
                    </form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePageChange("prev")}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange("next")}>Next</button>
      </div>
    </div>
  );
};

export default DengueDataList;
