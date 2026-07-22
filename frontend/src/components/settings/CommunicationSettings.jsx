import React, { useState } from 'react';
import { Save, Info } from 'lucide-react';
import './CommunicationSettings.css';

export default function CommunicationSettings({ onActionTrigger }) {
  const [commData, setCommData] = useState({
    apiUrl: 'https://notifyblast.com/api/v1/messages/template',
    bearerToken: 'msg_f971a4b709c12844383ea5324c85d58b51c9ad1bf42bc1c5:83de7db0909cb6c7798866e50d51025822a35ff043ba0a7b4a557469cf39cd633a823972a5171cc92e3887fb0fd7fc6a',
    templateName: 'zymgoo_payment_link',
    language: 'en_US',
    subjectTemplate: 'Invoice Payment Due - {{invoice_number}}',
    bodyTemplate: `Hello {{customer_name}},\\n\\nPlease complete your payment for {{gym_name}}.\\n\\nInvoice: {{invoice_number}}\\nAmount Due: ₹{{amount_due}}\\n\\nPay here: {{payment_link}}\\n\\nRegards,\\nTeam Zymgoo`
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onActionTrigger) onActionTrigger('Communication settings updated successfully!');
  };

  return (
    <div className="comm-settings-page">
      {/* Title Hero Header */}
      <div className="comm-settings-hero">
        <h1>Communication Settings</h1>
        <p>Reusable module settings for WhatsApp template messaging and invoice communication (saved in .env).</p>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="comm-settings-card">
        {/* Section 1: WhatsApp Template Provider */}
        <div className="comm-section-box">
          <div className="comm-section-header">
            <h3>WhatsApp Template Provider</h3>
          </div>

          <div className="comm-field-group">
            <label className="comm-field-label">API URL</label>
            <input
              type="text"
              name="apiUrl"
              className="comm-field-input"
              value={commData.apiUrl}
              onChange={handleChange}
            />
          </div>

          <div className="comm-field-group">
            <label className="comm-field-label">Bearer Token</label>
            <textarea
              name="bearerToken"
              className="comm-field-textarea"
              rows={3}
              value={commData.bearerToken}
              onChange={handleChange}
            />
            <span className="comm-field-helper">
              Template change hone par token same rakh sakte ho, template name alag update kar sakte ho.
            </span>
          </div>

          <div className="comm-form-grid-2">
            <div className="comm-field-group">
              <label className="comm-field-label">Template Name</label>
              <input
                type="text"
                name="templateName"
                className="comm-field-input"
                value={commData.templateName}
                onChange={handleChange}
              />
            </div>

            <div className="comm-field-group">
              <label className="comm-field-label">Language</label>
              <input
                type="text"
                name="language"
                className="comm-field-input"
                value={commData.language}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Variables Mapping Banner */}
          <div className="comm-info-banner">
            Template variables mapping fixed: <code>Variable 1 = Customer Name</code>, <code>Variable 2 = Gym Name</code>, <code>Variable 3 = Payment Link</code>.
          </div>
        </div>

        {/* Section 2: Email Template (Saved for Reuse) */}
        <div className="comm-section-box">
          <div className="comm-section-header">
            <h3>Email Template (Saved for Reuse)</h3>
          </div>

          <div className="comm-field-group">
            <label className="comm-field-label">Email Subject Template</label>
            <input
              type="text"
              name="subjectTemplate"
              className="comm-field-input"
              value={commData.subjectTemplate}
              onChange={handleChange}
            />
          </div>

          <div className="comm-field-group">
            <label className="comm-field-label">Email Body Template</label>
            <textarea
              name="bodyTemplate"
              className="comm-field-textarea"
              rows={6}
              value={commData.bodyTemplate}
              onChange={handleChange}
            />
            <span className="comm-field-helper">
              Available variables: <code>{'{{customer_name}}'}</code>, <code>{'{{gym_name}}'}</code>, <code>{'{{invoice_number}}'}</code>, <code>{'{{amount_due}}'}</code>, <code>{'{{payment_link}}'}</code>
            </span>
          </div>
        </div>

        <button type="submit" className="btn-save-comm-settings">
          Save Communication Settings
        </button>
      </form>
    </div>
  );
}
