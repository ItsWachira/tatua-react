import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const FilterModal = ({ activeFilters, onClose, onApply }) => {
  const [filters, setFilters] = useState(
    activeFilters && activeFilters.length > 0 
      ? [...activeFilters] 
      : [{ field: '', operator: '', value: '' }]
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
          <h3 className="modal-title">Sort People Data</h3>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div id="peopleSortContainer">
            {filters.map((filter, index) => (
              <div className="filter-row" key={index}>
                <div className="filter-col">
                  <label>Field</label>
                  <select 
                    className="filter-field form-control" 
                    value={filter.field}
                    onChange={(e) => updateFilter(index, 'field', e.target.value)}
                  >
                    <option value="">Select Field</option>
                    <option value="UserName">Username</option>
                    <option value="FirstName">First Name</option>
                    <option value="LastName">Last Name</option>
                    <option value="MiddleName">Middle Name</option>
                    <option value="Gender">Gender</option>
                    <option value="Age">Age</option>
                  </select>
                </div>
                
                <div className="filter-col">
                  <label>Operator</label>
                  <select 
                    className="filter-operator form-control"
                    value={filter.operator}
                    onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                  >
                    <option value="">Select Operator</option>
                    <option value="eq">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="startswith">Starts With</option>
                    <option value="endswith">Ends With</option>
                    <option value="gt">Greater Than</option>
                    <option value="lt">Less Than</option>
                  </select>
                </div>
                
                <div className="filter-col">
                  <label>Value</label>
                  <input 
                    type="text" 
                    className="filter-value form-control"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, 'value', e.target.value)}
                  />
                </div>
                
                {filters.length > 1 && (
                  <button 
                    className="remove-filter-btn"
                    onClick={() => removeFilterRow(index)}
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
              Apply Sorts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
