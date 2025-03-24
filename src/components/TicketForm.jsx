import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';

const TicketForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: '',
    assignee: '',
    dueDate: '',
    attachment: null,
    acceptTerms: false
  });
  
  const [fileName, setFileName] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        attachment: file
      });
      setFileName(file.name);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ticket data submitted:', formData);
    
    alert('Ticket submitted successfully!');
  };
  
  return (
    <div className="content">
      <h2>Raise a Ticket</h2>
      <p className="form-intro">Please fill out the form below to submit a new support ticket.</p>
      
      <form className="ticket-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            className="form-control" 
            placeholder="Enter ticket title" 
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea 
            id="description" 
            name="description" 
            className="form-control" 
            placeholder="Describe your issue in detail" 
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority:</label>
          <select 
            id="priority" 
            name="priority" 
            className="form-control"
            value={formData.priority}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select 
            id="category" 
            name="category" 
            className="form-control"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing Question</option>
            <option value="feature">Feature Request</option>
            <option value="account">Account Management</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="assignee">Assign To:</label>
          <select 
            id="assignee" 
            name="assignee" 
            className="form-control"
            value={formData.assignee}
            onChange={handleInputChange}
          >
            <option value="">Auto-assign</option>
            <option value="support">Support Team</option>
            <option value="technical">Technical Team</option>
            <option value="billing">Billing Department</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">Due Date:</label>
          <input 
            type="date" 
            id="dueDate" 
            name="dueDate" 
            className="form-control"
            value={formData.dueDate}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label>Attachment:</label>
          <div className="file-upload">
            <input 
              type="file" 
              id="attachment" 
              name="attachment" 
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="attachment" className="file-upload-btn">
              <FaUpload className="control-icon" /> Choose File
            </label>
            {fileName && <span className="file-name">{fileName}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              id="acceptTerms" 
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="acceptTerms" className={`checkbox-custom ${formData.acceptTerms ? 'selected' : ''}`}></label>
            <span>I agree to the <a href="#" className="terms-link">terms and conditions</a></span>
          </div>
        </div>
        
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default TicketForm;
