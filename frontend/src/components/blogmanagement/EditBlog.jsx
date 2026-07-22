import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  UploadCloud, 
  Plus, 
  Link, 
  FileText, 
  MapPin, 
  Tag, 
  BookOpen, 
  Send, 
  Search, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  List, 
  ListOrdered,
  Video, 
  Table,
  Quote,
  Maximize2,
  Check,
  X
} from 'lucide-react';
import './AddBlog.css';
import './EditBlog.css';

const defaultBlogBanner = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23db2777"/><stop offset="50%" stop-color="%23831843"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23bg)"/><rect x="25" y="25" width="550" height="350" rx="16" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3"/><text x="300" y="180" fill="%23ffffff" font-family="sans-serif" font-size="42" font-weight="900" text-anchor="middle" letter-spacing="2">BEST</text><text x="300" y="240" fill="%23f472b6" font-family="sans-serif" font-size="52" font-weight="900" text-anchor="middle" letter-spacing="3">LADIES GYM</text></svg>`;

const initialKeywords = [
  'best ladies gym in {city}',
  'ladies gym in {city}',
  "women's gym in {city}",
  'female gym near me',
  'best female fitness center in {city}',
  'zymgoo',
  'Ladies Fitness Center Near Me',
  'Best Gym for Women',
  'gym for weight loss women',
  'Ladies Gym Membership'
];

