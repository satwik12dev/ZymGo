import React, { useState, useRef } from 'react';
import { Download, Upload, ArrowLeft, AlertTriangle, FileSpreadsheet, CheckCircle2, CloudUpload, X } from 'lucide-react';
import './BulkUploadMember.css';

export default function BulkUploadMember({ onBack, onActionTrigger }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleDownloadSample = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "owner_name,mobile,email,address,state,city,pincode,country,user_status,block_status\n" +
      "Raja Ali,7352132557,rajaali7025@gmail.com,Sheohar chhawni bombay market near hotel aman vihar,Bihar,Dumra,843302,India,1,0\n" +
      "Focus Fitness Owner,7505690374,focusfitness@gmail.com,Civil Lines Main Road,Uttar Pradesh,Moradabad,244001,India,1,0\n" +
      "Vikram Singh,9876543210,vikram@goldsgym.in,MG Road Sector 14,Haryana,Gurugram,122001,India,1,0\n" +
      "Amit Sharma,9123456789,info@fitnesspoint.com,Station Road Opp Bus Stand,Jharkhand,Ranchi,834001,India,1,0\n" +
      "Sanjay Roy,8877665544,sanjay@powerhouse.com,Park Street Block B,West Bengal,Kolkata,700016,India,1,0";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "zymgoo_bulk_members_sample.csv");
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
      notify(`Successfully imported members from "${selectedFile.name}"!`);
      setSelectedFile(null);
    }, 1200);
  };

  return (
    <div className="bulk-upload-member-page">
      {/* Top Navigation & Title Bar */}
      <div className="bulk-member-top-nav">
        <button 
          className="btn-back-arrow" 
          onClick={onBack || (() => window.history.back())}
          title="Back to Member List"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="bulk-member-title-group">
          <h1>Bulk Upload Members</h1>
          <p>Import multiple members at once via CSV file</p>
        </div>
      </div>

      {/* Step 1: Download Sample CSV Template */}
      <div className="bulk-member-step-card">
        <div className="step-badge-row">
          <div className="step-num-badge">1</div>
          <h3>Download the sample CSV template</h3>
        </div>

        <div className="step-1-content-box">
          <button className="btn-download-sample-csv-green" onClick={handleDownloadSample}>
            <Download size={18} />
            <span>Download Sample CSV</span>
          </button>
          <span className="step-hint-text">The file contains headers and 5 example rows to guide you.</span>
        </div>
      </div>

      {/* Step 2: Fill in your data — Column Reference */}
      <div className="bulk-member-step-card">
        <div className="step-badge-row">
          <div className="step-num-badge">2</div>
          <h3>Fill in your data — column reference</h3>
        </div>

        <div className="step-legend-row">
          <span className="legend-chip required">
            <span className="dot orange"></span> Required
          </span>
          <span className="legend-chip optional">
            <span className="dot gray"></span> Optional
          </span>
        </div>

        {/* 2-Column Grid of Field Cards */}
        <div className="field-cards-grid">
          {/* Card 1 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot orange"></span>
              <code className="field-code-name">owner_name</code>
            </div>
            <p className="field-desc">Full name of the member</p>
          </div>

          {/* Card 2 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot orange"></span>
              <code className="field-code-name">mobile</code>
            </div>
            <p className="field-desc">Mobile number (10 digits)</p>
          </div>

          {/* Card 3 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot gray"></span>
              <code className="field-code-name">email</code>
            </div>
            <p className="field-desc">Email address</p>
          </div>

          {/* Card 4 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot gray"></span>
              <code className="field-code-name">address</code>
            </div>
            <p className="field-desc">Full street address</p>
          </div>

          {/* Card 5 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot orange"></span>
              <code className="field-code-name">state</code>
            </div>
            <p className="field-desc">State name (must match database)</p>
          </div>

          {/* Card 6 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot orange"></span>
              <code className="field-code-name">city</code>
            </div>
            <p className="field-desc">City name</p>
          </div>

          {/* Card 7 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot gray"></span>
              <code className="field-code-name">pincode</code>
            </div>
            <p className="field-desc">6-digit PIN code</p>
          </div>

          {/* Card 8 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot gray"></span>
              <code className="field-code-name">country</code>
            </div>
            <p className="field-desc">Country (default: India)</p>
          </div>

          {/* Card 9 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot gray"></span>
              <code className="field-code-name">user_status</code>
            </div>
            <p className="field-desc">Account status: 1=Active, 0=Inactive</p>
          </div>

          {/* Card 10 */}
          <div className="field-ref-card">
            <div className="field-ref-header">
              <span className="dot gray"></span>
              <code className="field-code-name">block_status</code>
            </div>
            <p className="field-desc">Block status: 0=Not Blocked, 1=Blocked</p>
          </div>
        </div>

        {/* Important Rules Warning Box */}
        <div className="important-rules-box">
          <div className="rules-title">
            <AlertTriangle size={17} className="rules-icon" />
            <span>Important Rules</span>
          </div>
          <ul className="rules-list">
            <li>First row must be the header row (column names exactly as shown above)</li>
            <li>Duplicate mobile numbers will be skipped</li>
            <li>Maximum <strong>500 rows</strong> per upload</li>
            <li>Save the file as <strong>CSV (comma-separated)</strong> — not Excel (.xlsx)</li>
            <li>Mobile number must be 10 digits</li>
            <li>State and city must match existing values in database</li>
          </ul>
        </div>
      </div>

      {/* Step 3: Upload your CSV file */}
      <div className="bulk-member-step-card">
        <div className="step-badge-row">
          <div className="step-num-badge">3</div>
          <h3>Upload your CSV file</h3>
        </div>

        {/* Dropzone area */}
        <div 
          className={`csv-dropzone-box ${isDragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".csv" 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />

          {!selectedFile ? (
            <div className="dropzone-empty-content">
              <div className="cloud-icon-square">
                <CloudUpload size={24} />
              </div>
              <p className="drop-main-text">
                Drop your CSV here or <span className="browse-text">browse</span>
              </p>
              <span className="drop-sub-text">CSV files only - max 5MB</span>
            </div>
          ) : (
            <div className="dropzone-file-content" onClick={(e) => e.stopPropagation()}>
              <div className="file-icon-square">
                <FileSpreadsheet size={24} />
              </div>
              <div className="file-info">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
              <button className="btn-remove-file" onClick={() => setSelectedFile(null)} title="Remove file">
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Upload & Process Button */}
        <button 
          className={`btn-upload-process-orange ${isUploading ? 'uploading' : ''}`} 
          onClick={handleProcessUpload}
          disabled={isUploading}
        >
          <CloudUpload size={18} />
          <span>{isUploading ? 'Uploading & Processing...' : 'Upload & Process'}</span>
        </button>
      </div>
    </div>
  );
}
