import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Link, 
  Calendar, 
  Check, 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react';
import './UpdateBanner.css';

export default function UpdateBanner({ bannerData, onBack, onActionTrigger }) {
  const [formData, setFormData] = useState({
    title: bannerData?.title || 'Advertise Banner',
    bannerType: bannerData?.bannerType || 'Video',
    targetType: bannerData?.targetType || 'All',
    state: bannerData?.state || 'Uttar Pradesh',
    city: bannerData?.city || '',
    ctaType: bannerData?.ctaType || 'Phone',
    ctaText: bannerData?.ctaText || 'Cta text hello',
    ctaValue: bannerData?.ctaValue || 'CTA value',
    startDate: bannerData?.startDate || '2025-12-11',
    endDate: bannerData?.endDate || '2025-12-31',
    priority: bannerData?.priority || '3 – Low',
    screenPosition: bannerData?.screenPosition || 'Ecommerce',
    isActive: bannerData?.isActive !== undefined ? bannerData.isActive : true,
    isExpired: bannerData?.isExpired !== undefined ? bannerData.isExpired : true
  });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    notify(`Saved changes for banner "${formData.title}"!`);
    if (onBack) onBack();
  };

  const toggleActiveStatus = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive
    }));
    notify(`Banner status toggled to ${!formData.isActive ? 'Active' : 'Inactive'}`);
  };

  return (
    <div className="update-banner-page">
      {/* Top Title Group */}
      <div className="update-banner-title-group">
        <h1>Edit Banner</h1>
        <p>Wednesday, July 22, 2026</p>
      </div>

      <form onSubmit={handleSaveChanges}>
        <div className="update-banner-main-grid">
          {/* LEFT COLUMN (3 Cards) */}
          <div className="update-left-column">
            {/* Card 1: Banner Info */}
            <div className="edit-banner-card">
              <div className="edit-card-header orange">
                <ImageIcon size={18} />
                <span>Banner Info</span>
              </div>

              <div className="edit-form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  className="edit-input-field" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid-2col">
                <div className="edit-form-group">
                  <label>Banner Type</label>
                  <select 
                    className="edit-select-field"
                    value={formData.bannerType}
                    onChange={(e) => setFormData({ ...formData, bannerType: e.target.value })}
                  >
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                    <option value="Slider">Slider</option>
                    <option value="Promo">Promo</option>
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>Target Type</label>
                  <select 
                    className="edit-select-field"
                    value={formData.targetType}
                    onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                  >
                    <option value="All">All</option>
                    <option value="Gym Owner">Gym Owner</option>
                    <option value="Member">Member</option>
                    <option value="Guest">Guest</option>
                  </select>
                </div>
              </div>

              <div className="grid-2col">
                <div className="edit-form-group">
                  <label>State</label>
                  <select 
                    className="edit-select-field"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>City</label>
                  <select 
                    className="edit-select-field"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option value="">Select city...</option>
                    <option value="Moradabad">Moradabad</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Dumra">Dumra</option>
                    <option value="Ranchi">Ranchi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 2: Call to Action */}
            <div className="edit-banner-card">
              <div className="edit-card-header blue">
                <Link size={18} />
                <span>Call to Action</span>
              </div>

              <div className="grid-3col">
                <div className="edit-form-group">
                  <label>CTA Type</label>
                  <select 
                    className="edit-select-field"
                    value={formData.ctaType}
                    onChange={(e) => setFormData({ ...formData, ctaType: e.target.value })}
                  >
                    <option value="Phone">Phone</option>
                    <option value="Url">Url</option>
                    <option value="Screen">Screen</option>
                    <option value="Modal">Modal</option>
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>CTA Text</label>
                  <input 
                    type="text" 
                    className="edit-input-field" 
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  />
                </div>

                <div className="edit-form-group">
                  <label>CTA Value</label>
                  <input 
                    type="text" 
                    className="edit-input-field" 
                    value={formData.ctaValue}
                    onChange={(e) => setFormData({ ...formData, ctaValue: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Schedule & Position */}
            <div className="edit-banner-card">
              <div className="edit-card-header green">
                <Calendar size={18} />
                <span>Schedule & Position</span>
              </div>

              <div className="grid-2col">
                <div className="edit-form-group">
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    className="edit-input-field" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="edit-form-group">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    className="edit-input-field" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2col">
                <div className="edit-form-group">
                  <label>Priority</label>
                  <select 
                    className="edit-select-field"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="1 – High">1 – High</option>
                    <option value="2 – Medium">2 – Medium</option>
                    <option value="3 – Low">3 – Low</option>
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>Screen Position</label>
                  <select 
                    className="edit-select-field"
                    value={formData.screenPosition}
                    onChange={(e) => setFormData({ ...formData, screenPosition: e.target.value })}
                  >
                    <option value="Ecommerce">Ecommerce</option>
                    <option value="Findgym">Findgym</option>
                    <option value="Home">Home</option>
                    <option value="Top Slider">Top Slider</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (3 Cards) */}
          <div className="update-right-column">
            {/* Right Card 1: Banner Image */}
            <div className="edit-banner-card">
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Banner Image</h4>
              
              <div className="right-preview-img-wrapper">
                <img 
                  src={bannerData?.imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'} 
                  alt="Banner" 
                />
              </div>

              <div className="replace-img-box">
                <span className="lbl">Replace Image (optional)</span>
                <input type="file" className="replace-file-input" accept="image/*" />
                <span className="format-info-text">JPG, PNG, WebP · max 10MB</span>
              </div>
            </div>

            {/* Right Card 2: Performance & Status */}
            <div className="edit-banner-card">
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Performance</h4>

              <div className="perf-grid-2x2">
                <div className="perf-box purple">
                  <span className="val">0</span>
                  <span className="lbl">Impressions</span>
                </div>

                <div className="perf-box blue">
                  <span className="val">0</span>
                  <span className="lbl">Clicks</span>
                </div>

                <div className="perf-box orange">
                  <span className="val">0%</span>
                  <span className="lbl">CTR</span>
                </div>

                <div className="perf-box grey">
                  <span className="val">#3</span>
                  <span className="lbl">Priority</span>
                </div>
              </div>

              <div className="status-toggle-row">
                <span className="lbl">Status</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {formData.isActive ? (
                    <span className="status-completed-pill" style={{ margin: 0 }}>• Active</span>
                  ) : (
                    <span className="status-failed-pill" style={{ margin: 0 }}>• Inactive</span>
                  )}
                  <span className="toggle-active-link" onClick={toggleActiveStatus}>· toggle</span>
                </div>
              </div>

              {formData.isExpired && (
                <div className="banner-expired-alert">
                  This banner has expired
                </div>
              )}
            </div>

            {/* Right Card 3: Action Buttons */}
            <div className="right-actions-card">
              <button type="submit" className="btn-save-banner-orange">
                <Check size={16} />
                <span>Save Changes</span>
              </button>

              <button 
                type="button" 
                className="btn-cancel-banner-white"
                onClick={onBack || (() => window.history.back())}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
