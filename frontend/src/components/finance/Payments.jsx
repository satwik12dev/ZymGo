import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  Search,
  Download,
  FileText
} from 'lucide-react';
import './Payments.css';

const samplePayments = [
  {
    id: 1,
    txnId: 'db1c4800a56ee2e5252c',
    invNumber: '#INV-2026-0004',
    payerName: 'Customer',
    payerEmail: 'help@zymgoo.com',
    gymProduct: 'Invoice INV-2026-...',
    method: 'Cash',
    amount: 1178.82,
    status: 'Pending'
  },
  {
    id: 2,
    txnId: '016a44ed51cf08d6fb85',
    invNumber: '#INV-2026-0004',
    payerName: 'Customer',
    payerEmail: 'help@zymgoo.com',
    gymProduct: 'Invoice INV-2026-...',
    method: 'Cash',
    amount: 1178.82,
    status: 'Pending'
  },
  {
    id: 3,
    txnId: '3f360087afbe3a447a86',
    invNumber: '#INV-2026-0003',
    payerName: 'Customer',
    payerEmail: 'pay@zymgoo.com',
    gymProduct: 'Invoice INV-2026-...',
    method: 'Cash',
    amount: 6729.73,
    status: 'Pending'
  },
  {
    id: 4,
    txnId: '8a9b0c1d2e3f4a5b6c7d',
    invNumber: '#INV-2026-0002',
    payerName: 'Owner #4',
    payerEmail: 'owner4@zymgoo.com',
    gymProduct: 'Invoice INV-2026-0002',
    method: 'Cash',
    amount: 6729.73,
    status: 'Pending'
  },
  {
    id: 5,
    txnId: '1a2b3c4d5e6f7a8b9c0d',
    invNumber: '#INV-2026-0001',
    payerName: 'Rahul Sharma',
    payerEmail: 'rahul@zymgoo.com',
    gymProduct: 'Invoice INV-2026-0001',
    method: 'Cash',
    amount: 1178.82,
    status: 'Pending'
  },
  {
    id: 6,
    txnId: '9f8e7d6c5b4a3f2e1d0c',
    invNumber: '#INV-2026-0005',
    payerName: 'Focus Fitness',
    payerEmail: 'fitness@gmail.com',
    gymProduct: '1 Month Plan Subscription',
    method: 'PayU',
    amount: 999.00,
    status: 'Pending'
  },
  {
    id: 7,
    txnId: '7a6b5c4d3e2f1a0b9c8d',
    invNumber: '#INV-2026-0006',
    payerName: 'Super Power Gym',
    payerEmail: 'superpower@gmail.com',
    gymProduct: '3 Month Plan Subscription',
    method: 'UPI',
    amount: 1998.00,
    status: 'Pending'
  },
  {
    id: 8,
    txnId: '5b4a3f2e1d0c9f8e7d6c',
    invNumber: '#INV-2026-0007',
    payerName: 'Gold Gym Gurugram',
    payerEmail: 'contact@goldsgym.in',
    gymProduct: '1 Year Plan Subscription',
    method: 'PayU',
    amount: 5999.00,
    status: 'Pending'
  },
  {
    id: 9,
    txnId: '3e2f1a0b9c8d7a6b5c4d',
    invNumber: '#INV-2026-0008',
    payerName: 'Fitness Point Ranchi',
    payerEmail: 'info@fitnesspoint.com',
    gymProduct: '6 Month Plan Subscription',
    method: 'Cash',
    amount: 4999.00,
    status: 'Pending'
  },
  {
    id: 10,
    txnId: '2f1a0b9c8d7a6b5c4d3e',
    invNumber: '#INV-2026-0009',
    payerName: 'Power House Gym',
    payerEmail: 'powerhouse@kolkata.com',
    gymProduct: '1 Month Plan Subscription',
    method: 'UPI',
    amount: 999.00,
    status: 'Pending'
  },
  {
    id: 11,
    txnId: '1a0b9c8d7a6b5c4d3e2f',
    invNumber: '#INV-2026-0010',
    payerName: 'Alpha Fitness Club',
    payerEmail: 'alpha@fitness.com',
    gymProduct: '3 Month Plan Subscription',
    method: 'PayU',
    amount: 1998.00,
    status: 'Pending'
  },
  {
    id: 12,
    txnId: '0b9c8d7a6b5c4d3e2f1a',
    invNumber: '#INV-2026-0011',
    payerName: 'Iron Paradise',
    payerEmail: 'iron@paradise.com',
    gymProduct: '1 Year Plan Subscription',
    method: 'Cash',
    amount: 5999.00,
    status: 'Pending'
  }
];

