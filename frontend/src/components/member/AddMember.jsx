import React, { useState } from 'react';
import { User, CheckCircle2, ArrowLeft } from 'lucide-react';
import './AddMember.css';

// Complete Indian States & Union Territories with Cities Map
export const stateCityMap = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajamahendravaram', 'Tirupati', 'Kakinada', 'Anantapur', 'Eluru'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Dumra', 'Katihar'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Durg'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Hamirpur', 'Bilaspur'],
  'Jharkhand': ['Jamshedpur', 'Ranchi', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Davanagere', 'Ballari', 'Kalaburagi', 'Tumakuru'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Pimpri-Chinchwad', 'Nashik', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Navi Mumbai', 'Solapur', 'Kolhapur'],
  'Manipur': ['Imphal', 'Churachandpur', 'Thoubal', 'Ukhrul'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokochung', 'Tuensang'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)', 'Pathankot'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Sikar'],
  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 'Vellore', 'Tirunelveli'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj (Allahabad)', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Greater Noida', 'Jhansi', 'Mathura'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh'],
  'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Kharagpur', 'Howrah'],
  'Andaman & Nicobar Islands': ['Port Blair'],
  'Chandigarh': ['Chandigarh'],
  'Dadra & Nagar Haveli & Daman & Diu': ['Daman', 'Diu', 'Silvassa'],
  'Delhi (NCT)': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'Gurugram', 'Noida', 'Ghaziabad'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur'],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Kavaratti'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
};

export default function AddMember({ onBack, onActionTrigger }) {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    state: '',
    city: '',
    pincode: '',
    country: 'India',
    address: '',
    accountStatus: 'Active',
    blockStatus: 'Not Blocked'
  });

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({
      ...formData,
      state: selectedState,
      city: '' // Reset city when state changes
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onActionTrigger) {
      onActionTrigger(`Gym Owner "${formData.fullName || 'New Owner'}" registered successfully!`);
    }
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="add-member-page">
      {/* Header */}
      <div className="add-member-header">
        <div className="add-member-title-group">
          <h1>Add New Gym Owner</h1>
          <p>All fields are optional - fill what you have</p>
        </div>

        <button className="btn-back-gyms" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Gym Owners</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Section 1: Personal Information */}
        <div className="form-card-section">
          <div className="section-title-wrapper">
            <User className="section-icon-orange" size={20} />
            <h3>Personal Information</h3>
          </div>

          <div className="form-grid-2col">
            {/* Full Name */}
            <div className="form-field-group">
              <label>
                Full Name <span className="required-star">*</span>
              </label>
              <input 
                type="text" 
                className="form-input-control" 
                placeholder="Enter gym owner name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Mobile Number */}
            <div className="form-field-group">
              <label>
                Mobile Number <span className="required-star">*</span>
              </label>
              <input 
                type="text" 
                className="form-input-control" 
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              />
            </div>

            {/* Email Address */}
            <div className="form-field-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-input-control" 
                placeholder="Enter email address"
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
              />
            </div>

            {/* State */}
            <div className="form-field-group">
              <label>
                State <span className="required-star">*</span>
              </label>
              <select 
                className="form-input-control" 
                value={formData.state}
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {Object.keys(stateCityMap).sort().map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="form-field-group">
              <label>
                City <span className="required-star">*</span>
              </label>
              <select 
                className="form-input-control" 
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!formData.state}
              >
                <option value="">
                  {formData.state ? 'Select City' : 'Select State First'}
                </option>
                {formData.state && stateCityMap[formData.state]?.sort().map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>

            {/* Pincode */}
            <div className="form-field-group">
              <label>
                Pincode <span className="required-star">*</span>
              </label>
              <input 
                type="text" 
                className="form-input-control" 
                placeholder="Enter 6-digit pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>

            {/* Country */}
            <div className="form-field-group">
              <label>Country</label>
              <input 
                type="text" 
                className="form-input-control read-only" 
                value={formData.country} 
                readOnly 
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-field-group">
            <label>
              Address <span className="required-star">*</span>
            </label>
            <textarea 
              className="form-textarea-control" 
              placeholder="Enter complete address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        {/* Section 2: Owner Status */}
        <div className="form-card-section">
          <div className="section-title-wrapper">
            <CheckCircle2 className="section-icon-orange" size={20} />
            <h3>Owner Status</h3>
          </div>

          <div className="form-grid-2col">
            {/* Account Status */}
            <div className="form-field-group">
              <label>Account Status</label>
              <select 
                className="form-input-control" 
                value={formData.accountStatus}
                onChange={(e) => setFormData({ ...formData, accountStatus: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Block Status */}
            <div className="form-field-group">
              <label>Block Status</label>
              <select 
                className="form-input-control" 
                value={formData.blockStatus}
                onChange={(e) => setFormData({ ...formData, blockStatus: e.target.value })}
              >
                <option value="Not Blocked">Not Blocked</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="add-member-footer-actions">
          <button type="button" className="btn-cancel-action" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="btn-submit-owner">
            Add Gym Owner
          </button>
        </div>
      </form>
    </div>
  );
}
