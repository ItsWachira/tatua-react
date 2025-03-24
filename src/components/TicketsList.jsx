import React from 'react';

const TicketsList = () => {
  return (
    <div className="content">
      <h2>Tickets List</h2>
    
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No tickets found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsList;
