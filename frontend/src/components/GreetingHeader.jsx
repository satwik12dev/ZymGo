import React from 'react';
import { Plus, UserPlus } from 'lucide-react';

const GreetingHeader = React.memo(function GreetingHeader({ currentUser, onOpenAddGym, onOpenAddOwner }) {
  const name = currentUser?.name || currentUser?.username || 'Kodexive';
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="greeting-section">
      <div className="greeting-text">
        <h2>Good morning, {name} 👋</h2>
        <p>{currentDateStr} · Here's what's happening today</p>
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
});

export default GreetingHeader;