export default function EditBlog({ blogData, onBack, onActionTrigger }) {
  const [formData, setFormData] = useState({
    title: 'Best Ladies Gym in Zunhebotto (2026)',
    slug: 'post-slug',
    shortDesc: 'Finding the best ladies gym in Zunhebotto is one of the most important steps toward achieving your fitness goals.',
    content: `For many women, a ladies gym offers a comfortable and supportive environment, making it easier to start and maintain a fitness routine.

• Top 10 Gyms in Zunhebotto
• Best Gym Near Me
• Best Fitness Centers in Zunhebotto
• Gym Membership Guide
• Weight Loss Gyms in Zunhebotto`,
    blogMode: 'normal',
    targetCity: 'General Blog (All Cities)',
    ctaText: '',
    ctaUrl: '',
    status: 'Published',
    seoTitle: 'Best Ladies Gym in Zunhebotto (2026) |',
    metaDescription: "Looking for the best ladies gym in Zunhebotto? Discover how to find the right women's fitness center, compare facilities, reviews, trainers...",
    featureImage: defaultBlogBanner,
    updatedDate: '05 Jul 2026'
  });

  const [keywords, setKeywords] = useState(initialKeywords);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    if (blogData) {
      setFormData((prev) => ({
        ...prev,
        title: blogData.title || prev.title,
        slug: blogData.slug || 'post-slug',
        shortDesc: blogData.desc || blogData.shortDesc || prev.shortDesc,
        content: blogData.content || prev.content,
        targetCity: blogData.city || prev.targetCity,
        status: blogData.status || 'Published',
        featureImage: blogData.imageUrl || defaultBlogBanner,
        updatedDate: blogData.date || '05 Jul 2026'
      }));
    }
  }, [blogData]);

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    notify(`Saved changes to "${formData.title}" successfully!`);
    if (onBack) onBack();
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
      notify(`Added keyword "${newKeyword.trim()}"`);
    }
  };

  const handleRemoveKeyword = (kwToRemove) => {
    setKeywords(keywords.filter((kw) => kw !== kwToRemove));
  };

  return (
    <div className="edit-blog-page">
      {/* Main Top Header */}
      <div className="edit-blog-main-header">
        <h1>Edit Blog Post</h1>
        <p>Wednesday, July 22, 2026</p>
      </div>

      {/* Sub Actions Bar */}
      <div className="edit-blog-actions-bar">
        <div className="edit-blog-title-group">
          <button className="btn-back-circle" onClick={onBack || (() => window.history.back())}>
            <ArrowLeft size={18} />
          </button>
          <div className="title-sub-text" style={{ flex: 1, minWidth: 0 }}>
            <span className="parent">Blog Management</span>
            <h2>{formData.title}</h2>
          </div>
        </div>

        <div className="add-blog-top-actions">
          <span className="updated-tag-span">Updated {formData.updatedDate}</span>
          <button type="button" className="btn-discard-white" onClick={onBack || (() => window.history.back())}>
            Discard
          </button>
          <button type="button" className="btn-save-orange" onClick={handleSaveChanges}>
            <Check size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveChanges}>
        <div className="add-blog-main-grid">
          {/* LEFT COLUMN */}
          <div className="add-blog-left-col">
            {/* Card 1: Title & Short Desc */}
            <div className="add-blog-card">
              <input 
                type="text" 
                className="blog-title-input" 
                placeholder="Enter blog title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <div className="slug-preview-row">
                <span>zymgoo.com/blog/</span>
                <span className="slug-text">{formData.slug}</span>
                <RefreshCw size={13} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
              </div>

              <textarea 
                className="blog-short-desc-input" 
                rows={2}
                placeholder="Short description..."
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Card 2: Rich Text Content Editor */}
            <div className="add-blog-card">
              <div className="card-title-header">
                <span>Content</span>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Full blog body</span>
              </div>

              <div className="editor-toolbar">
                <button type="button" className="toolbar-btn" title="Undo">↩</button>
                <button type="button" className="toolbar-btn" title="Redo">↪</button>
                <select className="toolbar-select">
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                  <option>Paragraph</option>
                </select>
                <select className="toolbar-select">
                  <option>30px</option>
                  <option>24px</option>
                  <option>18px</option>
                  <option>15px</option>
                </select>
                <button type="button" className="toolbar-btn" title="Bold"><Bold size={15} /></button>
                <button type="button" className="toolbar-btn" title="Italic"><Italic size={15} /></button>
                <button type="button" className="toolbar-btn" title="Underline"><Underline size={15} /></button>
                <button type="button" className="toolbar-btn" title="Strikethrough"><Strikethrough size={15} /></button>
                <button type="button" className="toolbar-btn" title="Bullet List"><List size={15} /></button>
                <button type="button" className="toolbar-btn" title="Numbered List"><ListOrdered size={15} /></button>
                <button type="button" className="toolbar-btn" title="Link"><Link size={15} /></button>
                <button type="button" className="toolbar-btn" title="Image"><ImageIcon size={15} /></button>
                <button type="button" className="toolbar-btn" title="Video"><Video size={15} /></button>
                <button type="button" className="toolbar-btn" title="Table"><Table size={15} /></button>
                <button type="button" className="toolbar-btn" title="Quote"><Quote size={15} /></button>
                <select className="toolbar-select" style={{ color: '#ea580c', fontWeight: 700 }}>
                  <option>{'{ }'}</option>
                  <option>{'{city}'}</option>
                  <option>{'{area}'}</option>
                  <option>{'{gym_list}'}</option>
                </select>
                <button type="button" className="toolbar-btn" title="Fullscreen"><Maximize2 size={14} /></button>
              </div>

              <textarea 
                className="editor-textarea"
                rows={10}
                placeholder="Write your full blog content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />

              <div className="editor-footer-bar">
                <span>p</span>
                <span>{formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words</span>
              </div>
            </div>

            {/* Card 3: Feature Image Banner */}
            <div className="add-blog-card">
              <div className="card-title-header">
                <span>Feature Image</span>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>PNG, JPG, WebP · max 10MB</span>
              </div>

              <div className="uploaded-feature-preview">
                <img 
                  src={formData.featureImage} 
                  alt={formData.title} 
                  className="uploaded-feature-img" 
                  onError={(e) => { e.target.src = defaultBlogBanner; }} 
                />
              </div>

              <label className="dropzone-box" style={{ padding: 20 }}>
                <div className="dropzone-icon-circle">
                  <UploadCloud size={20} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Drop new image or <span style={{ color: '#ea580c' }}>browse</span>
                </div>
                <input type="file" accept="image/*" style={{ display: 'none' }} />
              </label>
            </div>

            {/* Card 4: Call-to-Action Link */}
            <div className="add-blog-card">
              <div className="card-title-header with-icon orange">
                <Link size={18} />
                <span>Call-to-Action Link</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Button Text</label>
                  <input 
                    type="text" 
                    className="modal-input-field" 
                    placeholder="e.g. Read More"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>URL</label>
                  <input 
                    type="text" 
                    className="modal-input-field" 
                    placeholder="https://..."
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="add-blog-right-col">
            {/* Right Card 1: Blog Type */}
            <div className="add-blog-card">
              <div className="card-title-header with-icon blue">
                <FileText size={18} />
                <span>Blog Type</span>
              </div>

              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Choose Blog Mode</span>

              <div 
                className={`blog-mode-radio-card ${formData.blogMode === 'normal' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, blogMode: 'normal' })}
              >
                <input 
                  type="radio" 
                  name="blogMode" 
                  checked={formData.blogMode === 'normal'} 
                  readOnly 
                />
                <div>
                  <div className="mode-info-title">📣 Normal Blog</div>
                  <div className="mode-info-desc">Write blog manually for one city or general</div>
                </div>
              </div>

              <div 
                className={`blog-mode-radio-card ${formData.blogMode === 'variable' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, blogMode: 'variable' })}
              >
                <input 
                  type="radio" 
                  name="blogMode" 
                  checked={formData.blogMode === 'variable'} 
                  readOnly 
                />
                <div>
                  <div className="mode-info-title">🎯 Variable Blog</div>
                  <div className="mode-info-desc">Use {'{city}'} variable to auto-generate for all cities</div>
                </div>
              </div>
            </div>

            {/* Right Card 2: Available Variables */}
            <div className="add-blog-card">
              <div className="card-title-header with-icon green">
                <Tag size={18} />
                <span>Available Variables</span>
              </div>

              <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                Use these in title/content for auto city blogs. They auto-replace with DB data:
              </span>

              <div className="var-pill-box purple">
                <code>{'{city}'}</code>
                <span className="desc">City name (e.g. Moradabad)</span>
              </div>

              <div className="var-pill-box green">
                <code>{'{area}'}</code>
                <span className="desc">Area/locality name — generates per area inside each city</span>
              </div>

              <div className="var-pill-box purple">
                <code>{'{state}'}</code>
                <span className="desc">State name (e.g. Uttar Pradesh)</span>
              </div>

              <div className="var-pill-box orange">
                <code>{'{gym_list}'}</code>
                <span className="desc">Top 10 gyms with images, rating, reviews, features, fee, area link</span>
              </div>

              <div className="var-pill-box orange">
                <code>{'{gym_table}'}</code>
                <span className="desc">Top 15 gyms table with #, Name, Rating, Type, Address, Phone, Fee</span>
              </div>
            </div>

            {/* Right Card 3: Hyperlocal Target City */}
            <div className="add-blog-card">
              <div className="card-title-header with-icon purple">
                <MapPin size={18} />
                <span>Hyperlocal</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Target City (Optional)</label>
                <select 
                  className="modal-select-field"
                  value={formData.targetCity}
                  onChange={(e) => setFormData({ ...formData, targetCity: e.target.value })}
                >
                  <option value="General Blog (All Cities)">General Blog (All Cities)</option>
                  <option value="Zunhebotto">Zunhebotto</option>
                  <option value="Moradabad">Moradabad</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Delhi">Delhi</option>
                </select>
                <span style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.35 }}>
                  Leave empty for general blog, or select a city for hyperlocal content
                </span>
              </div>
            </div>

            {/* Right Card 4: Publish Settings */}
            <div className="add-blog-card">
              <div className="card-title-header with-icon orange">
                <Send size={18} />
                <span>Publish</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Status</label>
                <select 
                  className="modal-select-field"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Published">✅ Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <button type="submit" className="btn-save-orange" style={{ width: '100%', justifyContent: 'center' }}>
                Save Changes
              </button>

              <button 
                type="button" 
                className="btn-discard-white" 
                style={{ width: '100%' }}
                onClick={onBack || (() => window.history.back())}
              >
                Cancel
              </button>
            </div>

            {/* Right Card 5: SEO Settings & Focus Keywords */}
            <div className="add-blog-card">
              <div className="card-title-header with-icon blue">
                <Search size={18} />
                <span>SEO Settings</span>
              </div>

              <span style={{ fontSize: 11.5, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Google Preview
              </span>

              <div className="google-preview-box">
                <div className="google-title">
                  {formData.seoTitle || formData.title || 'Best Ladies Gym in Zunheb...'}
                </div>
                <div className="google-url">
                  zymgoo.com › blog › {formData.slug}
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                  {formData.metaDescription || formData.shortDesc || 'Looking for the best ladies gym in Zunhebotto? Discover how to find the...'}
                </div>
              </div>

              {/* SEO Title Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>SEO Title</label>
                  <span style={{ fontSize: 11.5, color: formData.seoTitle.length > 60 ? '#ef4444' : '#94a3b8', fontWeight: 600 }}>
                    {formData.seoTitle.length} / 60
                  </span>
                </div>
                <input 
                  type="text" 
                  className="modal-input-field" 
                  placeholder="Custom title for search engines..."
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                />
                <div className={`seo-progress-bar ${formData.seoTitle.length > 60 ? 'red' : 'green'}`} />
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Ideal: 50-60 characters</span>
              </div>

              {/* Meta Description Textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Meta Description</label>
                  <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>
                    {formData.metaDescription.length} / 160
                  </span>
                </div>
                <textarea 
                  className="modal-input-field" 
                  rows={3}
                  placeholder="Describe this post for search engines..."
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
                <div className="seo-progress-bar green" />
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Ideal: 120-160 characters</span>
              </div>

              {/* Focus Keywords Tag Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Focus Keywords</label>

                <div className="focus-keywords-container">
                  {keywords.map((kw, idx) => (
                    <span key={idx} className="keyword-tag-pill">
                      {kw}
                      <button type="button" className="btn-remove-tag" onClick={() => handleRemoveKeyword(kw)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="add-keyword-row">
                  <input 
                    type="text" 
                    className="add-keyword-input" 
                    placeholder="Add keyword, press Enter"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddKeyword(e);
                    }}
                  />
                  <button type="button" className="btn-add-keyword-navy" onClick={handleAddKeyword}>
                    Add
                  </button>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Press Enter or click Add</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
