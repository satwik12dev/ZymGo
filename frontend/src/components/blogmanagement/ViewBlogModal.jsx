import React from 'react';
import { X, Edit } from 'lucide-react';
import './ViewBlogModal.css';

const defaultBlogBanner = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23db2777"/><stop offset="50%" stop-color="%23831843"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23bg)"/><rect x="25" y="25" width="550" height="350" rx="16" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3"/><text x="300" y="180" fill="%23ffffff" font-family="sans-serif" font-size="42" font-weight="900" text-anchor="middle" letter-spacing="2">BEST</text><text x="300" y="240" fill="%23f472b6" font-family="sans-serif" font-size="52" font-weight="900" text-anchor="middle" letter-spacing="3">LADIES GYM</text></svg>`;

export default function ViewBlogModal({ isOpen, blog, onClose, onEdit }) {
  if (!isOpen || !blog) return null;

  const cityName = blog.city || 'Zunhebotto';

  return (
    <div className="view-blog-modal-backdrop" onClick={onClose}>
      <div className="view-blog-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="view-blog-modal-header">
          <h3>Blog Preview</h3>
          <button className="btn-close-modal-x" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="view-blog-modal-body">
          <img 
            src={blog.imageUrl || defaultBlogBanner} 
            alt={blog.title} 
            className="view-blog-cover-img" 
            onError={(e) => { e.target.src = defaultBlogBanner; }} 
          />

          {/* Meta Tag & Date Row */}
          <div className="view-blog-meta-tags">
            <span className="pill-status-published-lowercase">
              published
            </span>
            <span className="view-blog-date-text">
              {blog.date || '05 Jul 2026'}
            </span>
          </div>

          {/* Main Title */}
          <h2 className="view-blog-main-title">
            {blog.title || `Best Ladies Gym in ${cityName} (2026) – How to Find the Right Women's Fitness Center`}
          </h2>

          {/* Subtitle / Lead text */}
          <p className="view-blog-lead-text">
            {blog.desc || `Finding the best ladies gym in ${cityName} is one of the most important steps toward achieving your fitness goals.`}
          </p>

          {/* Full Blog Article Content */}
          <div className="view-blog-content-body">
            <h3 className="blog-section-heading">
              Best Ladies Gym in {cityName} – Complete Guide for Women
            </h3>

            <p>
              Finding the <strong>best ladies gym in {cityName}</strong> is one of the most important steps toward achieving your fitness goals. Whether you're looking to lose weight, stay fit, improve strength, or simply adopt a healthier lifestyle, choosing the right women's fitness center can make a huge difference.
            </p>

            <p>
              Today, many women search online using keywords like "<span className="kw-orange-bold">Best Ladies Gym Near Me</span>", "<span className="kw-navy-underline">Women's Gym in {cityName}</span>", or "<span className="kw-orange-underline">Female Fitness Center Near Me</span>" before purchasing a membership. But with so many options available, selecting the perfect gym can be confusing.
            </p>

            <p>
              That's why we've created this guide to help you choose the best ladies gym in <strong>{cityName}</strong>.
            </p>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="view-blog-modal-footer">
          <button className="btn-modal-cancel" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn-modal-save-orange" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={() => {
              onClose();
              if (onEdit) onEdit(blog);
            }}
          >
            <Edit size={14} />
            <span>Edit Blog</span>
          </button>
        </div>
      </div>
    </div>
  );
}