export default function Payments({ onActionTrigger, onNavigateToInvoices }) {
  const [paymentsList] = useState(samplePayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [methodFilter, setMethodFilter] = useState('All Methods');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const filteredPayments = useMemo(() => {
    return paymentsList.filter((p) => {
      const matchesSearch =
        p.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.payerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;
      const matchesMethod = methodFilter === 'All Methods' || p.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [paymentsList, searchQuery, statusFilter, methodFilter]);

  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const displayedPayments = useMemo(() => {
    return filteredPayments.slice(startIndex, endIndex);
  }, [filteredPayments, startIndex, endIndex]);

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const csvHeader = "TxnID,Invoice,Payer_Name,Payer_Email,Product,Method,Amount,Status\n";
    const csvRows = filteredPayments.map(p =>
      `${p.txnId},${p.invNumber},${p.payerName},${p.payerEmail},${p.gymProduct},${p.method},${p.amount},${p.status}`
    ).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvHeader + csvRows);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zymgoo_payments_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify(`Exported ${filteredPayments.length} payment records to CSV.`);
  };

  return (
    <div className="payments-page">
      {/* Top Header */}
      <div className="payments-header-row">
        <div className="payments-title-group">
          <h1>Payments</h1>
          <p>PayU & manual payment transactions</p>
        </div>

        <button
          className="btn-view-invoices-white"
          onClick={() => {
            if (onNavigateToInvoices) onNavigateToInvoices();
            notify('Navigated to Invoices');
          }}
        >
          <FileText size={16} />
          <span>View Invoices</span>
        </button>
      </div>

      {/* 6 Stat Cards Grid */}
      <div className="payments-stats-grid-6">
        <div className="payment-stat-card">
          <div className="stat-icon-square blue">
            <CreditCard size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Total</span>
            <span className="val">{paymentsList.length}</span>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="stat-icon-square green">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Completed</span>
            <span className="val">0</span>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="stat-icon-square orange">
            <Clock size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Pending</span>
            <span className="val">12</span>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="stat-icon-square red">
            <XCircle size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Failed</span>
            <span className="val">0</span>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="stat-icon-square teal">
            <DollarSign size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">This Month</span>
            <span className="val">₹0</span>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="stat-icon-square orange">
            <Calendar size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Today</span>
            <span className="val">₹0</span>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <div className="payments-filter-card">
        <div className="payments-filter-row-top">
          <div className="payments-search-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="payments-search-input"
              placeholder="TxnID, email, phone, name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="audit-select-field"
            style={{ width: 140 }}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            className="audit-select-field"
            style={{ width: 150 }}
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All Methods">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="PayU">PayU</option>
            <option value="UPI">UPI</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
            <span>From</span>
            <input
              type="date"
              className="audit-date-input-field"
              style={{ width: 145 }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
        </div>

        <div className="payments-filter-row-bottom">
          <div className="payments-filter-controls-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
              <span>To</span>
              <input
                type="date"
                className="audit-date-input-field"
                style={{ width: 145 }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <select
              className="audit-select-field"
              style={{ width: 120 }}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={10}>10/page</option>
              <option value={20}>20/page</option>
              <option value={50}>50/page</option>
              <option value={100}>100/page</option>
            </select>

            <button className="btn-invoice-search-navy" onClick={() => notify(`Searched ${filteredPayments.length} payments`)}>
              Search
            </button>
          </div>

          <button className="btn-export-csv-green" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Payments Table Card */}
      <div className="payments-table-card">
        <div className="payments-table-top-bar">
          <h4>{totalItems} payments</h4>
          <span className="counter">
            Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems}
          </span>
        </div>

        <div className="table-responsive">
          <table className="payments-custom-table">
            <thead>
              <tr>
                <th>TRANSACTION</th>
                <th>PAYER</th>
                <th>GYM / PRODUCT</th>
                <th>METHOD</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {displayedPayments.map((p) => (
                <tr key={p.id}>
                  {/* TRANSACTION */}
                  <td>
                    <div className="txn-hash-text">{p.txnId}</div>
                    <span className="txn-inv-link" onClick={() => notify(`Viewing invoice ${p.invNumber}`)}>
                      {p.invNumber}
                    </span>
                  </td>

                  {/* PAYER */}
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.payerName}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{p.payerEmail}</div>
                  </td>

                  {/* GYM / PRODUCT */}
                  <td style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>
                    {p.gymProduct}
                  </td>

                  {/* METHOD */}
                  <td>
                    <span className="method-pill-badge">
                      💵 {p.method}
                    </span>
                  </td>

                  {/* AMOUNT */}
                  <td style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>
                    ₹{p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  {/* STATUS */}
                  <td>
                    {p.status === 'Completed' ? (
                      <span className="status-completed-pill">• Completed</span>
                    ) : p.status === 'Failed' ? (
                      <span className="status-failed-pill">• Failed</span>
                    ) : (
                      <span className="status-pending-pill">• Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar Footer */}
        <div className="table-pagination-footer">
          <span style={{ fontSize: 13, color: '#64748b' }}>
            Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems} payments
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>

            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', padding: '0 8px' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button 
              className="pagination-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
