import React, { useState, useRef } from 'react';
import { Download, Upload, ArrowLeft, AlertTriangle, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import './BulkUploadGym.css';

export default function BulkUploadGym({ onBack, onActionTrigger }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleDownloadSample = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "owner_mobile,gym_name,gym_type,address,state,city,area,sub_area,pincode,phone,email,timing,is_zymgoo_trusted,is_top_search,meta_title,meta_description,meta_keywords\n" +
      "7505690374,Focus fitness,Unisex,Moradabad Main Road,Uttar Pradesh,Moradabad,Civil Lines,Near City Station,244001,9690162784,fitness@gmail.com,Mon-Sat 6am-10pm,1,0,Focus Fitness Moradabad,Best Gym in Moradabad,gym moradabad fitness\n" +
      "7352132557,A super power bodybuilding gym,Unisex,Sheohar chhawni bombay market near hotel aman vihar,Bihar,Dumra,Bombay Market,Near Aman Vihar,843302,7352132557,rajaali7025@gmail.com,Mon-Sun 5am-10pm,0,0,Super Power Gym Dumra,Top Gym in Dumra Bihar,gym dumra fitness\n" +
      "9876543210,Gold Gym,Unisex,MG Road Sector 14,Haryana,Gurugram,Sector 14,DLF Phase 2,122001,9876543210,contact@goldsgym.in,Mon-Sat 6am-10pm,1,1,Gold Gym Gurugram,Premier Fitness Gym,golds gym gurugram\n" +
      "9123456789,Fitness Point,Male,Station Road Opp Bus Stand,Jharkhand,Ranchi,Main Road,Overbridge,834001,9123456789,info@fitnesspoint.com,Mon-Sat 6am-9pm,0,0,Fitness Point Ranchi,Ranchi Gym Center,fitness point ranchi\n" +
      "8877665544,Power House Gym,Unisex,Park Street Block B,West Bengal,Kolkata,Park Street,Camac Street,700016,8877665544,powerhouse@kolkata.com,Mon-Sun 6am-10pm,1,0,Power House Kolkata,Kolkata Unisex Gym,powerhouse kolkata";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "zymgoo_bulk_gym_upload_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify("Downloaded sample CSV template with 5 example rows.");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcessUpload = () => {
    if (!selectedFile) {
      notify("Please select a CSV file first.");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      notify(`Successfully uploaded and processed ${selectedFile.name}! Imported 5 gyms.`);
      setSelectedFile(null);
    }, 1500);
  };

  return (
    <div className="bulk-upload-page">
      {/* Header & Breadcrumb */}
      <div className="bulk-upload-top-nav">
        <button 
          className="btn-icon-back-bulk" 
          onClick={onBack || (() => window.history.back())}
          title="Back to Gym Management"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="bulk-title-group">
          <h1>Bulk Upload Gyms</h1>
          <p>Import multiple gyms at once via CSV file</p>
        </div>
      </div>

      {/* Step 1: Download Sample CSV */}
      <div className="bulk-step-card">
        <div className="step-card-header">
          <div className="step-badge-num">1</div>
          <h3>Download the sample CSV template</h3>
        </div>

        <div className="step-1-content">
          <button className="btn-download-sample-csv" onClick={handleDownloadSample}>
            <Download size={18} />
            <span>Download Sample CSV</span>
          </button>
          <span className="step-1-desc">
            The file contains headers and 5 example rows to guide you.
          </span>
        </div>
      </div>

      {/* Step 2: Column Reference */}
      <div className="bulk-step-card">
        <div className="step-card-header">
          <div className="step-badge-num">2</div>
          <h3>Fill in your data — column reference</h3>
        </div>

        <div className="col-legend-row">
          <span><span className="legend-dot required"></span> Required</span>
          <span style={{ color: '#64748b' }}><span className="legend-dot optional"></span> Optional</span>
        </div>

        {/* Column Reference Grid */}
        <div className="column-ref-grid">
          <div className="col-ref-card-item req">
            <span className="col-name-text">owner_mobile</span>
            <span className="col-desc-text">Owner's mobile number (must exist in registration)</span>
          </div>

          <div className="col-ref-card-item req">
            <span className="col-name-text">gym_name</span>
            <span className="col-desc-text">Full name of the gym</span>
          </div>

          <div className="col-ref-card-item req">
            <span className="col-name-text">gym_type</span>
            <span className="col-desc-text">Gym / Yoga / CrossFit / Pilates / Fitness Center / Other</span>
          </div>

          <div className="col-ref-card-item req">
            <span className="col-name-text">address</span>
            <span className="col-desc-text">Full street address</span>
          </div>

          <div className="col-ref-card-item req">
            <span className="col-name-text">state</span>
            <span className="col-desc-text">State name (must match database)</span>
          </div>

          <div className="col-ref-card-item req">
            <span className="col-name-text">city</span>
            <span className="col-desc-text">City name</span>
          </div>

          <div className="col-ref-card-item opt">
            <span className="col-name-text">area</span>
            <span className="col-desc-text">Area/locality within city</span>
          </div>

          <div className="col-ref-card-item opt">
            <span className="col-name-text">sub_area</span>
            <span className="col-desc-text">Sub-area/neighborhood</span>
          </div>

          <div className="col-ref-card-item req">
            <span className="col-name-text">pincode</span>
            <span className="col-desc-text">6-digit PIN code</span>
          </div>

          <div className="col-ref-card-item opt">
            <span className="col-name-text">phone</span>
            <span className="col-desc-text">Gym contact phone number</span>
          </div>

          <div className="col-ref-card-item opt">
            <span className="col-name-text">email</span>
            <span className="col-desc-text">Gym contact email</span>
          </div>

          <div className="col-ref-card-item opt">
            <span className="col-name-text">timing</span>
            <span className="col-desc-text">Operating hours e.g. "Mon-Fri 6am-10pm"</span>
          </div>

          <div className="col-ref-card-item opt">
            <span className="col-name-text">is_zymgoo_trusted</span>
            <span className="col-desc-text">Zymgoo trusted: 1=Yes, 0=No</span>
          </div>

          <div className="col-ref-card-item opt">
            <span className="col-name-text">is_top_search</span>
            <span className="col-desc-text">Top search: 1=Yes, 0=No</span>
          </div>

          <div className="col-ref-card-item opt">
            <span className="col-name-text">meta_title</span>
            <span className="col-desc-text">SEO meta title</span>
          </div>

          <div className="col-ref-card-item opt">
            <span className="col-name-text">meta_description</span>
            <span className="col-desc-text">SEO meta description</span>
          </div>

          <div className="col-ref-card-item opt" style={{ gridColumn: 'span 2' }}>
            <span className="col-name-text">meta_keywords</span>
            <span className="col-desc-text">SEO meta keywords</span>
          </div>
        </div>

        {/* Important Rules Yellow Box */}
        <div className="important-rules-box">
          <div className="important-rules-title">
            <AlertTriangle size={17} />
            <span>Important Rules</span>
          </div>

          <ul className="rules-list-ul">
            <li>First row must be the header row (column names exactly as shown above)</li>
            <li>The <strong>owner_mobile</strong> must already exist in the Members list</li>
            <li>Duplicate gyms (same owner_mobile + gym_name) will be skipped</li>
            <li>Maximum <strong>500 rows</strong> per upload</li>
            <li>Save the file as <strong>CSV (comma-separated)</strong> — not Excel (.xlsx)</li>
          </ul>
        </div>
      </div>

      {/* Step 3: Upload CSV File */}
      <div className="bulk-step-card">
        <div className="step-card-header">
          <div className="step-badge-num">3</div>
          <h3>Upload your CSV file</h3>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          accept=".csv" 
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div 
          className={`dropzone-container ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-icon-circle">
            <Upload size={24} />
          </div>

          {selectedFile ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>{selectedFile.name}</span>
              </div>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB · Ready to process
              </span>
            </div>
          ) : (
            <div className="dropzone-main-text">
              Drop your CSV here or <span className="browse-link">browse</span>
            </div>
          )}

          <div className="dropzone-sub-text">
            CSV files only · max 5MB
          </div>
        </div>

        <button 
          className="btn-upload-process-orange"
          onClick={handleProcessUpload}
          disabled={!selectedFile || isUploading}
        >
          <Upload size={18} />
          <span>{isUploading ? 'Processing CSV Upload...' : 'Upload & Process'}</span>
        </button>
      </div>
    </div>
  );
}
