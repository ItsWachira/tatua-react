import React, { useEffect, useState } from 'react';
import usePeopleStore from '../store/peopleStore';
import { FaSort, FaFilter, FaSync, FaDownload, FaSpinner } from 'react-icons/fa';
import FilterModal from './modals/FilterModal';
import SortModal from './modals/SortModal';

const PeopleDataView = () => {
  const { 
    people, 
    loading, 
    error, 
    currentPage, 
    pageSize, 
    totalCount, 
    activeFilters, 
    activeSorts,
    fetchAllPeople, 
    loadPeopleData, 
    navigatePage, 
    setPageSize,
    clearFilters,
    clearSorts
  } = usePeopleStore();
  
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [newPageSize, setNewPageSize] = useState(pageSize);
  const [sorts, setSorts] = useState(
    activeSorts && activeSorts.length > 0
      ? [...activeSorts] 
      : [{ field: '', direction: '' }]
  );
  
  useEffect(() => {
    loadPeopleData();
  }, []);
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const handleApplyPageSize = () => {
    if (newPageSize > 0) {
      setPageSize(newPageSize);
    }
  };
  
  return (
    <div id="peopleDataView" className="content">
      <div className="table-controls">
        <div className="control-wrapper">
          <div className={`active-indicator ${activeFilters.length === 0 ? 'hidden' : ''}`} id="peopleActiveFilterIndicator">
            <span className="indicator-text">{activeFilters.length}</span>
            <span className="indicator-label" onClick={() => setShowFilterModal(true)}>Active Filters</span>
            <button 
              className="clear-indicator"
              id="clearPeopleFilter"
              onClick={clearFilters}
            >
              ×
            </button>
          </div>
          <button 
            className="control-btn"
            id="peopleFilterBtn"
            onClick={() => setShowFilterModal(true)}
          >
            <FaFilter className="control-icon" />
            Filter
          </button>
        </div>
        
        <div className="control-wrapper">
          <div className={`active-indicator ${activeSorts.length === 0 ? 'hidden' : ''}`} id="peopleActiveSortIndicator">
            <span className="indicator-text">{activeSorts.length}</span>
            <span className="indicator-label" onClick={() => setShowSortModal(true)}>Active Sorts</span>
            <button 
              className="clear-indicator"
              id="clearPeopleSort"
              onClick={clearSorts}
            >
              ×
            </button>
          </div>
          <button 
            className="control-btn"
            id="peopleSortBtn"
            onClick={() => setShowSortModal(true)}
          >
            <FaSort className="control-icon" />
            Sort
          </button>
        </div>
        
        <button 
          className="control-btn"
          id="peopleRefreshBtn"
          onClick={loadPeopleData}
        >
          <FaSync className="control-icon" />
          Refresh
        </button>
      </div>
      
      <div className="table-container">
        {loading ? (
          <div className="loading-spinner-container">
            <FaSpinner className="loading-spinner" />
            <span>Loading data...</span>
          </div>
        ) : error ? (
          <div className="error-message">
            <span>Error: {error}</span>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Middle Name</th>
                <th>Gender</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody id="peopleBody">
              {people.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No people found</td>
                </tr>
              ) : (
                people.map((person, index) => (
                  <tr key={index}>
                    <td>{person.UserName || ''}</td>
                    <td>{person.FirstName || ''}</td>
                    <td>{person.LastName || ''}</td>
                    <td>{person.MiddleName || ''}</td>
                    <td>{person.Gender || ''}</td>
                    <td>{person.Age || ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="page-size-controls">
        <div className="page-size-input-group">
          <label htmlFor="pageSize">Records per page:</label>
          <input 
            type="number" 
            id="pageSize" 
            min="1" 
            max="100" 
            value={newPageSize} 
            onChange={(e) => setNewPageSize(parseInt(e.target.value))}
          />
          <button id="applyPageSize" className="page-size-btn" onClick={handleApplyPageSize}>
            Apply
          </button>
        </div>
        <button id="fetchAllBtn" className="fetch-all-btn" onClick={fetchAllPeople}>
          <FaDownload className="control-icon" />
          Fetch All People
        </button>
      </div>
      
      <div className="pagination-controls">
        <button 
          className="pagination-btn" 
          id="prevPage" 
          disabled={currentPage <= 1}
          onClick={() => navigatePage(-1)}
        >
          Previous
        </button>
        <div className="page-info" id="pageInfo">
          Page {currentPage} of {totalPages || 1} (Total: {totalCount} records)
        </div>
        <button 
          className="pagination-btn" 
          id="nextPage" 
          disabled={currentPage >= totalPages}
          onClick={() => navigatePage(1)}
        >
          Next
        </button>
      </div>
      
      {showFilterModal && (
        <FilterModal 
          activeFilters={activeFilters}
          onClose={() => setShowFilterModal(false)}
          onApply={(filters) => {
            usePeopleStore.getState().applyFilters(filters);
            setShowFilterModal(false);
          }}
        />
      )}
      
      {showSortModal && (
        <SortModal 
          activeSorts={activeSorts}
          onClose={() => setShowSortModal(false)}
          onApply={(sorts) => {
            usePeopleStore.getState().applySorts(sorts);
            setShowSortModal(false);
          }}
        />
      )}
    </div>
  );
};

export default PeopleDataView;
