import React, { useEffect, useState } from 'react';
import usePeopleStore from '../store/peopleStore';
import DataTable from './datatable/table';
import { FaSpinner } from 'react-icons/fa';

const PeopleDataView = () => {
  const { 
    people, 
    loading, 
    error, 
    totalCount,
    currentPage,
    pageSize,
    activeFilters,
    activeSorts,
    fetchAllPeople, 
    loadPeopleData,
    setPage,
    setPageSize,
    applyFilters,
    applySorts,
    clearFilters,
    clearSorts
  } = usePeopleStore();
  
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
      const fetchInitialData = async () => {
      await loadPeopleData();
      setIsInitialLoad(false);
    };
    
    fetchInitialData();
  }, [loadPeopleData]);
  
  useEffect(() => {
    console.log("People data updated in PeopleDataView:", people);
  }, [people]);
  

  const handlePageChange = (page) => {
    console.log("Changing to page:", page);
    setPage(page);
  };
  
 
  const handlePageSizeChange = (newPageSize) => {
    console.log("Changing page size to:", newPageSize);
    setPageSize(newPageSize);
  };

  const handleFilterChange = (filters) => {
    console.log("Applying filters:", filters);
    applyFilters(filters);
  };
  

  const handleSortChange = (sorts) => {
    console.log("Applying sorts:", sorts);
    applySorts(sorts);
  };
  

  const handleRefresh = () => {
    console.log("Refreshing data");
    loadPeopleData({
      page: currentPage,
      pageSize: pageSize,
      filters: activeFilters,
      sorts: activeSorts
    });
  };
  
  const columns = [
    { header: 'Username', accessor: 'UserName' },
    { header: 'First Name', accessor: 'FirstName' },
    { header: 'Last Name', accessor: 'LastName' },
    { header: 'Middle Name', accessor: 'MiddleName' },
    { header: 'Gender', accessor: 'Gender' },
    { header: 'Age', accessor: 'Age' }
  ];
  

  const renderEmptyState = (
    <tr>
      <td colSpan={columns.length} style={{ textAlign: 'center' }}>
        <div className="no-people-message">
          <p>No people data found. Try refreshing the data.</p>
        </div>
      </td>
    </tr>
  );
  
 
  const shouldRenderTable = people.length > 0 || (!loading && !isInitialLoad);
  
  return (
    <div id="peopleDataView" className="content">
      {!shouldRenderTable ? (
        <div className="loading-spinner-container">
          <FaSpinner className="loading-spinner" />
          <span>Loading people data...</span>
        </div>
      ) : (
        <DataTable 
          rawData={people}
          columns={columns}
          loading={loading}
          error={error}
          totalCount={totalCount}
          initialPage={currentPage}
          initialPageSize={pageSize}
          initialFilters={activeFilters}
          initialSorts={activeSorts}
          onRefresh={handleRefresh}
          onFetchAll={fetchAllPeople}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          renderEmptyState={renderEmptyState}
          showControls={true}
          showPagination={true}
          isLocalData={true}
          key={`people-table-${people.length}-${currentPage}-${pageSize}`} 
        />
      )}
    </div>
  );
};

export default PeopleDataView;
