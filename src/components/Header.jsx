import React from 'react';
import { FaTicketAlt, FaList, FaUsers } from 'react-icons/fa';

const Header = ({ activeView, setActiveView }) => {
  return (
    <header>
      <div className="logo">
        <h1 className="title">Tatua Ticketing Demo</h1>
      </div>
      
      <nav>
        <button 
          className={`nav-btn ${activeView === 'peopleData' ? 'active' : ''}`}
          onClick={() => setActiveView('peopleData')}
        >
          <FaUsers className="control-icon" />
          People Data
        </button>
{/*         
        <button 
          className={`nav-btn ${activeView === 'raiseTicket' ? 'active' : ''}`}
          onClick={() => setActiveView('raiseTicket')}
        >
          <FaTicketAlt className="control-icon" />
          Raise Ticket
        </button>
        
        <button 
          className={`nav-btn ${activeView === 'ticketsList' ? 'active' : ''}`}
          onClick={() => setActiveView('ticketsList')}
        >
          <FaList className="control-icon" />
          Tickets List
        </button> */}
      </nav>
      
      {/* <div className="storage-selector">
        <label>Storage:</label>
        <select>
          <option value="local">Local Storage</option>
          <option value="session">Session Storage</option>
        </select>
      </div> */}
    </header>
  );
};

export default Header;
