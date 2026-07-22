import React from 'react';
import { Lock } from 'lucide-react';
import './Version.css';

const initialVersionsList = [
  {
    id: 1,
    oldVersion: 'V.0.0.0.2',
    newVersion: '1.0.0',
    link: 'https://play.google.com/store/apps/details?id=com.zymgoopartner.maya&pcampaignid=web_share',
    usedBy: 'member',
    type: 'ios',
    updatedAt: '03-07-2026 03:18 PM'
  },
  {
    id: 2,
    oldVersion: 'V.0.0.0.1',
    newVersion: '1.0.0',
    link: 'https://play.google.com/store/apps/details?id=com.zymgoo.maya&pcampaignid=web_share',
    usedBy: 'member',
    type: 'android',
    updatedAt: '03-07-2026 03:17 PM'
  },
  {
    id: 3,
    oldVersion: 'V.0.0.0.1',
    newVersion: 'V.0.0.0.2',
    link: 'https://play.google.com/store/apps/details?id=com.zymgoopartner.maya&pcampaignid=web_share',
    usedBy: 'crm',
    type: 'ios',
    updatedAt: '10:09 AM 02-07-2026'
  },
  {
    id: 4,
    oldVersion: 'V.0.0.0.1',
    newVersion: 'V.0.0.0.2',
    link: 'https://play.google.com/store/apps/details?id=com.zymgoopartner.maya&pcampaignid=web_share',
    usedBy: 'crm',
    type: 'android',
    updatedAt: '10:09 AM 02-07-2026'
  }
];

export default function Version({ onActionTrigger, onNavigateToRoles }) {
  return (
    <div className="version-page">
      {/* Title Header */}
      <div className="version-hero-header">
        <div className="version-hero-title">
          <h1>Version</h1>
          <p>Admin accounts and their access roles</p>
        </div>

        <button
          className="btn-roles-permissions-link"
          onClick={() => {
            if (onNavigateToRoles) onNavigateToRoles();
            if (onActionTrigger) onActionTrigger('Navigated to Roles & Permissions');
          }}
        >
          <Lock size={16} />
          <span>Roles & Permissions</span>
        </button>
      </div>

      {/* Version History Table Box */}
      <div className="version-table-card-box">
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="version-custom-table">
            <thead>
              <tr>
                <th>OLD VERSION</th>
                <th>NEW VERSION</th>
                <th>LINK</th>
                <th>USED BY</th>
                <th>TYPE</th>
                <th>UPDATED AT</th>
              </tr>
            </thead>
            <tbody>
              {initialVersionsList.map((ver) => (
                <tr key={ver.id}>
                  <td className="old-ver-text">{ver.oldVersion}</td>
                  <td className="new-ver-text">{ver.newVersion}</td>
                  <td className="ver-link-text">
                    <a
                      href={ver.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#64748b', textDecoration: 'none' }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (onActionTrigger) onActionTrigger(`Opened store link: ${ver.link}`);
                      }}
                    >
                      {ver.link}
                    </a>
                  </td>
                  <td className="used-by-text">{ver.usedBy}</td>
                  <td>
                    <span className="type-pill-tag">{ver.type}</span>
                  </td>
                  <td className="updated-at-text">{ver.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
