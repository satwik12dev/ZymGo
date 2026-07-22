import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import './AddBanner.css';

export default function AddBanner({ onBack, onActionTrigger }) {
  const [formData, setFormData] = useState({
    titleName: '',
    image: null,
    bannerType: '',
    state: '',
    city: '',
    targetType: '',
    ctaText: '',
    ctaType: '',
    ctaValue: '',
    startDate: '',
    endDate: '',
    priority: '',
    screenPosition: ''
  });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    notify(`Successfully added new advertise banner "${formData.titleName || 'New Banner'}"!`);
    if (onBack) onBack();
  };

  return (
    <div className="add-banner-page">
      {/* Header Bar */}
      <div className="add-banner-header-row">
        <div className="add-banner-title-group">
          <h1>Add New Advertise banner</h1>
          <p>All fields are optional - fill what you have</p>
        </div>

        <button 
          className="btn-all-banners-orange"
          onClick={onBack || (() => window.history.back())}
        >
          <ArrowLeft size={16} />
          <span>All Banner</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Card 1: Banner Information */}
        <div className="add-banner-card">
          <div className="card-title-header">
            <User size={18} />
            <span>Banner Information</span>
          </div>

          {/* Row 1: Title Name, Image, Banner Type */}
          <div className="banner-grid-3col">
            <div className="banner-form-group">
              <label>Title Name</label>
              <input 
                type="text" 
                className="banner-input-text" 
                placeholder="Enter Title name"
                value={formData.titleName}
                onChange={(e) => setFormData({ ...formData, titleName: e.target.value })}
              />
            </div>

            <div className="banner-form-group">
              <label>Image</label>
              <input 
                type="file" 
                className="banner-file-input-box" 
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              />
            </div>

            <div className="banner-form-group">
              <label>Banner Type</label>
              <select 
                className="banner-select-dropdown"
                value={formData.bannerType}
                onChange={(e) => setFormData({ ...formData, bannerType: e.target.value })}
              >
                <option value="">Select Target</option>
                <option value="Home Slider">Home Slider</option>
                <option value="Promo Banner">Promo Banner</option>
                <option value="Category Banner">Category Banner</option>
                <option value="Popup Modal">Popup Modal</option>
              </select>
            </div>
          </div>

          {/* Row 2: State, City, Target Type */}
          <div className="banner-grid-3col">
            <div className="banner-form-group">
              <label>State <span className="req">*</span></label>
              <select 
                className="banner-select-dropdown"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              >
                <option value="">Select State</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="Delhi">Delhi</option>
                <option value="Haryana">Haryana</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            <div className="banner-form-group">
              <label>City <span className="req">*</span></label>
              <select 
                className="banner-select-dropdown"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="">Select State First</option>
                <option value="Moradabad">Moradabad</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Dumra">Dumra</option>
                <option value="Ranchi">Ranchi</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>

            <div className="banner-form-group">
              <label>Target Type</label>
              <select 
                className="banner-select-dropdown"
                value={formData.targetType}
                onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
              >
                <option value="">Select Type</option>
                <option value="Gym Owner">Gym Owner</option>
                <option value="Member">Member</option>
                <option value="Guest">Guest</option>
                <option value="All Users">All Users</option>
              </select>
            </div>
          </div>

          {/* Row 3: CTA Text, CTA Type, CTA Value */}
          <div className="banner-grid-3col">
            <div className="banner-form-group">
              <label>CTA Text</label>
              <input 
                type="text" 
                className="banner-input-text" 
                placeholder="Enter CTA Text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              />
            </div>

            <div className="banner-form-group">
              <label>CTA Type</label>
              <select 
                className="banner-select-dropdown"
                value={formData.ctaType}
                onChange={(e) => setFormData({ ...formData, ctaType: e.target.value })}
              >
                <option value="">Select Priority</option>
                <option value="Open Link">Open Link</option>
                <option value="Navigate Page">Navigate Page</option>
                <option value="Call Phone">Call Phone</option>
                <option value="Open Modal">Open Modal</option>
              </select>
            </div>

            <div className="banner-form-group">
              <label>CTA Value</label>
              <input 
                type="text" 
                className="banner-input-text" 
                placeholder="Enter CTA Value"
                value={formData.ctaValue}
                onChange={(e) => setFormData({ ...formData, ctaValue: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Schedule & Placement */}
        <div className="add-banner-card">
          {/* Row 1: Start Date, End Date */}
          <div className="banner-grid-2col">
            <div className="banner-form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                className="banner-input-text" 
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="banner-form-group">
              <label>End Date</label>
              <input 
                type="date" 
                className="banner-input-text" 
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Row 2: Priority, Screen Position */}
          <div className="banner-grid-2col">
            <div className="banner-form-group">
              <label>Priority</label>
              <select 
                className="banner-select-dropdown"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="">Select Priority</option>
                <option value="High">High (1)</option>
                <option value="Medium">Medium (2)</option>
                <option value="Low">Low (3)</option>
              </select>
            </div>

            <div className="banner-form-group">
              <label>Screen Position</label>
              <select 
                className="banner-select-dropdown"
                value={formData.screenPosition}
                onChange={(e) => setFormData({ ...formData, screenPosition: e.target.value })}
              >
                <option value="">Select Position</option>
                <option value="Top Banner">Top Banner</option>
                <option value="Middle Feed">Middle Feed</option>
                <option value="Bottom Sticky">Bottom Sticky</option>
                <option value="Popup">Popup</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Action Footer Buttons */}
        <div className="banner-form-actions-footer">
          <button 
            type="button" 
            className="btn-banner-cancel"
            onClick={onBack || (() => window.history.back())}
          >
            Cancel
          </button>
          <button type="submit" className="btn-banner-submit-orange">
            Add Gym Owner
          </button>
        </div>
      </form>
    </div>
  );
}
