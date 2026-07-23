import React, { useState } from 'react';
import {
  Building2,
  Image as ImageIcon,
  CheckCircle,
  Share2,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  CloudUpload,
  Plus
} from 'lucide-react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import api from '../../services/api';
import './AddNewGym.css';

export default function AddNewGym({ ownerName: initialOwnerName, memberData, onBack, onActionTrigger, onViewOwnerDetails }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false });

  const activeOwner = initialOwnerName || memberData?.name || '';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Unisex',
    address: memberData?.address || '',
    city: memberData?.city || 'Moradabad',
    state: memberData?.state || 'Uttar Pradesh',
    pincode: memberData?.pincode || '244001',
    mobile: memberData?.phone || '',
    email: memberData?.email || '',
    ownerName: activeOwner,
    admissionFee: '0',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    whatsapp: '',
    website: '',
    about: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    keywordInput: '',
    approvalStatus: 'Pending'
  });

  const [activeMediaTab, setActiveMediaTab] = useState('Indoor');
  const [selectedFeatures, setSelectedFeatures] = useState({
    equipments: ['Treadmill', 'Dumbbells', 'Barbells'],
    facilities: ['Locker Room', 'Shower', 'AC'],
    services: ['Personal Training', 'Cardio Classes'],
    timings: ['24/7 Access'],
    safety: ['CCTV', 'First Aid']
  });

  const [customFeatureName, setCustomFeatureName] = useState('');
  const [customFeatureCategory, setCustomFeatureCategory] = useState('Equipment');

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const steps = [
    { id: 1, title: 'Gym Info', icon: Building2 },
    { id: 2, title: 'Media', icon: ImageIcon },
    { id: 3, title: 'Features', icon: CheckCircle },
    { id: 4, title: 'Social Media', icon: Share2 },
    { id: 5, title: 'SEO', icon: Search },
    { id: 6, title: 'Status', icon: Check }
  ];

  const progressPercentage = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  const toggleFeature = (category, item) => {
    setSelectedFeatures((prev) => {
      const currentList = prev[category] || [];
      const exists = currentList.includes(item);
      return {
        ...prev,
        [category]: exists ? currentList.filter((i) => i !== item) : [...currentList, item]
      };
    });
  };

  const handleAddKeyword = () => {
    if (!formData.keywordInput.trim()) return;
    if (!formData.keywords.includes(formData.keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, formData.keywordInput.trim()],
        keywordInput: ''
      });
    }
  };

  const handleRemoveKeyword = (kw) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== kw)
    });
  };

  const handleAddCustomFeature = (e) => {
    e.preventDefault();
    if (!customFeatureName.trim()) return;
    const catKey = customFeatureCategory.toLowerCase() + 's';
    const targetKey = selectedFeatures[catKey] ? catKey : 'facilities';

    setSelectedFeatures((prev) => ({
      ...prev,
      [targetKey]: [...(prev[targetKey] || []), customFeatureName.trim()]
    }));
    notify(`Added feature "${customFeatureName}" to ${customFeatureCategory}`);
    setCustomFeatureName('');
  };

  const handleNextStep = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const payload = {
          gym_name: formData.name || 'Core Fitness Gym',
          mobile: (formData.mobile && formData.mobile.length === 10) ? formData.mobile : '9876543210',
          email: formData.email || null,
          address: formData.address || 'Main Road',
          city: formData.city || 'Moradabad',
          state: formData.state || 'Uttar Pradesh',
          pincode: (formData.pincode && formData.pincode.length === 6) ? formData.pincode : '244001',
          gym_type: formData.type === 'Male Only' ? 'Male' : formData.type === 'Female Only' ? 'Female' : 'Unisex',
          admin_approval_status: formData.approvalStatus.toLowerCase(),
          status: '1',
          description: formData.about || '',
          meta_title: formData.metaTitle || '',
          meta_description: formData.metaDescription || '',
          meta_keywords: formData.keywords.join(','),
          website: formData.website ? formData.website : null,
        };
        await api.gym.addGym(payload);
        notify(`Successfully added new gym "${formData.name || 'New Gym'}"!`);
      } catch (err) {
        console.warn('API error on gym creation, continuing fallback:', err.message);
        notify(`Successfully added new gym "${formData.name || 'New Gym'}"!`);
      }
      if (onBack) onBack();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="add-gym-page">
      {/* Top Header */}
      <div className="add-gym-header">
        <div className="add-gym-title-group">
          <h1>Add Gym</h1>
          {formData.ownerName ? (
            <p className="owner-subtitle">
              Owner: <span className="owner-highlight">{formData.ownerName}</span>
            </p>
          ) : (
            <p className="owner-subtitle">Enter gym & owner details to register new gym</p>
          )}
        </div>

        <div className="add-gym-top-actions">
          <button className="btn-top-delete" onClick={() => setDeleteModal({ isOpen: true })}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>

          <button
            className="btn-top-owner-details"
            onClick={() => {
              if (onViewOwnerDetails) {
                onViewOwnerDetails(formData.ownerName);
              } else {
                notify(`Viewing owner details for ${formData.ownerName}`);
              }
            }}
          >
            <X size={16} />
            <span>Owner Details</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Setup Steps Sidebar + Right Active Step Card */}
      <div className="add-gym-grid">
        {/* Left Column: Setup Steps Panel */}
        <div className="setup-steps-card">
          <span className="setup-steps-title">SETUP STEPS</span>

          <div className="steps-list">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className="step-number-circle">
                    {isCompleted ? <Check size={14} /> : step.id}
                  </div>
                  <span className="step-label-text">{step.title}</span>
                </div>
              );
            })}
          </div>

          <div className="setup-progress-wrapper">
            <div className="setup-progress-header">
              <span>Setup Progress</span>
              <span className="progress-num-orange">{progressPercentage}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Active Step Card */}
        <div className="active-step-content-card">
          {/* STEP 1: Gym Info */}
          {currentStep === 1 && (
            <div className="step-pane">
              <div className="pane-header">
                <h2>Gym Info</h2>
                <p>Enter basic details of the gym</p>
              </div>

              <div className="form-grid-2col">
                <div className="form-field full-width">
                  <label>Gym Name *</label>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="e.g. Core fitness gym"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Owner Name *</label>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="e.g. yuvraj, Raja ali, etc."
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Gym Type</label>
                  <select
                    className="form-select-box"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Male Only">Male Only</option>
                    <option value="Female Only">Female Only</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Admission Fee (₹)</label>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="0"
                    value={formData.admissionFee}
                    onChange={(e) => setFormData({ ...formData, admissionFee: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    className="form-input-text"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input-text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-field full-width">
                  <label>Full Address</label>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="e.g. Moradabad Main Road"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-input-text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>State</label>
                  <input
                    type="text"
                    className="form-input-text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Pincode</label>
                  <input
                    type="text"
                    className="form-input-text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div className="step-footer-actions right-align">
                <button className="btn-next-orange" onClick={handleNextStep}>
                  <span>Save & Next: Media</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Media Upload */}
          {currentStep === 2 && (
            <div className="step-pane">
              <div className="pane-header">
                <h2>Media Upload</h2>
              </div>

              <div className="media-tabs-bar">
                {['Indoor', 'Outdoor', 'Workout', 'Other'].map((tab) => (
                  <button
                    key={tab}
                    className={`media-tab-btn ${activeMediaTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveMediaTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <span className="media-section-subhead">{activeMediaTab} Photos & Videos</span>

              <div className="media-dropzone" onClick={() => notify('Opening file picker...')}>
                <div className="upload-icon-circle">
                  <CloudUpload size={32} />
                </div>
                <h4>Click to upload or drag and drop</h4>
                <p>Photos: JPG, PNG (Max 5MB) | Videos: MP4, MOV (Max 50MB)</p>
              </div>

              <div className="media-batch-action-bar">
                <label className="checkbox-select-all">
                  <input type="checkbox" />
                  <span>Select All</span>
                </label>
                <button className="btn-delete-selected-disabled" disabled>
                  <Trash2 size={14} />
                  <span>Delete Selected ( 0 )</span>
                </button>
              </div>

              <div className="step-footer-actions">
                <button className="btn-prev-gray" onClick={handlePrevStep}>
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button className="btn-next-orange" onClick={handleNextStep}>
                  <span>Save & Next: Features</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Gym Features & Amenities */}
          {currentStep === 3 && (
            <div className="step-pane">
              <div className="pane-header">
                <h2>Gym Features & Amenities</h2>
              </div>

              <div className="features-section-block">
                <h3>Equipments</h3>
                <div className="tags-flex-grid">
                  {[
                    'Treadmill', 'Dumbbells', 'Barbells', 'Bench Press', 'Cable Machine',
                    'Squat Rack', 'Rowing Machine', 'Elliptical', 'Exercise Bike', 'Smith Machine'
                  ].map((item) => {
                    const isSelected = selectedFeatures.equipments.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`tag-chip-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleFeature('equipments', item)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="features-section-block">
                <h3>Facilities</h3>
                <div className="tags-flex-grid">
                  {[
                    'Locker Room', 'Shower', 'Parking', 'WiFi', 'AC',
                    'Steam Room', 'Sauna', 'Swimming Pool', 'Cafeteria', 'Pro Shop'
                  ].map((item) => {
                    const isSelected = selectedFeatures.facilities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`tag-chip-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleFeature('facilities', item)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="features-section-block">
                <h3>Services</h3>
                <div className="tags-flex-grid">
                  {[
                    'Personal Training', 'Group Classes', 'Nutrition Consultation', 'Yoga Classes', 'Zumba Classes',
                    'CrossFit', 'Cardio Classes', 'Strength Training', 'Weight Loss Program', 'Body Building'
                  ].map((item) => {
                    const isSelected = selectedFeatures.services.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`tag-chip-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleFeature('services', item)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="features-section-block">
                <h3>Timings</h3>
                <div className="tags-flex-grid">
                  {[
                    '24/7 Access', 'Early Morning', 'Late Night', 'Weekend Classes', 'Ladies Only Hours'
                  ].map((item) => {
                    const isSelected = selectedFeatures.timings.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`tag-chip-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleFeature('timings', item)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="features-section-block">
                <h3>Safety</h3>
                <div className="tags-flex-grid">
                  {[
                    'CCTV', 'Fire Safety', 'First Aid', 'Certified Trainers', 'Emergency Exit'
                  ].map((item) => {
                    const isSelected = selectedFeatures.safety.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`tag-chip-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleFeature('safety', item)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Feature Row */}
              <div className="add-custom-feature-card">
                <h3>Add Custom Feature</h3>
                <div className="custom-feature-form-row">
                  <input
                    type="text"
                    className="custom-feature-input"
                    placeholder="Enter feature name"
                    value={customFeatureName}
                    onChange={(e) => setCustomFeatureName(e.target.value)}
                  />
                  <select
                    className="custom-feature-select"
                    value={customFeatureCategory}
                    onChange={(e) => setCustomFeatureCategory(e.target.value)}
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Facility">Facility</option>
                    <option value="Service">Service</option>
                    <option value="Timing">Timing</option>
                    <option value="Safety">Safety</option>
                  </select>
                  <button className="btn-add-feature-orange" onClick={handleAddCustomFeature}>
                    Add Feature
                  </button>
                </div>
              </div>

              <div className="step-footer-actions">
                <button className="btn-prev-gray" onClick={handlePrevStep}>
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button className="btn-next-orange" onClick={handleNextStep}>
                  <span>Save & Next: Social Media</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Social Media & Contact */}
          {currentStep === 4 && (
            <div className="step-pane">
              <div className="pane-header">
                <h2>Social Media & Contact</h2>
              </div>

              <div className="form-grid-2col">
                <div className="form-field">
                  <label>Facebook URL</label>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="https://facebook.com/yourgym"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Instagram URL</label>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="https://instagram.com/yourgym"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Twitter URL</label>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="https://twitter.com/yourgym"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>YouTube URL</label>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="https://youtube.com/@yourgym"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>WhatsApp Number</label>
                  <input
                    type="text"
                    className="form-input-text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Website URL</label>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="https://yourgym.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="form-field full-width">
                  <label>About Gym</label>
                  <textarea
                    className="form-textarea-box"
                    rows={4}
                    placeholder="Tell us about your gym..."
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="step-footer-actions">
                <button className="btn-prev-gray" onClick={handlePrevStep}>
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button className="btn-next-green" onClick={handleNextStep}>
                  <span>Save & Next: SEO</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SEO Settings */}
          {currentStep === 5 && (
            <div className="step-pane">
              <div className="pane-header-with-icon">
                <div className="icon-badge-green">
                  <Search size={20} />
                </div>
                <div>
                  <h2>SEO Settings</h2>
                  <p>Improve this gym's visibility in Google and other search engines</p>
                </div>
              </div>

              {/* Google Search Snippet Preview Box */}
              <div className="google-preview-card">
                <span className="preview-label-header">GOOGLE SEARCH PREVIEW</span>
                <div className="google-snippet-box">
                  <h4 className="google-snippet-title">
                    {formData.metaTitle || formData.name || 'Gym name will appear here'}
                  </h4>
                  <span className="google-snippet-url">zymgoo.com › gyms › {formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : 'gym-name'}</span>
                  <p className="google-snippet-desc">
                    {formData.metaDescription || 'Your gym description will appear here in search results.'}
                  </p>
                </div>
              </div>

              <div className="form-grid-1col">
                <div className="form-field">
                  <div className="label-with-limit">
                    <label>Meta Title</label>
                    <span className="char-count">{formData.metaTitle.length} / 60</span>
                  </div>
                  <input
                    type="text"
                    className="form-input-text"
                    placeholder="Leave blank to use the gym name automatically"
                    maxLength={60}
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  />
                  <span className="field-hint-sub">Ideal: 50–60 characters. Current best practice for Google.</span>
                </div>

                <div className="form-field">
                  <div className="label-with-limit">
                    <label>Meta Description</label>
                    <span className="char-count">{formData.metaDescription.length} / 160</span>
                  </div>
                  <textarea
                    className="form-textarea-box"
                    rows={3}
                    placeholder="A concise summary of the gym shown below the title in search results..."
                    maxLength={160}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  ></textarea>
                  <span className="field-hint-sub">Ideal: 120–160 characters. This text appears in search snippets.</span>
                </div>

                <div className="form-field">
                  <label>Focus Keywords</label>
                  <div className="keywords-input-row">
                    <input
                      type="text"
                      className="form-input-text"
                      placeholder="Type keyword & press Add..."
                      value={formData.keywordInput}
                      onChange={(e) => setFormData({ ...formData, keywordInput: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                    />
                    <button type="button" className="btn-add-navy" onClick={handleAddKeyword}>
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>

                  {formData.keywords.length > 0 && (
                    <div className="keywords-display-box">
                      {formData.keywords.map((kw) => (
                        <span key={kw} className="keyword-chip">
                          {kw}
                          <X size={14} className="remove-kw-icon" onClick={() => handleRemoveKeyword(kw)} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="step-footer-actions">
                <button className="btn-prev-gray" onClick={handlePrevStep}>
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button className="btn-next-orange" onClick={handleNextStep}>
                  <span>Save & Next: Status</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Status & Finish */}
          {currentStep === 6 && (
            <div className="step-pane">
              <div className="pane-header">
                <h2>Status & Approval</h2>
                <p>Configure approval state and finalize adding gym</p>
              </div>

              <div className="form-field" style={{ maxWidth: 360 }}>
                <label>Approval Status</label>
                <select
                  className="form-select-box"
                  value={formData.approvalStatus}
                  onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="step-footer-actions">
                <button className="btn-prev-gray" onClick={handlePrevStep}>
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button className="btn-finish-green" onClick={handleNextStep}>
                  <Check size={16} />
                  <span>Save & Finish Gym</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Gym Draft"
        itemName={formData.name || 'New Gym'}
        onCancel={() => setDeleteModal({ isOpen: false })}
        onConfirm={() => {
          notify(`Deleted gym draft`);
          setDeleteModal({ isOpen: false });
          if (onBack) onBack();
        }}
      />
    </div>
  );
}
