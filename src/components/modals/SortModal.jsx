import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const SortModal = ({ activeSorts, onClose, onApply }) => {
  const [sorts, setSorts] = useState(
    activeSorts && activeSorts.length > 0
      ? [...activeSorts] 
      : [{ field: '', direction: '' }]
  );
  
  const addSortRow = () => {
    setSorts([...sorts, { field: '', direction: '' }]);
  };
  
  const removeSortRow = (index) => {
    if (sorts.length > 1) {
      const newSorts = [...sorts];
      newSorts.splice(index, 1);
      setSorts(newSorts);
    }
  };
  
  const updateSort = (index, field, value) => {
    const newSorts = [...sorts];
    newSorts[index] = { ...newSorts[index], [field]: value };
    setSorts(newSorts);
  };
  
  const resetSorts = () => {
    setSorts([{ field: '', direction: '' }]);
  };
  
  const applySorts = () => {
    const validSorts = sorts.filter(
      sort => sort.field && sort.direction
    );
    onApply(validSorts);
  };
  
  return (
    <div className="modal-overlay" id="peopleSortModal">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Sort Table Data</h3>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div id="peopleSortContainer">
            {sorts.map((sort, index) => (
              <div className="sort-row" key={index}>
                <div className="sort-col">
                  <label>Column</label>
                  <select 
                    className="sort-field form-control" 
                    value={sort.field}
                    onChange={(e) => updateSort(index, 'field', e.target.value)}
                  >
                    <option value="">Select Column</option>
                    <option value="UserName">Username</option>
                    <option value="FirstName">First Name</option>
                    <option value="LastName">Last Name</option>
                    <option value="MiddleName">Middle Name</option>
                    <option value="Gender">Gender</option>
                    <option value="Age">Age</option>
                  </select>
                </div>
                
                <div className="sort-col">
                  <label>Condition</label>
                  <select 
                    className="sort-direction form-control"
                    value={sort.direction}
                    onChange={(e) => updateSort(index, 'direction', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                
                {sorts.length > 1 && (
                  <button 
                    className="remove-sort-btn"
                    onClick={() => removeSortRow(index)}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button 
            className="add-sort-btn" 
            id="addPeopleSortBtn"
            onClick={addSortRow}
          >
            <FaPlus className="control-icon" /> Add Sort
          </button>
        </div>
        
        <div className="modal-footer">
          <div className="modal-actions">
            <button 
              className="modal-btn reset-btn" 
              id="resetPeopleSortBtn"
              onClick={resetSorts}
            >
              Reset
            </button>
            <button 
              className="modal-btn confirm-btn" 
              id="applyPeopleSortBtn"
              onClick={applySorts}
            >
              Sort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortModal;
