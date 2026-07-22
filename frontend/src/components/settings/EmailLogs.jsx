import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
import './EmailLogs.css';

const initialLogs = [
  {
    id: 1,
    date: 'Apr 29, 2026 07:33',
    exactDate: '4/29/2026, 7:33:52 AM',
    toName: 'Env Test',
    toEmail: 'test@example.com',
    subject: 'Payment Request - Invoice INV-2026-0003',
    template: 'Direct Email',
    status: 'Sent',
    payUrl: 'http://localhost/adminzymgoo.zymgoo.com/invoice_pay.php?i=7&t=fe28c5bf5ea2fa62c87de2015abe84550592deecbe69ab84',
    bodyText: `Hello Env Test,\n\nPlease complete your payment for Kasrat Gym.\n\nInvoice: INV-2026-0003\nAmount Due: ₹6,729.73\n\nPay here:\nhttp://localhost/adminzymgoo.zymgoo.com/invoice_pay.php?i=7&t=fe28c5bf5ea2fa62c87de2015abe84550592deecbe69ab84\n\nRegards,\nTeam Zymgoo`,
    hasPayButton: true
  },
  {
    id: 2,
    date: 'Apr 29, 2026 07:28',
    exactDate: '4/29/2026, 7:28:14 AM',
    toName: 'Flow Test',
    toEmail: 'test@example.com',
    subject: 'Payment Request - Invoice INV-2026-0003',
    template: 'Direct Email',
    status: 'Sent',
    payUrl: 'http://localhost/adminzymgoo.zymgoo.com/invoice_pay.php?i=7&t=fe28c5bf5ea2fa62c87de2015abe84550592deecbe69ab84',
    bodyText: `Hello Flow Test,\n\nPlease complete your payment for Kasrat Gym.\n\nInvoice: INV-2026-0003\nAmount Due: ₹6,729.73\n\nPay here:\nhttp://localhost/adminzymgoo.zymgoo.com/invoice_pay.php?i=7&t=fe28c5bf5ea2fa62c87de2015abe84550592deecbe69ab84\n\nRegards,\nTeam Zymgoo`,
    hasPayButton: true
  },
  {
    id: 3,
    date: 'Jan 13, 2026 15:00',
    exactDate: '1/13/2026, 3:00:00 PM',
    toName: 'Customer',
    toEmail: '',
    subject: 'Payment Request for Invoice INV-2026-0003',
    template: 'Direct Email',
    status: 'Failed',
    bodyText: `Hello Customer,\n\nInvoice payment request failed due to recipient email rejection.`,
    hasPayButton: false
  },
  {
    id: 4,
    date: 'Jan 01, 2026 19:42',
    exactDate: '1/1/2026, 7:42:10 PM',
    toName: 'Test Recipient',
    toEmail: 'rk.goutam1994@gmail.com',
    subject: 'Test Email from Zymgoo',
    template: 'Direct Email',
    status: 'Sent',
    bodyText: `Hello Test Recipient,\n\nThis is a test notification email sent directly from Zymgoo CRM Admin Panel.\n\nRegards,\nTeam Zymgoo`,
    hasPayButton: false
  }
];

