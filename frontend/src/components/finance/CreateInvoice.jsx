import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, CheckCircle, FileText, Percent, Tag, ArrowRight } from 'lucide-react';
import './CreateInvoice.css';

export default function CreateInvoice({ gymData, onBack, onActionTrigger }) {
  const [memberQuery, setMemberQuery] = useState(gymData?.ownerName || '0000013957');
  const [selectedGymId, setSelectedGymId] = useState(gymData?.id || 'gym-1');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [taxPercent, setTaxPercent] = useState('18');
  const [discount, setDiscount] = useState('0');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const samplePlans = [
    { id: 'p1', name: 'Monthly Plan', price: 999 },
    { id: 'p2', name: '3 Month Plan', price: 2499 },
    { id: 'p3', name: '6 Month Plan', price: 4499 },
    { id: 'p4', name: '1 Year Plan', price: 7999 }
  ];

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
    const plan = samplePlans.find((p) => p.id === planId);
    if (plan) {
      setAmount(plan.price.toString());
    } else {
      setAmount('');
    }
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount('250');
      setPromoApplied(true);
      notify('Promo code SAVE10 applied! ₹250 discount added.');
    } else {
      notify('Invalid promo code');
    }
  };

  // Calculations
  const calculatedBase = useMemo(() => {
    const baseAmount = parseFloat(amount) || 0;
    const discAmount = parseFloat(discount) || 0;
    return Math.max(0, baseAmount - discAmount);
  }, [amount, discount]);

  const calculatedTax = useMemo(() => {
    const taxRate = (parseFloat(taxPercent) || 0) / 100;
    return calculatedBase * taxRate;
  }, [calculatedBase, taxPercent]);

  const grandTotal = useMemo(() => {
    return calculatedBase + calculatedTax;
  }, [calculatedBase, calculatedTax]);

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!selectedPlan && !amount) {
      notify('Please select a subscription plan or enter amount');
      return;
    }
    const invId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    notify(`Invoice ${invId} created successfully for ₹${grandTotal.toFixed(2)}!`);
    if (onBack) onBack();
  };

  return (
    <div className="create-invoice-page">
      {/* Top Page Header */}
      <div className="create-invoice-header">
        <div className="title-group">
          <h1>Create Invoice</h1>
          <p className="subtitle">Thursday, July 23, 2026</p>
        </div>
      </div>

      {/* Hero Header Card with Step Badges */}
      <div className="invoice-hero-card">
        <div className="hero-left">
          <h2>Create Subscription Invoice</h2>
          <p>Generate invoice for gym subscription with proration + GST</p>
        </div>

        <div className="hero-steps-badges">
          <span className="step-badge step-blue">Step 1: Find Member</span>
          <span className="step-badge step-orange">Step 2: Select Gym</span>
          <span className="step-badge step-green">Step 3: Create</span>
        </div>
      </div>

      {/* Main Form Container Card */}
      <div className="invoice-form-card">
        <form onSubmit={handleCreateInvoice} className="form-sections-wrapper">
          {/* SECTION 1: Find Member */}
          <div className="form-block-card">
            <label className="form-field-label">Find Member (ID or Mobile) *</label>
            <div className="search-field-row">
              <input
                type="text"
                className="form-input-text"
                placeholder="Enter Member ID or Mobile Number"
                value={memberQuery}
                onChange={(e) => setMemberQuery(e.target.value)}
              />
              <button
                type="button"
                className="btn-search-navy"
                onClick={() => notify(`Searching member matching "${memberQuery}"...`)}
              >
                Search
              </button>
            </div>
          </div>

          {/* SECTION 2: Select Gym */}
          <div className="form-block-card">
            <label className="form-field-label">Select Gym *</label>
            <select
              className="form-select-box"
              value={selectedGymId}
              onChange={(e) => setSelectedGymId(e.target.value)}
            >
              {gymData ? (
                <option value={gymData.id || 'gym-1'}>
                  {gymData.name} ({gymData.code || gymData.id || '019778'})
                </option>
              ) : (
                <>
                  <option value="">Search member to load gyms</option>
                  <option value="gym-1">Core fitness gym (019778)</option>
                  <option value="gym-2">Kodexive Gym (000001)</option>
                  <option value="gym-3">MD Fitness Gym (000002)</option>
                </>
              )}
            </select>
          </div>

          {/* SECTION 3: Subscription Plan */}
          <div className="form-block-card">
            <label className="form-field-label">Subscription Plan *</label>
            <select
              className="form-select-box"
              value={selectedPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
            >
              <option value="">Select a plan</option>
              {samplePlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - ₹{p.price}
                </option>
              ))}
            </select>
          </div>

          {/* SECTION 4: Calculations Row */}
          <div className="form-block-card">
            <div className="calculations-grid-3col">
              <div className="calc-field">
                <label>Amount (₹)</label>
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Auto from plan"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="calc-field">
                <label>Tax %</label>
                <input
                  type="text"
                  className="form-input-text"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                />
              </div>

              <div className="calc-field">
                <label>Discount (₹)</label>
                <input
                  type="text"
                  className="form-input-text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: Promo Code */}
          <div className="form-block-card">
            <label className="form-field-label">Promo Code</label>
            <div className="search-field-row">
              <input
                type="text"
                className="form-input-text"
                placeholder="e.g., SAVE10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                type="button"
                className="btn-apply-gray"
                onClick={handleApplyPromo}
              >
                Apply
              </button>
            </div>
          </div>

          {/* SECTION 6: Calculation Summary Box */}
          <div className="calculation-summary-box">
            <div className="summary-row">
              <span className="summary-label">Base (after credit & discount)</span>
              <span className="summary-value">₹{calculatedBase.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Tax</span>
              <span className="summary-value">₹{calculatedTax.toFixed(2)}</span>
            </div>

            <div className="summary-row grand-total-row">
              <span className="grand-total-label">Grand Total</span>
              <span className="grand-total-value">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* SECTION 7: Footer Action Buttons */}
          <div className="invoice-footer-actions">
            <button type="submit" className="btn-create-invoice-orange">
              Create Invoice
            </button>

            <button
              type="button"
              className="btn-cancel-gray"
              onClick={() => (onBack ? onBack() : null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
