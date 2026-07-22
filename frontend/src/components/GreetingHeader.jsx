import React from 'react';
import { Plus, UserPlus } from 'lucide-react';

export default function GreetingHeader({ onOpenAddGym, onOpenAddOwner }) {
  return (
    <div className="greeting-section">
      <div className="greeting-text">
        <h2>Good morning, Kodexive 👋</h2>
        <p>Wednesday, 22 July 2026 · Here's what's happening today</p>
      </div>

      <div className="greeting-actions">
        <button className="btn-secondary" onClick={onOpenAddGym}>
          <Plus size={18} />
          <span>Add Gym</span>
        </button>

        <button className="btn-primary" onClick={onOpenAddOwner}>
          <UserPlus size={18} />
          <span>Add Owner</span>
        </button>
      </div>
    </div>
  );
}
