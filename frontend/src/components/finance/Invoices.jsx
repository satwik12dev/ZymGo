import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  Edit2, 
  MoreHorizontal, 
  X 
} from 'lucide-react';
import './Invoices.css';

const initialInvoices = [
  {
    id: 'INV-2026-0004',
    date: '2026-04-29',
    gymId: '000008',
    owner: 'Rohit Kumar',
    ownerPhone: '8218832132',
    plan: '3 Month Plan',
    amount: 1178.82,
    amountDue: 1178.82,
    status: 'Sent',
    paymentStatus: 'Pending',
    paymentHash: 'db1c4800a56ee2...',
    hasTimeline: true
  },
  {
    id: 'INV-2026-0003',
    date: '2026-01-13',
    gymId: '000002',
    owner: 'Owner #4',
    ownerPhone: '—',
    plan: '1 Year Plan',
    amount: 6729.73,
    amountDue: 6729.73,
    status: 'Sent',
    paymentStatus: 'Pending',
    paymentHash: '3f360087afbe3a...',
    hasTimeline: true
  },
  {
    id: 'INV-2026-0002',
    date: '2026-01-13',
    gymId: '000002',
    owner: 'Owner #4',
    ownerPhone: '—',
    plan: '1 Year Plan',
    amount: 6729.73,
    amountDue: 6729.73,
    status: 'Sent',
    paymentStatus: 'No attempt',
    paymentHash: null,
    hasTimeline: false
  },
  {
    id: 'INV-2026-0001',
    date: '2026-01-10',
    gymId: '000001',
    owner: 'Rahul Sharma',
    ownerPhone: '9876543210',
    plan: '1 Month Plan',
    amount: 1178.82,
    amountDue: 0,
    status: 'Paid',
    paymentStatus: 'Success',
    paymentHash: '9a8b7c6d5e4f...',
    hasTimeline: true
  }
];

