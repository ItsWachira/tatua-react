import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const FilterModal = ({ 
  activeFilters, 
  onClose, 
  onApply,
  // Add columns prop with default empty array
  columns = []
}) => {
  const [filters, setFilters] = useState(
    activeFilters && activeFilters.length > 0 
      ? [...activeFilters] 
      : [{ field: '', operator: '', value: '' }]
  );
  
  const addFilterRow = () => {
    setFilters([...filters, { field: '', operator: '', value: '' }]);
  };
  
  const removeFilterRow = (index) => {
    if (filters.length > 1) {
      const newFilters = [...filters];
      newFilters.splice(index, 1);
      setFilters(newFilters);
    }
  };
  
  const updateFilter = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };
  
  const resetFilters = () => {
    setFilters([{ field: '', operator: '', value: '' }]);
  };
  
  const applyFilters = () => {
    const validFilters = filters.filter(
      filter => filter.field && filter.operator && filter.value
    );
    onApply(validFilters);
  };
  
  return (
    <div className="modal-overlay" id="filterModal">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Filter Table Data</h3>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div id="filterContainer">
            {filters.map((filter, index) => (
              <div className="filter-row" key={index}>
                <div className="filter-col">
                  <label>Column</label>
                  <select 
                    className="filter-field form-control" 
                    value={filter.field}
                    onChange={(e) => updateFilter(index, 'field', e.target.value)}
                  >
                    <option value="">Select Column</option>
                    {/* Dynamically generate options based on columns prop */}
                    {columns.map((column) => (
                      <option key={column.accessor} value={column.accessor}>
                        {column.header}
                      </option>
                    ))}
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
            className="add-filter-btn" 
            id="addFilterBtn"
            onClick={addFilterRow}
          >
            <FaPlus className="control-icon" /> Add Filter
          </button>
        </div>
        
        <div className="modal-footer">
          <div className="modal-actions">
            <button 
              className="modal-btn reset-btn" 
              id="resetFilterBtn"
              onClick={resetFilters}
            >
              Reset
            </button>
            <button 
              className="modal-btn confirm-btn" 
              id="applyFilterBtn"
              onClick={applyFilters}
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
