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
  List, 
  Video, 
  Table 
} from 'lucide-react';
import './AddBlog.css';

export default function AddBlog({ blogData, onBack, onActionTrigger }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: 'auto-generated-slug',
    shortDesc: '',
    content: '',
    blogMode: 'variable', // default to 'variable' mode as per user request
    targetCity: 'General Blog (All Cities)',
    ctaText: '',
    ctaUrl: '',
    status: 'Draft',
    seoTitle: '',
    metaDescription: '',
    featureImage: null,
    additionalImages: []
  });

  useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.title || '',
        slug: blogData.slug || (blogData.title ? blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'auto-generated-slug'),
        shortDesc: blogData.desc || blogData.shortDesc || '',
        content: blogData.content || blogData.desc || 'Finding the best ladies gym in {city} is essential for wellness and daily workout routines. Explore top certified trainers, cardio equipment, and flexible timings in {area}, {city}.',
        blogMode: blogData.blogMode || 'variable',
        targetCity: blogData.city || 'General Blog (All Cities)',
        ctaText: blogData.ctaText || 'Read More',
        ctaUrl: blogData.ctaUrl || 'https://zymgoo.com',
        status: blogData.status || 'Published',
        seoTitle: blogData.seoTitle || blogData.title || '',
        metaDescription: blogData.metaDescription || blogData.desc || '',
        featureImage: blogData.imageUrl || null,
        additionalImages: []
      });
    }
  }, [blogData]);

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: generatedSlug || 'auto-generated-slug'
    }));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    notify(`Published ${formData.blogMode === 'variable' ? 'Variable' : 'Normal'} post "${formData.title || 'Untitled Post'}" successfully!`);
    if (onBack) onBack();
  };

  return (
    <div className="add-blog-page">
      {/* Top Header Bar */}
      <div className="add-blog-top-bar">
        <div className="add-blog-title-group">
          <button className="btn-back-circle" onClick={onBack || (() => window.history.back())}>
            <ArrowLeft size={18} />
          </button>
          <div className="title-sub-text">
            <span className="parent">Blog Management</span>
            <h1>Create New Post</h1>
          </div>
        </div>

        <div className="add-blog-top-actions">
          <button className="btn-discard-white" onClick={onBack || (() => window.history.back())}>
            Discard
          </button>
          <button className="btn-publish-orange" onClick={handlePublish}>
            <Send size={16} />
            <span>Publish Post</span>
          </button>
        </div>
      </div>

      <form onSubmit={handlePublish}>
        <div className="add-blog-main-grid">
          {/* LEFT COLUMN (Main Content Cards) */}
          <div className="add-blog-left-col">
            {/* Card 1: Blog Title & Slug */}
            <div className="add-blog-card">
              <input 
                type="text" 
                className="blog-title-input" 
                placeholder="Enter your blog title here..."
                value={formData.title}
                onChange={handleTitleChange}
              />

              <div className="slug-preview-row">
                <span>zymgoo.com/blog/</span>
                <span className="slug-text">{formData.slug}</span>
                <RefreshCw size={13} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
              </div>

              <input 
                type="text" 
                className="blog-short-desc-input" 
                placeholder="Short description — shown in blog listing cards..."
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
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
                  <option>Paragraph</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                </select>
                <select className="toolbar-select">
                  <option>15px</option>
                  <option>14px</option>
                  <option>16px</option>
                  <option>18px</option>
                </select>
                <button type="button" className="toolbar-btn" title="Bold"><Bold size={15} /></button>
                <button type="button" className="toolbar-btn" title="Italic"><Italic size={15} /></button>
                <button type="button" className="toolbar-btn" title="List"><List size={15} /></button>
                <button type="button" className="toolbar-btn" title="Link"><Link size={15} /></button>
                <button type="button" className="toolbar-btn" title="Image"><ImageIcon size={15} /></button>
                <button type="button" className="toolbar-btn" title="Video"><Video size={15} /></button>
                <button type="button" className="toolbar-btn" title="Table"><Table size={15} /></button>
              </div>

              <textarea 
                className="editor-textarea"
                placeholder="Write your full blog content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />

              <div className="editor-footer-bar">
                <span>p</span>
                <span>{formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words</span>
              </div>
            </div>

            {/* Card 3: Feature Image */}
            <div className="add-blog-card">
              <div className="card-title-header">
                <span>Feature Image</span>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>PNG, JPG, WebP · max 10MB</span>
              </div>

              <label className="dropzone-box">
                <div className="dropzone-icon-circle">
                  <UploadCloud size={24} />
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>
                  Drop image here or <span style={{ color: '#ea580c' }}>browse</span>
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Recommended: 1200×630px</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} />
              </label>
            </div>

            {/* Card 4: Additional Images */}
            <div className="add-blog-card">
              <div className="card-title-header">
                <span>Additional Images</span>
                <button type="button" className="btn-discard-white" style={{ fontSize: 12, padding: '6px 14px' }}>
                  <Plus size={14} /> Add Images
                </button>
              </div>

              <label className="dropzone-box" style={{ padding: 24 }}>
                <div className="dropzone-icon-circle">
                  <ImageIcon size={22} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Click to add multiple images
                </div>
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Each image can have its own title</span>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} />
              </label>
            </div>

            {/* Card 5: Call-to-Action Link */}
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

          {/* RIGHT COLUMN (Settings & Variables Sidebar) */}
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

              {formData.blogMode === 'variable' && (
                <div className="guide-box blue" style={{ marginTop: 6, fontSize: 12 }}>
                  <strong>💡 Template Mode</strong>
                  <span>Use {'{city}'} / {'{area}'} in title, description, or content. Filter by type: {'{gym_list:Yoga Center}'}, {'{gym_table:Ladies Gym}'}, {'{gym_count:Weight Loss}'}</span>
                  <span style={{ fontStyle: 'italic', color: '#1e3a8a', marginTop: 2 }}>
                    "Best {'{gym_list:Yoga Center}'} in {'{area}'}, {'{city}'}"
                  </span>
                </div>
              )}
            </div>

            {/* Right Card 2: Target City (Hidden in Variable Mode as per screenshot) */}
            {formData.blogMode === 'normal' && (
              <div className="add-blog-card">
                <div className="card-title-header with-icon purple">
                  <MapPin size={18} />
                  <span>Target City</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Select City (Optional)</label>
                  <select 
                    className="modal-select-field"
                    value={formData.targetCity}
                    onChange={(e) => setFormData({ ...formData, targetCity: e.target.value })}
                  >
                    <option value="General Blog (All Cities)">General Blog (All Cities)</option>
                    <option value="Moradabad">Moradabad</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Ranchi">Ranchi</option>
                  </select>
                  <span style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.35 }}>
                    Leave empty for general blog, or select a city for hyperlocal content
                  </span>
                </div>
              </div>
            )}

            {/* Right Card 3: Available Variables */}
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
                <span className="desc">Top 10 gyms with rating, reviews, features, fee, area link — links to zymgoo.com</span>
              </div>

              <div className="var-pill-box orange">
                <code>{'{gym_list:Type}'}</code>
                <span className="desc">Filtered list — e.g. {'{gym_list:Yoga Center}'}, {'{gym_list:Ladies Gym}'}</span>
              </div>

              <div className="guide-box yellow" style={{ background: '#fffbe8', color: '#b45309', border: '1px solid #fef3c7' }}>
                💡 Use Variable Blog mode + {'{city}'} for city blogs, add {'{area}'} to generate per area!
              </div>
            </div>

            {/* Right Card 4: Variable Guide */}
            <div className="add-blog-card">
              <div className="card-title-header with-icon blue">
                <BookOpen size={18} />
                <span>Variable Guide</span>
              </div>

              <div className="guide-box blue">
                <strong>🚀 Quick Start</strong>
                <span>Select "Variable Blog" mode, use {'{city}'} in your title/content. Every active city gets its own blog automatically.</span>
              </div>

              <div className="guide-box purple">
                <strong>🎯 Type Filtering (New)</strong>
                <span>Add :Type after any gym variable to filter:</span>
                <span>• {'{gym_list:Yoga Center}'} — only yoga centers</span>
                <span>• {'{gym_table:Ladies Gym}'} — ladies gym table</span>
                <span>• {'{gym_count:Weight Loss}'} — weight loss count</span>
                <span>• {'{gym_types:CrossFit}'} — filtered types</span>
                <span style={{ fontSize: 11, color: '#9333ea', marginTop: 4 }}>
                  Type name case-insensitive hai, exact match filter hota hai.
                </span>
              </div>

              <div className="guide-box green">
                <strong>📍 Area Generation</strong>
                <span>Add {'{area}'} in title/content. System har city ke har active area ke liye alag blog banayega.</span>
              </div>
            </div>

            {/* Right Card 5: Publish Settings */}
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
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <button type="submit" className="btn-publish-orange" style={{ width: '100%', justifyContent: 'center' }}>
                Publish Post
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

            {/* Right Card 6: SEO Settings */}
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
                  {formData.seoTitle || formData.title || 'Your blog title will appear he...'}
                </div>
                <div className="google-url">
                  zymgoo.com › blog › {formData.slug}
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                  {formData.metaDescription || formData.shortDesc || 'Your meta description will appear here. Make it compelling to improve click-...'}
                </div>
              </div>

              {/* SEO Title Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>SEO Title</label>
                  <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{formData.seoTitle.length} / 60</span>
                </div>
                <input 
                  type="text" 
                  className="modal-input-field" 
                  placeholder="Custom title for search engines..."
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                />
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Ideal: 50-60 characters</span>
              </div>

              {/* Meta Description Textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Meta Description</label>
                  <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{formData.metaDescription.length} / 160</span>
                </div>
                <textarea 
                  className="modal-input-field" 
                  rows={3}
                  placeholder="Describe this post for search engines..."
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Ideal: 120-160 characters</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

