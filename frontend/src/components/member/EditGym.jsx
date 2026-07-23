import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  Check, 
  Trash2, 
  X, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Plus, 
  Upload, 
  Globe, 
  Sparkles,
  Info,
  Sliders,
  Share2,
  Lock,
  Tag,
  CloudUpload
} from 'lucide-react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import './EditGym.css';

export default function EditGym({ gym, onBack, onActionTrigger, onViewOwnerDetails }) {
  const [currentStep, setCurrentStep] = useState(1); // Default to Step 1: Gym Info
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, title: '', itemName: '' });
  const [selectedGym, setSelectedGym] = useState(gym || {
    id: 1,
    name: 'Core fitness gym',
    ownerName: 'yuvraj',
    ownerPhone: '7505690374',
    type: 'Unisex',
    city: 'Moradabad',
    state: 'Uttar Pradesh',
    pincode: '244001',
    address: 'Moradabad Main Road',
    status: 'Active',
    approval: 'pending'
  });

  const [formData, setFormData] = useState({
    // Step 1: Gym Info
    name: gym?.name || 'Core fitness gym',
    type: gym?.type || 'Unisex',
    state: gym?.state || 'Uttar Pradesh',
    city: gym?.city || 'Moradabad',
    area: 'Adarsh Colony',
    pincode: '244001',
    latitude: '28.838220',
    longitude: '78.695559',
    website: 'https://',
    description: '',
    onboardingNotes: '',

    // Step 2: Media
    mediaTab: 'Indoor',
    uploadedMedia: [
      { id: 1, name: 'logo.jpg', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300' }
    ],
    selectedMediaIds: [],

    // Step 3: Features
    features: ['Locker Room', 'Shower', 'Parking', 'WiFi', 'AC', 'Personal Training', '24/7 Access', 'CCTV', 'Treadmill', 'Dumbbells'],
    customFeatureName: '',
    customFeatureCategory: 'Equipment',

    // Step 4: Social Media
    facebookUrl: 'https://facebook.com/yourgym',
    instagramUrl: 'https://instagram.com/yourgym',
    twitterUrl: 'https://twitter.com/yourgym',
    youtubeUrl: 'https://youtube.com/@yourgym',
    whatsappNumber: '918218832132',
    websiteUrl: 'https://yourgym.com',
    aboutGym: '',

    // Step 5: SEO
    metaTitle: '',
    metaDescription: '',
    focusKeywords: [],
    keywordInput: '',

    // Step 6: Status
    approvalStatus: gym?.approval || 'pending'
  });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const steps = [
    { id: 1, label: 'Gym Info', key: 'info' },
    { id: 2, label: 'Media', key: 'media' },
    { id: 3, label: 'Features', key: 'features' },
    { id: 4, label: 'Social Media', key: 'social' },
    { id: 5, label: 'SEO', key: 'seo' },
    { id: 6, label: 'Status', key: 'status' }
  ];

  const calculateProgress = () => {
    return Math.round((currentStep / steps.length) * 100);
  };

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      notify(`Gym "${formData.name}" updated successfully!`);
      if (onBack) onBack();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleFeature = (item) => {
    setFormData((prev) => {
      const exists = prev.features.includes(item);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== item)
          : [...prev.features, item]
      };
    });
  };

  const handleAddKeyword = () => {
    if (!formData.keywordInput.trim()) return;
    const newKw = formData.keywordInput.trim();
    if (!formData.focusKeywords.includes(newKw)) {
      setFormData((prev) => ({
        ...prev,
        focusKeywords: [...prev.focusKeywords, newKw],
        keywordInput: ''
      }));
    }
  };

  const handleRemoveKeyword = (kw) => {
    setFormData((prev) => ({
      ...prev,
      focusKeywords: prev.focusKeywords.filter((k) => k !== kw)
    }));
  };

  return (
    <div className="edit-gym-page">
      {/* Top Header */}
      <div className="edit-gym-header">
        <div className="edit-gym-title-group">
          <h1>Edit Gym</h1>
          <p className="owner-subtitle">Owner: <span className="owner-highlight">{selectedGym.ownerName}</span></p>
        </div>

        <div className="edit-gym-top-actions">
          <button className="btn-top-delete" onClick={() => setDeleteModal({ isOpen: true, title: 'Delete Gym', itemName: formData.name })}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>

          <button className="btn-top-owner-details" onClick={() => onViewOwnerDetails ? onViewOwnerDetails(selectedGym.ownerName || 'yuvraj') : notify(`Viewing owner details for ${selectedGym.ownerName}`)}>
            <X size={16} />
            <span>Owner Details</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Setup Steps Sidebar + Right Active Step Card */}
      <div className="edit-gym-grid">
        {/* Left Column: Setup Steps Panel */}
        <div className="setup-steps-card">
          <span className="setup-steps-title">SETUP STEPS</span>

          <div className="steps-list">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;

              return (
                <div
                  key={step.id}
                  className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className="step-number-circle">
                    {isCompleted ? (
                      <Check size={14} className="check-icon" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span className="step-label-text">{step.label}</span>
                </div>
              );
            })}
          </div>

          <div className="setup-progress-footer">
            <div className="progress-label-row">
              <span className="lbl">Setup Progress</span>
              <span className="val">{calculateProgress()}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${calculateProgress()}%` }}></div>
            </div>
          </div>
        </div>

        {/* Right Column: Step Content Card */}
        <div className="step-content-card">
          {/* STEP 1: Gym Info */}
          {currentStep === 1 && (
            <div className="step-pane">
              <div className="form-grid-2col">
                <div className="form-field-group">
                  <label>State *</label>
                  <select
                    className="form-select"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Assam">Assam</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>City</label>
                  <select
                    className="form-select"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option value="Moradabad">Moradabad</option>
                    <option value="Dumra">Dumra</option>
                    <option value="Guwahati">Guwahati</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Patna">Patna</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Area</label>
                  <select
                    className="form-select"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  >
                    <option value="Adarsh Colony">Adarsh Colony</option>
                    <option value="Civil Lines">Civil Lines</option>
                    <option value="Main Market">Main Market</option>
                    <option value="Gandhi Nagar">Gandhi Nagar</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Latitude (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Longitude (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Website (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Description</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="form-field-group full-width">
                  <label>Onboarding Notes (Optional)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Example: Field visit completed, owner interested in premium plan"
                    value={formData.onboardingNotes}
                    onChange={(e) => setFormData({ ...formData, onboardingNotes: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="step-footer-actions align-right">
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
              <h2 className="pane-main-heading">Media Upload</h2>

              {/* Sub Tabs */}
              <div className="media-subtabs-row">
                {['Indoor', 'Outdoor', 'Workout', 'Other'].map((tab) => (
                  <button
                    key={tab}
                    className={`media-tab-btn ${formData.mediaTab === tab ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, mediaTab: tab })}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <h4 className="media-section-subtitle">{formData.mediaTab} Photos & Videos</h4>

              {/* Upload Drop Zone */}
              <div className="media-dropzone" onClick={() => notify('Click to upload photos/videos')}>
                <CloudUpload size={36} className="cloud-icon" />
                <p className="drop-title">Click to upload or drag and drop</p>
                <p className="drop-subtext">Photos: JPG, PNG (Max 5MB) | Videos: MP4, MOV (Max 50MB)</p>
              </div>

              {/* Uploaded Items Grid */}
              <div className="uploaded-media-grid">
                {formData.uploadedMedia.map((media) => (
                  <div key={media.id} className="media-thumb-card">
                    <input
                      type="checkbox"
                      className="checkbox-custom media-chk"
                      checked={formData.selectedMediaIds.includes(media.id)}
                      onChange={() => {
                        const exists = formData.selectedMediaIds.includes(media.id);
                        setFormData({
                          ...formData,
                          selectedMediaIds: exists
                            ? formData.selectedMediaIds.filter((i) => i !== media.id)
                            : [...formData.selectedMediaIds, media.id]
                        });
                      }}
                    />
                    <img src={media.url} alt={media.name} className="media-img-preview" />
                    <button
                      className="btn-remove-media-red"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          uploadedMedia: formData.uploadedMedia.filter((m) => m.id !== media.id)
                        });
                        notify('Media item removed');
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Select All & Delete Bar */}
              <div className="media-batch-action-bar">
                <label className="select-all-label">
                  <input
                    type="checkbox"
                    className="checkbox-custom"
                    checked={formData.selectedMediaIds.length === formData.uploadedMedia.length && formData.uploadedMedia.length > 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        selectedMediaIds: e.target.checked ? formData.uploadedMedia.map((m) => m.id) : []
                      });
                    }}
                  />
                  <span>Select All</span>
                </label>

                <button
                  className="btn-delete-selected-disabled"
                  disabled={formData.selectedMediaIds.length === 0}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      uploadedMedia: formData.uploadedMedia.filter((m) => !formData.selectedMediaIds.includes(m.id)),
                      selectedMediaIds: []
                    });
                    notify('Deleted selected media items');
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete Selected ( {formData.selectedMediaIds.length} )</span>
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

          {/* STEP 3: Features & Amenities */}
          {currentStep === 3 && (
            <div className="step-pane">
              <h2 className="pane-main-heading">Gym Features & Amenities</h2>

              {/* Equipments Section */}
              <div className="features-group-section">
                <h3>Equipments</h3>
                <div className="tags-grid">
                  {['Treadmill', 'Dumbbells', 'Barbells', 'Bench Press', 'Cable Machine', 'Squat Rack', 'Rowing Machine', 'Elliptical', 'Exercise Bike', 'Smith Machine'].map((item) => (
                    <button
                      key={item}
                      className={`tag-btn ${formData.features.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleFeature(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facilities Section */}
              <div className="features-group-section">
                <h3>Facilities</h3>
                <div className="tags-grid">
                  {['Locker Room', 'Shower', 'Parking', 'WiFi', 'AC', 'Steam Room', 'Sauna', 'Swimming Pool', 'Cafeteria', 'Pro Shop'].map((item) => (
                    <button
                      key={item}
                      className={`tag-btn ${formData.features.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleFeature(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Section */}
              <div className="features-group-section">
                <h3>Services</h3>
                <div className="tags-grid">
                  {['Personal Training', 'Group Classes', 'Nutrition Consultation', 'Yoga Classes', 'Zumba Classes', 'CrossFit', 'Cardio Classes', 'Strength Training', 'Weight Loss Program', 'Body Building'].map((item) => (
                    <button
                      key={item}
                      className={`tag-btn ${formData.features.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleFeature(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timings Section */}
              <div className="features-group-section">
                <h3>Timings</h3>
                <div className="tags-grid">
                  {['24/7 Access', 'Early Morning', 'Late Night', 'Weekend Classes', 'Ladies Only Hours'].map((item) => (
                    <button
                      key={item}
                      className={`tag-btn ${formData.features.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleFeature(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety Section */}
              <div className="features-group-section">
                <h3>Safety</h3>
                <div className="tags-grid">
                  {['CCTV', 'Fire Safety', 'First Aid', 'Certified Trainers', 'Emergency Exit'].map((item) => (
                    <button
                      key={item}
                      className={`tag-btn ${formData.features.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleFeature(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Custom Feature */}
              <div className="custom-feature-box">
                <h4>Add Custom Feature</h4>
                <div className="custom-feature-inputs">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter feature name"
                    value={formData.customFeatureName}
                    onChange={(e) => setFormData({ ...formData, customFeatureName: e.target.value })}
                  />

                  <select
                    className="form-select"
                    value={formData.customFeatureCategory}
                    onChange={(e) => setFormData({ ...formData, customFeatureCategory: e.target.value })}
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Services">Services</option>
                    <option value="Safety">Safety</option>
                  </select>

                  <button className="btn-add-feature-orange" onClick={() => {
                    if (formData.customFeatureName.trim()) {
                      toggleFeature(formData.customFeatureName.trim());
                      setFormData({ ...formData, customFeatureName: '' });
                      notify(`Added custom feature "${formData.customFeatureName.trim()}"`);
                    }
                  }}>
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
              <h2 className="pane-main-heading">Social Media & Contact</h2>

              <div className="form-grid-2col">
                <div className="form-field-group">
                  <label>Facebook URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://facebook.com/yourgym"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Instagram URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://instagram.com/yourgym"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Twitter URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://twitter.com/yourgym"
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>YouTube URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://youtube.com/@yourgym"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>WhatsApp Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="918218832132"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Website URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://yourgym.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>About Gym</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Tell us about your gym..."
                    value={formData.aboutGym}
                    onChange={(e) => setFormData({ ...formData, aboutGym: e.target.value })}
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

          {/* STEP 5: SEO */}
          {currentStep === 5 && (
            <div className="step-pane">
              <div className="step-header-box">
                <div className="step-header-icon green-circle">
                  <Search size={18} />
                </div>
                <div>
                  <h2>SEO Settings</h2>
                  <p>Improve this gym's visibility in Google and other search engines</p>
                </div>
              </div>

              {/* Google Search Preview Card */}
              <div className="google-preview-card">
                <span className="preview-label-header">GOOGLE SEARCH PREVIEW</span>
                <div className="google-snippet-box">
                  <h4 className="snippet-title">{formData.metaTitle || formData.name}</h4>
                  <span className="snippet-url">zymgoo.com › gyms › {formData.name.toLowerCase().replace(/\s+/g, '-')}</span>
                  <p className="snippet-desc">
                    {formData.metaDescription || 'Your gym description will appear here in search results.'}
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="seo-form-inputs">
                <div className="form-field-group">
                  <div className="label-with-limit">
                    <label>Meta Title</label>
                    <span className="char-count">{formData.metaTitle.length} / 60</span>
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Leave blank to use the gym name automatically"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value.slice(0, 60) })}
                  />
                  <span className="field-subtext">Ideal: 50–60 characters. Current best practice for Google.</span>
                </div>

                <div className="form-field-group">
                  <div className="label-with-limit">
                    <label>Meta Description</label>
                    <span className="char-count">{formData.metaDescription.length} / 160</span>
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="A concise summary of the gym shown below the title in search results..."
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value.slice(0, 160) })}
                  ></textarea>
                  <span className="field-subtext">Ideal: 120–160 characters. This text appears in search snippets.</span>
                </div>

                {/* Focus Keywords */}
                <div className="form-field-group">
                  <label>Focus Keywords</label>
                  <div className="keywords-display-box">
                    {formData.focusKeywords.length === 0 ? (
                      <span className="placeholder-text">Keywords will appear here...</span>
                    ) : (
                      formData.focusKeywords.map((kw) => (
                        <span key={kw} className="keyword-chip">
                          {kw}
                          <X size={12} className="remove-kw-icon" onClick={() => handleRemoveKeyword(kw)} />
                        </span>
                      ))
                    )}
                  </div>

                  <div className="keyword-input-row">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Type keywords separated by commas (e.g., gym, fitness, yoga) and press Add"
                      value={formData.keywordInput}
                      onChange={(e) => setFormData({ ...formData, keywordInput: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                    />
                    <button className="btn-add-navy" onClick={handleAddKeyword}>Add</button>
                  </div>
                  <span className="field-subtext">
                    Press Enter or click Add · Add multiple keywords with commas (e.g., gym, fitness, yoga) - max 15 keywords
                  </span>
                </div>

                {/* SEO Score Box */}
                <div className="seo-score-box">
                  <div className="score-header-row">
                    <span className="score-title">SEO Score</span>
                    <span className="score-val-text">0 / 100 — Needs work</span>
                  </div>
                  <span className="score-sub-text">Fill in all three fields within the recommended character limits.</span>
                </div>
              </div>

              <div className="step-footer-actions">
                <button className="btn-prev-gray" onClick={handlePrevStep}>
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button className="btn-next-green" onClick={handleNextStep}>
                  <span>Save & Next: Approved</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Status */}
          {currentStep === 6 && (
            <div className="step-pane">
              <div className="step-header-box">
                <div className="step-header-icon green-circle">
                  <Search size={18} />
                </div>
                <div>
                  <h2>Approved Status</h2>
                  <p>Improve this gym's visibility in Google and other search engines</p>
                </div>
              </div>

              <div className="status-select-container">
                <select
                  className="status-dropdown-select"
                  value={formData.approvalStatus}
                  onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value })}
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </select>
              </div>

              <div className="step-footer-actions">
                <button className="btn-prev-gray" onClick={handlePrevStep}>
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button className="btn-finish-green" onClick={handleNextStep}>
                  <Check size={16} />
                  <span>Save & Finish</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        itemName={deleteModal.itemName}
        onCancel={() => setDeleteModal({ isOpen: false, title: '', itemName: '' })}
        onConfirm={() => {
          notify(`Deleted gym "${formData.name}"`);
          if (onBack) onBack();
        }}
      />
    </div>
  );
}
