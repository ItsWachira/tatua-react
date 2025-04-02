import React, { useEffect, useState } from "react";
import DataTable from "./datatable/table";
import {
  FaTrash,
  FaEye,
  FaEnvelope,
  FaPhone,
  FaDownload,
  FaSpinner
} from "react-icons/fa";
import "../styles/tickets.css";

const TicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeFilters, setActiveFilters] = useState([]);
  const [activeSorts, setActiveSorts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    console.log("TicketsList component mounted");
    loadTickets();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    console.log("Tickets data updated in TicketsList:", tickets);
    if (tickets.length > 0 || !loading) {
      setDataReady(true);
      applyFiltersAndSorts();
    }
  }, [tickets, loading, activeFilters, activeSorts, currentPage, pageSize]);

  const handleStorageChange = (e) => {
    console.log("Storage event detected", e);
    loadTickets();
  };

  const loadTickets = () => {
    setLoading(true);
    try {
      console.log("Loading tickets from localStorage");

     
      const ticketsJson = localStorage.getItem("tickets");

      if (!ticketsJson) {
        console.log("No tickets found in localStorage");
        setTickets([]);
        setFilteredTickets([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      const allTickets = JSON.parse(ticketsJson);
      console.log("Parsed tickets:", allTickets);

      if (!Array.isArray(allTickets)) {
        console.error("Tickets data is not an array:", allTickets);
        setTickets([]);
        setFilteredTickets([]);
        setTotalCount(0);
        setError("Invalid tickets data format");
        setLoading(false);
        return;
      }

      setTickets(allTickets);
      setTotalCount(allTickets.length);
      setError(null);
    } catch (err) {
      console.error("Error loading tickets:", err);
      setError(`Failed to load tickets: ${err.message}`);
      setTickets([]);
      setFilteredTickets([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

 
  const applyFiltersAndSorts = () => {
    let processedData = [...tickets];
    
   
    if (activeFilters.length > 0) {
      processedData = processedData.filter(ticket => {
        return activeFilters.every(filter => {
          const { field, operator, value } = filter;
          
          
          if (!(field in ticket)) {
            console.warn(`Field ${field} not found in ticket:`, ticket);
            return true; 
          }
          
          const ticketValue = String(ticket[field]).toLowerCase();
          const filterValue = String(value).toLowerCase();
          
          switch (operator) {
            case 'eq':
              return ticketValue === filterValue;
            case 'contains':
              return ticketValue.includes(filterValue);
            case 'startswith':
              return ticketValue.startsWith(filterValue);
            case 'endswith':
              return ticketValue.endsWith(filterValue);
            case 'gt':
              return ticket[field] > value;
            case 'lt':
              return ticket[field] < value;
            default:
              return true;
          }
        });
      });
    }
    
   
    if (activeSorts.length > 0) {
      processedData.sort((a, b) => {
        for (const sort of activeSorts) {
          const { field, direction } = sort;
          
         
          if (!(field in a) || !(field in b)) {
            console.warn(`Sort field ${field} not found in one of the tickets`);
            continue; 
          }
          
         
          if (field === 'dateCreated') {
            const dateA = new Date(a[field]);
            const dateB = new Date(b[field]);
            
            if (dateA < dateB) return direction === 'asc' ? -1 : 1;
            if (dateA > dateB) return direction === 'asc' ? 1 : -1;
          } else {
           
            const valueA = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
            const valueB = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];
            
            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    }
    
    setTotalCount(processedData.length);
    

    const start = (currentPage - 1) * pageSize;
    const paginatedData = processedData.slice(start, start + pageSize);
    
    setFilteredTickets(paginatedData);
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); 
  };
  
 
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1); 
  };
  
  const handleSortChange = (sorts) => {
    setActiveSorts(sorts);
  };
  

  const handleFetchAll = () => {
    setPageSize(tickets.length);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    try {
      const existingTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      const updatedTickets = existingTickets.filter(
        (ticket) => ticket.id !== id
      );

      localStorage.setItem("tickets", JSON.stringify(updatedTickets));

      setTickets(updatedTickets);

      window.dispatchEvent(new Event("storage"));

      alert(`Ticket #${id} has been deleted successfully.`);
    } catch (err) {
      console.error("Error deleting ticket:", err);
      alert(`Failed to delete ticket: ${err.message}`);
    }
  };

  const handleView = (id) => {
    const ticket = tickets.find((t) => t.id === id);
    if (ticket) {
      alert(`
        Ticket Details:
        ID: ${ticket.id}
        Raised by: ${ticket.raisedBy || "N/A"}
        Subject: ${ticket.subject || "N/A"}
        Details: ${ticket.ticketDetails || "N/A"}
        Date Created: ${new Date(ticket.dateCreated).toLocaleString()}
        Status: ${ticket.status || "Open"}
        Contact: ${ticket.email || ""} ${
        ticket.phone ? `/ ${ticket.phone}` : ""
      }
        Preferred Contact: ${ticket.preferredContact || "Email"}
      `);
    } else {
      alert(`Ticket #${id} not found.`);
    }
  };

  const handleEmail = (id) => {
    const ticket = tickets.find((t) => t.id === id);
    if (ticket && ticket.email) {
      window.open(`mailto:${ticket.email}?subject=Regarding Ticket #${id}`);
    } else {
      alert(`No email address found for ticket #${id}.`);
    }
  };

  const handleCall = (id) => {
    const ticket = tickets.find((t) => t.id === id);
    if (ticket && ticket.phone) {
      window.open(`tel:${ticket.phone}`);
    } else {
      alert(`No phone number found for ticket #${id}.`);
    }
  };

  const handleDownload = (id) => {
    const ticket = tickets.find((t) => t.id === id);
    if (ticket) {
      const ticketData = `
Ticket #${ticket.id}
Raised by: ${ticket.raisedBy || "N/A"}
Subject: ${ticket.subject || "N/A"}
Details: ${ticket.ticketDetails || "N/A"}
Date Created: ${new Date(ticket.dateCreated).toLocaleString()}
Status: ${ticket.status || "Open"}
Contact: ${ticket.email || ""} ${ticket.phone ? `/ ${ticket.phone}` : ""}
Preferred Contact: ${ticket.preferredContact || "Email"}
      `;

      const blob = new Blob([ticketData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${ticket.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert(`Ticket #${id} not found.`);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString || "N/A";
    }
  };

  const columns = [
    { header: "Ticket ID", accessor: "id" },
    { header: "Raised by", accessor: "raisedBy" },
    { header: "Ticket Details", accessor: "ticketDetails" },
    {
      header: "Date Created",
      accessor: "dateCreated",
      render: (ticket) => formatDate(ticket.dateCreated),
    },
    {
      header: "Actions",
      accessor: "id",
      render: (ticket) => (
        <div className="ticket-actions">
          <FaEye
            className="action-icon view-icon"
            onClick={() => handleView(ticket.id)}
            title="View Details"
          />
          <FaEnvelope
            className="action-icon email-icon"
            onClick={() => handleEmail(ticket.id)}
            title="Send Email"
          />
          <FaPhone
            className="action-icon call-icon"
            onClick={() => handleCall(ticket.id)}
            title="Call"
          />
          <FaDownload
            className="action-icon download-icon"
            onClick={() => handleDownload(ticket.id)}
            title="Download"
          />
          <FaTrash
            className="action-icon delete-icon"
            onClick={() => handleDelete(ticket.id)}
            title="Delete"
          />
        </div>
      ),
    },
  ];

  const renderEmptyState = (
    <tr>
      <td colSpan={columns.length} style={{ textAlign: "center" }}>
        <div className="no-tickets-message">
          <p>
            No tickets found. Please create a ticket using the "Raise Ticket"
            form.
          </p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="content">
      {!dataReady ? (
        <div className="loading-spinner-container">
          <FaSpinner className="loading-spinner" />
          <span>Loading tickets data...</span>
        </div>
      ) : (
        <DataTable
          rawData={filteredTickets}
          columns={columns}
          loading={loading}
          error={error}
          totalCount={totalCount}
          initialPage={currentPage}
          initialPageSize={pageSize}
          initialFilters={activeFilters}
          initialSorts={activeSorts}
          onRefresh={loadTickets}
          onFetchAll={handleFetchAll}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          renderEmptyState={renderEmptyState}
          showControls={true}
          showPagination={true}
          isLocalData={true}
          key={`tickets-table-${filteredTickets.length}-${currentPage}-${pageSize}`}
        />
      )}
    </div>
  );
};

export default TicketsList;