export default function EmailLogs({ onActionTrigger }) {
  const [logs, setLogs] = useState(initialLogs);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [templateFilter, setTemplateFilter] = useState('All Templates');
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const handleApplyFilters = () => {
    if (onActionTrigger) onActionTrigger('Applied filters on Email Logs');
  };

  const handleResetFilters = () => {
    setStatusFilter('All Status');
    setTemplateFilter('All Templates');
    setSearchEmail('');
    if (onActionTrigger) onActionTrigger('Reset Email Logs filters');
  };

  const filteredLogs = logs.filter((log) => {
    if (statusFilter !== 'All Status' && log.status !== statusFilter) return false;
    if (templateFilter !== 'All Templates' && log.template !== templateFilter) return false;
    if (searchEmail.trim()) {
      const q = searchEmail.toLowerCase();
      return (
        log.toName.toLowerCase().includes(q) ||
        log.toEmail.toLowerCase().includes(q) ||
        log.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="email-logs-page">
      {/* Title Hero Header */}
      <div className="email-logs-hero">
        <h1>Email Logs</h1>
        <p>View all sent emails and their delivery status</p>
      </div>

      {/* Filter Bar Box */}
      <div className="email-logs-filter-card">
        <div className="email-logs-filter-row">
          <div className="email-logs-filter-field">
            <span className="email-logs-filter-label">Status</span>
            <select
              className="email-logs-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="Sent">Sent</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="email-logs-filter-field">
            <span className="email-logs-filter-label">Template</span>
            <select
              className="email-logs-select"
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
            >
              <option value="All Templates">All Templates</option>
              <option value="Direct Email">Direct Email</option>
              <option value="welcome">welcome</option>
              <option value="subscription_new">subscription_new</option>
            </select>
          </div>

          <div className="email-logs-filter-field">
            <span className="email-logs-filter-label">Email</span>
            <input
              type="text"
              className="email-logs-input"
              placeholder="Search email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>

          <button className="btn-apply-filters" onClick={handleApplyFilters}>
            Apply Filters
          </button>

          <button className="btn-reset-filters" onClick={handleResetFilters}>
            Reset
          </button>
        </div>
      </div>

      {/* Email Logs Table Box */}
      <div className="email-logs-table-card">
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="logs-custom-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>TO</th>
                <th>SUBJECT</th>
                <th>TEMPLATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="log-date-text">{log.date}</td>
                  <td>
                    <div className="log-to-name">{log.toName}</div>
                    {log.toEmail && <div className="log-to-email">{log.toEmail}</div>}
                  </td>
                  <td className="log-subject-text">{log.subject}</td>
                  <td className="log-template-tag">{log.template}</td>
                  <td>
                    <span className={log.status === 'Sent' ? 'status-badge-sent' : 'status-badge-failed'}>
                      {log.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-view-log-eye"
                      title="View Details"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Details Modal */}
      {selectedLog && (
        <div className="email-details-modal-overlay">
          <div className="email-details-modal-card">
            <div className="email-details-header">
              <h3>Email Details</h3>
              <button
                className="email-details-close"
                onClick={() => setSelectedLog(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="detail-item-group">
              <span className="detail-item-label">To:</span>
              <span className="detail-item-value">
                {selectedLog.toName} {selectedLog.toEmail ? `<${selectedLog.toEmail}>` : ''}
              </span>
            </div>

            <div className="detail-item-group">
              <span className="detail-item-label">Subject:</span>
              <span className="detail-item-value">{selectedLog.subject}</span>
            </div>

            <div className="detail-item-group">
              <span className="detail-item-label">Date:</span>
              <span className="detail-item-value">{selectedLog.exactDate}</span>
            </div>

            <div className="detail-item-group">
              <span className="detail-item-label">Status:</span>
              <div>
                <span className={selectedLog.status === 'Sent' ? 'status-badge-sent' : 'status-badge-failed'}>
                  {selectedLog.status}
                </span>
              </div>
            </div>

            <div className="detail-item-group">
              <span className="detail-item-label">Email Body:</span>
              <div className="email-body-box">
                <div>{selectedLog.bodyText}</div>
                {selectedLog.hasPayButton && (
                  <button
                    className="btn-pay-now-green"
                    onClick={() => {
                      const targetUrl = selectedLog.payUrl || 'http://localhost/adminzymgoo.zymgoo.com/invoice_pay.php?i=7&t=fe28c5bf5ea2fa62c87de2015abe84550592deecbe69ab84';
                      window.open(targetUrl, '_blank');
                      if (onActionTrigger) onActionTrigger(`Redirected to payment portal: ${targetUrl}`);
                    }}
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
