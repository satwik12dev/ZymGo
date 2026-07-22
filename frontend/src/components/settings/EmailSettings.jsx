import React, { useState } from 'react';
import { Mail, Save, ExternalLink } from 'lucide-react';
import './EmailSettings.css';

export default function EmailSettings({ onActionTrigger }) {
  const [smtpData, setSmtpData] = useState({
    host: 'mail.zymgoo.com',
    port: '587 (TLS)',
    username: 'help@zymgoo.com',
    password: '',
    encryption: 'TLS',
    fromEmail: 'help@zymgoo.com',
    fromName: 'Zymgoo Account',
    replyToEmail: 'help@zymgoo.com',
    replyToName: 'Zymgoo Account',
    popHost: 'mail.zymgoo.com',
    popPort: '995 (SSL)'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSmtpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onActionTrigger) onActionTrigger('Email settings updated successfully!');
  };

  const handleOpenWebmail = () => {
    window.open('https://mail.zymgoo.com', '_blank');
    if (onActionTrigger) onActionTrigger('Opened Webmail portal');
  };

  return (
    <div className="email-settings-page">
      {/* Title Hero Header */}
      <div className="email-settings-hero">
        <div className="email-settings-hero-title">
          <h1>Email Settings</h1>
          <p>Configure SMTP, POP, and IMAP settings for email communication</p>
        </div>

        <button className="btn-open-webmail" onClick={handleOpenWebmail}>
          <Mail size={16} />
          <span>Open Webmail</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="email-settings-card">
        {/* Section 1: SMTP Configuration */}
        <div className="settings-section-box">
          <div className="settings-section-header">
            <h3>SMTP Configuration</h3>
            <p>Configure outgoing email server settings (saved in .env, not database)</p>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field-group">
              <label className="settings-field-label">SMTP Host</label>
              <input
                type="text"
                name="host"
                className="settings-field-input"
                value={smtpData.host}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-label">SMTP Port</label>
              <select
                name="port"
                className="settings-field-select"
                value={smtpData.port}
                onChange={handleChange}
              >
                <option value="587 (TLS)">587 (TLS)</option>
                <option value="465 (SSL)">465 (SSL)</option>
                <option value="25 (Standard)">25 (Standard)</option>
              </select>
            </div>

            <div className="settings-field-group">
              <label className="settings-field-label">SMTP Username</label>
              <input
                type="text"
                name="username"
                className="settings-field-input"
                value={smtpData.username}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-label">SMTP Password</label>
              <input
                type="password"
                name="password"
                className="settings-field-input"
                placeholder="Leave blank to keep current password"
                value={smtpData.password}
                onChange={handleChange}
              />
              <span className="settings-field-helper">Current password is hidden. Enter new password to change.</span>
            </div>

            <div className="settings-field-group">
              <label className="settings-field-label">Encryption</label>
              <select
                name="encryption"
                className="settings-field-select"
                value={smtpData.encryption}
                onChange={handleChange}
              >
                <option value="TLS">TLS</option>
                <option value="SSL">SSL</option>
                <option value="STARTTLS">STARTTLS</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: From Address Settings */}
        <div className="settings-section-box">
          <div className="settings-section-header">
            <h3>From Address Settings</h3>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field-group">
              <label className="settings-field-label">From Email</label>
              <input
                type="email"
                name="fromEmail"
                className="settings-field-input"
                value={smtpData.fromEmail}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-label">From Name</label>
              <input
                type="text"
                name="fromName"
                className="settings-field-input"
                value={smtpData.fromName}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-label">Reply-To Email</label>
              <input
                type="email"
                name="replyToEmail"
                className="settings-field-input"
                value={smtpData.replyToEmail}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-label">Reply-To Name</label>
              <input
                type="text"
                name="replyToName"
                className="settings-field-input"
                value={smtpData.replyToName}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Incoming Mail Settings */}
        <div className="settings-section-box">
          <div className="settings-section-header">
            <h3>Incoming Mail Settings</h3>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field-group">
              <label className="settings-field-label">POP Host</label>
              <input
                type="text"
                name="popHost"
                className="settings-field-input"
                value={smtpData.popHost}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-label">POP Port</label>
              <select
                name="popPort"
                className="settings-field-select"
                value={smtpData.popPort}
                onChange={handleChange}
              >
                <option value="995 (SSL)">995 (SSL)</option>
                <option value="110 (Standard)">110 (Standard)</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-save-email-settings">
          Save Email Settings
        </button>
      </form>
    </div>
  );
}
