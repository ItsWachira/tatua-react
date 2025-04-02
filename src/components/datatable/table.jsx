import React, { useState, useEffect, useCallback, useRef} from 'react';
import { FaSort, FaFilter, FaSync, FaDownload, FaSpinner } from 'react-icons/fa';
import FilterModal from '../modals/FilterModal';
import SortModal from '../modals/SortModal';

const DataTable = ({
  
  // dataSource = null,
  rawData = [], 
  columns = [],
  
 
  initialPage = 1,
  initialPageSize = 10,
  initialFilters = [],
  initialSorts = [],
  

  loading = false,
  error = null,
  

  onRefresh = null,
  onFetchAll = null,
  onPageChange = null,
  onPageSizeChange = null,
  onFilterChange = null,
  onSortChange = null,
  

  renderEmptyState = null,
  renderCustomRow = null,
  

  showControls = true,
  showPagination = true,
  isLocalData = false,
  

  totalCount = 0
}) => {
 
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [newPageSize, setNewPageSize] = useState(initialPageSize);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [activeSorts, setActiveSorts] = useState(initialSorts);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [localTotalCount, setLocalTotalCount] = useState(0);
  

  useEffect(() => {
    if (isLocalData) {
      processLocalData();
    } else {
      setData(rawData);
      setLocalTotalCount(totalCount || rawData.length);
    }
  }, [rawData, isLocalData, totalCount]);
  

  const processLocalData = () => {
    console.log("Processing local data:", rawData);
    
  
    if (!Array.isArray(rawData) || rawData.length === 0) {
      console.log("Raw data is empty or not an array");
      setData([]);
      setLocalTotalCount(0);
      return;
    }
    
  
    let processedData = [...rawData];
    
    if (activeFilters.length > 0) {
      processedData = rawData.filter(item => {
        return activeFilters.every(filter => {
          const { field, operator, value } = filter;
          
     
          if (!(field in item)) {
            console.warn(`Field ${field} not found in item:`, item);
            return true; 
          }
          
          switch (operator) {
            case 'eq':
              return item[field] === value;
            case 'contains':
              return String(item[field]).toLowerCase().includes(String(value).toLowerCase());
            case 'startswith':
              return String(item[field]).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endswith':
              return String(item[field]).toLowerCase().endsWith(String(value).toLowerCase());
            case 'gt':
              return item[field] > value;
            case 'lt':
              return item[field] < value;
            default:
              return true;
          }
        });
      });
    }
    

    setLocalTotalCount(processedData.length);
    
 
    if (activeSorts.length > 0) {
      processedData.sort((a, b) => {
        for (const sort of activeSorts) {
          const { field, direction } = sort;
          
       
          if (!(field in a) || !(field in b)) {
            console.warn(`Sort field ${field} not found in one of the items`);
            continue; 
          }
          
          if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
  
    const start = (currentPage - 1) * pageSize;
    const paginatedData = processedData.slice(start, start + pageSize);
    
    console.log("Processed data:", paginatedData);
    setData(paginatedData);
  };
  
  
  const handlePageChange = (direction) => {
    const newPage = currentPage + direction;
    if (newPage < 1) return;
    
    setCurrentPage(newPage);
    
    if (onPageChange) {
      onPageChange(newPage);
    } else if (!isLocalData) {
      console.warn("No pageChange callback provided for remote data");
    } else {
      processLocalData();
    }
  };
  

  const handleApplyPageSize = () => {
    if (newPageSize <= 0) return;
    
    setPageSize(newPageSize);
    setCurrentPage(1); 
    
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    } else if (!isLocalData) {
     
      console.warn("No onPageSizeChange callback provided for remote data");
    } else {
      processLocalData();
    }
  };
  

  const handleFilterApply = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1); 
    
    if (onFilterChange) {
      onFilterChange(filters);
    } else if (!isLocalData) {
      console.warn("No onFilterChange callback provided for remote data");
    } else {
      processLocalData();
    }
  };
  
 
  const handleFilterClear = () => {
    setActiveFilters([]);
    setCurrentPage(1); 
    
    if (onFilterChange) {
      onFilterChange([]);
    } else if (!isLocalData) {
      console.warn("No onFilterChange callback provided for remote data");
    } else {
      processLocalData();
    }
  };
  

  const handleSortApply = (sorts) => {
    setActiveSorts(sorts);
    
    if (onSortChange) {
      onSortChange(sorts);
    } else if (!isLocalData) {
      console.warn("No onSortChange callback provided for remote data");
    } else {
      processLocalData();
    }
  };
  

  const handleSortClear = () => {
    setActiveSorts([]);
    
    if (onSortChange) {
      onSortChange([]);
    } else if (!isLocalData) {
      console.warn("No onSortChange callback provided for remote data");
    } else {
      processLocalData();
    }
  };
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else if (isLocalData) {
      processLocalData();
    } else {
      console.warn("No onRefresh callback provided for remote data");
    }
  };
  

  const handleFetchAll = async () => {
    if (onFetchAll) {
      console.log("Fetching all records...");
      await onFetchAll();
      setNewPageSize(effectiveTotalCount);
      setPageSize(effectiveTotalCount);
    } else {
      console.warn("No onFetchAll callback provided");
    }
  };
  
  const effectiveData = isLocalData ? data : rawData;
  const effectiveTotalCount = isLocalData ? localTotalCount : totalCount;
  const totalPages = Math.max(1, Math.ceil(effectiveTotalCount / pageSize));
  
  const defaultEmptyState = (
    <tr>
      <td colSpan={columns.length} style={{ textAlign: 'center' }}>No data found</td>
    </tr>
  );
  
  return (
    <div className="datatable-container">
      {showControls && (
        <div className="table-controls">
          <div className="control-wrapper">
            <div className={`active-indicator ${activeFilters.length === 0 ? 'hidden' : ''}`}>
              <span className="indicator-text">{activeFilters.length}</span>
              <span className="indicator-label" onClick={() => setShowFilterModal(true)}>Active Filters</span>
              <button 
                className="clear-indicator"
                onClick={handleFilterClear}
              >
                ×
              </button>
            </div>
            <button 
              className="control-btn"
              onClick={() => setShowFilterModal(true)}
            >
              <FaFilter className="control-icon" />
              Filter
            </button>
          </div>
          
          <div className="control-wrapper">
            <div className={`active-indicator ${activeSorts.length === 0 ? 'hidden' : ''}`}>
              <span className="indicator-text">{activeSorts.length}</span>
              <span className="indicator-label" onClick={() => setShowSortModal(true)}>Active Sorts</span>
              <button 
                className="clear-indicator"
                onClick={handleSortClear}
              >
                ×
              </button>
            </div>
            <button 
              className="control-btn"
              onClick={() => setShowSortModal(true)}
            >
              <FaSort className="control-icon" />
              Sort
            </button>
          </div>
          
          <button 
            className="control-btn"
            onClick={handleRefresh}
          >
            <FaSync className="control-icon" />
            Refresh
          </button>
        </div>
      )}
      
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
                {columns.map((column, index) => (
                  <th key={index}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {effectiveData.length === 0 ? (
                renderEmptyState || defaultEmptyState
              ) : (
                effectiveData.map((item, rowIndex) => {
                  if (renderCustomRow) {
                    return renderCustomRow(item, rowIndex);
                  }
                  
                  return (
                    <tr key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                          {column.render 
                            ? column.render(item) 
                            : item[column.accessor] || ''}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {showPagination && (
        <>
          <div className="page-size-controls">
            <div className="page-size-input-group">
              <label htmlFor="pageSize">Records per page:</label>
              <input 
                type="number" 
                id="pageSize" 
                min="1" 
                max="100" 
                value={newPageSize} 
                onChange={(e) => setNewPageSize(parseInt(e.target.value) || 10)}
              />
              <button className="page-size-btn" onClick={handleApplyPageSize}>
                Apply
              </button>
            </div>
            
            {onFetchAll && (
              <button className="fetch-all-btn" onClick={handleFetchAll}>
                <FaDownload className="control-icon" />
                Fetch All
              </button>
            )}
          </div>
          
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(-1)}
            >
              Previous
            </button>
            <div className="page-info">
              Page {currentPage} of {totalPages || 1} (Total: {effectiveTotalCount} records)
            </div>
            <button 
              className="pagination-btn" 
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(1)}
            >
              Next
            </button>
          </div>
        </>
      )}
      
      {showFilterModal && (
        <FilterModal 
          activeFilters={activeFilters}
          columns={columns}
          onClose={() => setShowFilterModal(false)}
          onApply={(filters) => {
            handleFilterApply(filters);
            setShowFilterModal(false);
          }}
        />
      )}
      
      {showSortModal && (
        <SortModal 
          activeSorts={activeSorts}
          columns={columns}
          onClose={() => setShowSortModal(false)}
          onApply={(sorts) => {
            handleSortApply(sorts);
            setShowSortModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DataTable;