export default function Invoices({ onActionTrigger }) {
  const [invoicesList, setInvoicesList] = useState(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pageSize, setPageSize] = useState('20/page');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newInvoiceData, setNewInvoiceData] = useState({
    gymId: '',
    owner: '',
    ownerPhone: '',
    plan: '3 Month Plan',
    amount: 1178.82
  });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const filteredInvoices = useMemo(() => {
    return invoicesList.filter((inv) => {
      const matchesSearch = 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.gymId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.plan.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All Status' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoicesList, searchQuery, statusFilter]);

  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    const newInv = {
      id: `INV-2026-000${invoicesList.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      gymId: newInvoiceData.gymId || '000009',
      owner: newInvoiceData.owner || 'New Owner',
      ownerPhone: newInvoiceData.ownerPhone || '9998887770',
      plan: newInvoiceData.plan,
      amount: Number(newInvoiceData.amount),
      amountDue: Number(newInvoiceData.amount),
      status: 'Sent',
      paymentStatus: 'Pending',
      paymentHash: 'a1b2c3d4e5f6...',
      hasTimeline: true
    };
    setInvoicesList([newInv, ...invoicesList]);
    notify(`Created new invoice ${newInv.id} for ₹${newInv.amount}`);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="invoices-page">
      {/* Top Header */}
      <div className="invoices-header-row">
        <div className="invoices-title-group">
          <h1>Invoices</h1>
          <p>Billing, payment tracking and quick actions</p>
        </div>

        <button className="btn-create-invoice-orange" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* 6 Summary Stat Cards Grid */}
      <div className="invoices-stats-grid-6">
        <div className="invoice-stat-card">
          <div className="stat-icon-square blue">
            <FileText size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Total</span>
            <span className="val">{invoicesList.length}</span>
          </div>
        </div>

        <div className="invoice-stat-card">
          <div className="stat-icon-square grey">
            <DollarSign size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Invoiced</span>
            <span className="val">₹15,817</span>
          </div>
        </div>

        <div className="invoice-stat-card">
          <div className="stat-icon-square green">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Collected</span>
            <span className="val">₹0</span>
          </div>
        </div>

        <div className="invoice-stat-card">
          <div className="stat-icon-square orange">
            <Clock size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Outstanding</span>
            <span className="val">₹15,817</span>
          </div>
        </div>

        <div className="invoice-stat-card">
          <div className="stat-icon-square red">
            <AlertCircle size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Overdue</span>
            <span className="val">0</span>
          </div>
        </div>

        <div className="invoice-stat-card">
          <div className="stat-icon-square teal">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Paid</span>
            <span className="val">0</span>
          </div>
        </div>
      </div>

      {/* Filter Box Card */}
      <div className="invoice-filter-card">
        <div className="filter-row-top">
          <div className="invoice-search-wrapper">
            <Search size={16} />
            <input 
              type="text" 
              className="invoice-search-input" 
              placeholder="Invoice #, gym, owner, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="audit-select-field"
            style={{ width: 160 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
            <option value="Draft">Draft</option>
            <option value="Overdue">Overdue</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
            <span>From</span>
            <input 
              type="date" 
              className="audit-date-input-field" 
              style={{ width: 150 }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
            <span>To</span>
            <input 
              type="date" 
              className="audit-date-input-field" 
              style={{ width: 150 }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-row-bottom">
          <select 
            className="audit-select-field"
            style={{ width: 120 }}
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value="20/page">20/page</option>
            <option value="50/page">50/page</option>
            <option value="100/page">100/page</option>
          </select>

          <button className="btn-invoice-search-navy" onClick={() => notify(`Filtered ${filteredInvoices.length} invoices`)}>
            Search
          </button>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="invoices-table-card">
        <div className="invoices-table-top-bar">
          <h4>{filteredInvoices.length} invoices</h4>
          <span className="counter">Showing 1–{filteredInvoices.length}</span>
        </div>

        <div className="table-responsive">
          <table className="invoices-custom-table">
            <thead>
              <tr>
                <th>INVOICE</th>
                <th>GYM</th>
                <th>OWNER</th>
                <th>PLAN</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>PAYMENT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  {/* INVOICE */}
                  <td>
                    <span className="inv-code-text">{inv.id}</span>
                    <div className="inv-date-sub">{inv.date}</div>
                  </td>

                  {/* GYM */}
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{inv.gymId}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{inv.gymId}</div>
                  </td>

                  {/* OWNER */}
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{inv.owner}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{inv.ownerPhone}</div>
                  </td>

                  {/* PLAN */}
                  <td style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>
                    {inv.plan}
                  </td>

                  {/* AMOUNT */}
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>
                      ₹{inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    {inv.amountDue > 0 ? (
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: '#ea580c' }}>
                        ₹{inv.amountDue.toLocaleString(undefined, { minimumFractionDigits: 2 })} due
                      </div>
                    ) : (
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: '#16a34a' }}>
                        ₹0.00 due
                      </div>
                    )}
                  </td>

                  {/* STATUS */}
                  <td>
                    <div>
                      {inv.status === 'Paid' ? (
                        <span className="status-paid-pill">• Paid</span>
                      ) : (
                        <span className="status-sent-pill">• Sent</span>
                      )}
                    </div>
                    <button className="btn-edit-link" onClick={() => notify(`Editing invoice ${inv.id}`)}>
                      <Edit2 size={11} />
                      <span>Edit</span>
                    </button>
                  </td>

                  {/* PAYMENT */}
                  <td>
                    {inv.paymentStatus === 'Pending' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span className="pending-payment-badge">Pending</span>
                        <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94a3b8' }}>
                          {inv.paymentHash}
                        </span>
                        {inv.hasTimeline && (
                          <span className="timeline-link" onClick={() => notify(`Opening timeline for ${inv.id}`)}>
                            Timeline →
                          </span>
                        )}
                      </div>
                    ) : inv.paymentStatus === 'Success' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span className="status-paid-pill" style={{ fontSize: 11 }}>Success</span>
                        {inv.hasTimeline && (
                          <span className="timeline-link" onClick={() => notify(`Opening timeline for ${inv.id}`)}>
                            Timeline →
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>No attempt</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <button 
                      className="btn-3dots-action"
                      onClick={() => notify(`Actions menu for invoice ${inv.id}`)}
                      title="Invoice Actions"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup: Create Invoice */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-container" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Create New Invoice</h3>
              <button className="modal-close-btn" onClick={() => setIsCreateModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 24 }}>
                <div className="form-group">
                  <label>Gym ID *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 000008" 
                    value={newInvoiceData.gymId}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, gymId: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Owner Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rohit Kumar" 
                    value={newInvoiceData.owner}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, owner: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Owner Phone</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 8218832132" 
                    value={newInvoiceData.ownerPhone}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, ownerPhone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Subscription Plan *</label>
                  <select 
                    value={newInvoiceData.plan}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, plan: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                  >
                    <option value="1 Month Plan">1 Month Plan</option>
                    <option value="3 Month Plan">3 Month Plan</option>
                    <option value="6 Month Plan">6 Month Plan</option>
                    <option value="1 Year Plan">1 Year Plan</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="e.g. 1178.82" 
                    value={newInvoiceData.amount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-orange" style={{ padding: '10px 24px', borderRadius: 10 }}>
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
