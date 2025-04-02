import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';

const TicketForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    attachment: null,
    acceptTerms: false
  });
  
  const [fileName, setFileName] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
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
    
    try {
      // Get existing tickets
      const existingTickets = JSON.parse(localStorage.getItem('tickets')) || [];
      
      // Calculate next ID
      const nextId = existingTickets.length > 0 
        ? Math.max(...existingTickets.map(ticket => parseInt(ticket.id))) + 1 
        : 1;
      
      // Create new ticket object
      const newTicket = {
        id: nextId.toString(),
        raisedBy: formData.fullName,
        ticketDetails: formData.message,
        subject: formData.subject,
        email: formData.email,
        phone: formData.phone,
        preferredContact: formData.preferredContact,
        dateCreated: new Date().toISOString(),
        status: 'Open',
        attachmentName: fileName || null
      };

      // Add to existing tickets
      const updatedTickets = [...existingTickets, newTicket];
      
      // Save to localStorage
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      // Show success alert
      alert(`Ticket #${nextId} has been successfully submitted!`);
      
      // Also show the success message in the UI
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredContact: 'email',
        attachment: null,
        acceptTerms: false
      });
      setFileName('');
      
  
      setTimeout(() => setSubmitSuccess(false), 3000);
      
    
    } catch (error) {
      console.error("Error saving ticket:", error);
      alert(`Error saving ticket: ${error.message}`);
    }
  };
  
  return (
    <div className="content">
      <p className="form-intro">Please fill out the form below to submit a new support ticket.</p>
      
    
      <form className="ticket-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input 
            type="text" 
            id="fullName" 
            name="fullName" 
            className="form-control" 
            placeholder="Enter your full name" 
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="form-control" 
            placeholder="Enter your email address" 
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            className="form-control" 
            placeholder="Enter your phone number" 
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <select 
            id="subject" 
            name="subject" 
            className="form-control"
            value={formData.subject}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a subject</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Billing Question">Billing Question</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea 
            id="message" 
            name="message" 
            className="form-control" 
            placeholder="Describe your issue in detail" 
            value={formData.message}
            onChange={handleInputChange}
            required
            rows="5"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>Preferred Contact:</label>
          <div className="radio-group">
            <div className="radio-option">
              <input 
                type="radio" 
                id="contactEmail" 
                name="preferredContact" 
                value="email"
                checked={formData.preferredContact === 'email'}
                onChange={handleInputChange}
              />
              <label htmlFor="contactEmail">Email</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="contactPhone" 
                name="preferredContact" 
                value="phone"
                checked={formData.preferredContact === 'phone'}
                onChange={handleInputChange}
              />
              <label htmlFor="contactPhone">Phone</label>
            </div>
          </div>
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
            <span className="file-name">{fileName || 'No file chosen'}</span>
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
        
        <button type="submit" className="submit-btn">Submit Ticket</button>
      </form>
    </div>
  );
};

export default TicketForm;
