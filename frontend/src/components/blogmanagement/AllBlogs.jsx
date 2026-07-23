import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Edit3,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Zap,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import ViewBlogModal from './ViewBlogModal';
import api from '../../services/api';
import './AllBlogs.css';

const defaultBlogBanner = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23db2777"/><stop offset="50%" stop-color="%23831843"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23bg)"/><rect x="15" y="15" width="270" height="170" rx="10" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/><text x="150" y="90" fill="%23ffffff" font-family="sans-serif" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="1">BEST</text><text x="150" y="125" fill="%23f472b6" font-family="sans-serif" font-size="26" font-weight="900" text-anchor="middle" letter-spacing="2">LADIES GYM</text><circle cx="50" cy="150" r="14" fill="%23ec4899" opacity="0.4"/><circle cx="250" cy="50" r="20" fill="%23a855f7" opacity="0.3"/></svg>`;

const initialBlogs = [
  {
    id: 1,
    num: 1,
    title: 'Best Ladies Gym in Zunhebotto (2026) – ...',
    desc: 'Finding the best ladies gym in Zunhebotto is one of the top choices for fitness enthusiasts in 2026...',
    type: 'Auto',
    city: 'Zunhebotto',
    status: 'Published',
    date: '05 Jul 2026',
    imageUrl: defaultBlogBanner
  },
  {
    id: 2,
    num: 2,
    title: 'Best Ladies Gym in Yusufpur Isapur (20...',
    desc: 'Finding the best ladies gym in Yusufpur Isapur is essential for wellness and daily workout routines...',
    type: 'Auto',
    city: 'Yusufpur Isapur',
    status: 'Published',
    date: '05 Jul 2026',
    imageUrl: defaultBlogBanner
  },
  {
    id: 3,
    num: 3,
    title: 'Best Ladies Gym in Yavatmal (2026) – H...',
    desc: 'Finding the best ladies gym in Yavatmal is one of the premier steps to achieve your fitness targets...',
    type: 'Auto',
    city: 'Yavatmal',
    status: 'Published',
    date: '05 Jul 2026',
    imageUrl: defaultBlogBanner
  },
  {
    id: 4,
    num: 4,
    title: 'Best Ladies Gym in Yamunanagar (2026...',
    desc: 'Finding the best ladies gym in Yamunanagar is top tier for fitness motivation...',
    type: 'Auto',
    city: 'Yamunanagar',
    status: 'Published',
    date: '05 Jul 2026',
    imageUrl: defaultBlogBanner
  },
  {
    id: 5,
    num: 5,
    title: 'Best Ladies Gym in Yadgir (2026) – How ...',
    desc: 'Finding the best ladies gym in Yadgir is one of the best ways to kickstart your healthy lifestyle journey...',
    type: 'Auto',
    city: 'Yadgir',
    status: 'Published',
    date: '05 Jul 2026',
    imageUrl: defaultBlogBanner
  }
];

export default function AllBlogs({ onActionTrigger, onNavigateToAdd, onNavigateToEdit }) {
  const [blogsList, setBlogsList] = useState(initialBlogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [viewModal, setViewModal] = useState({ isOpen: false, blog: null });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await api.blogs.getBlogs();
        if (res.success && res.blogs && res.blogs.length > 0) {
          const mapped = res.blogs.map((b, i) => ({
            id: b.id,
            num: i + 1,
            title: b.title,
            desc: b.content ? b.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : '',
            type: b.author ? 'Manual' : 'Auto',
            city: b.city || 'General',
            status: b.status === 1 || b.status === 'published' ? 'Published' : 'Draft',
            date: b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Today',
            imageUrl: b.image ? (b.image.startsWith('http') ? b.image : `http://localhost:3000/${b.image}`) : defaultBlogBanner
          }));
          setBlogsList(mapped);
        }
      } catch (err) {
        console.warn('Using default blogs list:', err.message);
      }
    }
    loadBlogs();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(blogsList.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteBlog = async (id, title) => {
    try {
      await api.blogs.deleteBlog(id);
    } catch (err) {
      console.warn('Delete blog API error:', err.message);
    }
    setBlogsList((prev) => prev.filter((b) => b.id !== id));
    notify(`Deleted blog post "${title}"`);
  };

  const filteredBlogs = blogsList.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || b.status === statusFilter;
    const matchesCity = cityFilter === 'All Cities' || b.city === cityFilter;
    return matchesSearch && matchesStatus && matchesCity;
  });

  return (
    <div className="all-blogs-page">
      {/* Top Header Bar */}
      <div className="all-blogs-header-row">
        <div className="all-blogs-title-group">
          <h1>Blog Management</h1>
          <p>Wednesday, July 22, 2026</p>
        </div>

        <button
          className="btn-new-blog-orange"
          onClick={() => {
            if (onNavigateToAdd) onNavigateToAdd();
            notify('Navigated to Add New Blog');
          }}
        >
          <Plus size={16} />
          <span>New Blog Post</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="blogs-stat-cards-grid">
        <div className="blog-stat-card">
          <div className="blog-stat-icon-circle blue">
            <FileText size={22} />
          </div>
          <div className="blog-stat-info">
            <span className="blog-stat-num">2326</span>
            <span className="blog-stat-lbl">Total Blogs</span>
          </div>
        </div>

        <div className="blog-stat-card">
          <div className="blog-stat-icon-circle green">
            <CheckCircle2 size={22} />
          </div>
          <div className="blog-stat-info">
            <span className="blog-stat-num">2326</span>
            <span className="blog-stat-lbl">Published</span>
          </div>
        </div>

        <div className="blog-stat-card">
          <div className="blog-stat-icon-circle yellow">
            <Edit3 size={22} />
          </div>
          <div className="blog-stat-info">
            <span className="blog-stat-num">0</span>
            <span className="blog-stat-lbl">Drafts</span>
          </div>
        </div>

        <div className="blog-stat-card">
          <div className="blog-stat-icon-circle orange">
            <Calendar size={22} />
          </div>
          <div className="blog-stat-info">
            <span className="blog-stat-num">1548</span>
            <span className="blog-stat-lbl">This Month</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="blogs-control-filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="blogs-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>

        <select
          className="blogs-filter-select"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="All Cities">All Cities</option>
          <option value="Zunhebotto">Zunhebotto</option>
          <option value="Yusufpur Isapur">Yusufpur Isapur</option>
          <option value="Yavatmal">Yavatmal</option>
          <option value="Yamunanagar">Yamunanagar</option>
          <option value="Yadgir">Yadgir</option>
        </select>

        <select
          className="blogs-filter-select"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>

        <button className="btn-search-navy" onClick={() => notify(`Searching blogs for "${searchQuery}"...`)}>
          Search
        </button>
      </div>

      {/* Table Card */}
      <div className="all-blogs-table-card">
        <div className="table-top-meta-row">
          <span className="blogs-count-text">2326 blogs found</span>
          <span className="blogs-showing-text">Showing 1–20</span>
        </div>

        <div className="table-responsive">
          <table className="blogs-custom-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === blogsList.length && blogsList.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>#</th>
                <th>IMAGE</th>
                <th>TITLE & DESCRIPTION</th>
                <th>TYPE</th>
                <th>CITY</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((b) => (
                <tr key={b.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(b.id)}
                      onChange={() => handleSelectRow(b.id)}
                    />
                  </td>
                  <td style={{ color: '#94a3b8', fontWeight: 600 }}>{b.num}</td>
                  <td>
                    <img
                      src={b.imageUrl || defaultBlogBanner}
                      alt={b.title}
                      className="blog-row-thumb"
                      onError={(e) => { e.target.src = defaultBlogBanner; }}
                    />
                  </td>
                  <td>
                    <div className="blog-title-desc-group">
                      <span className="blog-title-text">{b.title}</span>
                      <span className="blog-desc-snippet">{b.desc}</span>
                    </div>
                  </td>
                  <td>
                    <span className="pill-type-auto">
                      <Zap size={12} />
                      {b.type}
                    </span>
                  </td>
                  <td>
                    <span className="pill-city-purple">
                      <MapPin size={12} />
                      {b.city}
                    </span>
                  </td>
                  <td>
                    <span className={b.status === 'Published' ? 'pill-status-published' : 'pill-status-draft'}>
                      • {b.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#475569', whiteSpace: 'nowrap' }}>
                    {b.date || '05 Jul 2026'}
                  </td>
                  <td>
                    <div className="blog-actions-row">
                      <button
                        className="btn-blog-action-icon view"
                        title="View Blog"
                        onClick={() => setViewModal({ isOpen: true, blog: b })}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn-blog-action-icon edit"
                        title="Edit Blog"
                        onClick={() => {
                          if (onNavigateToEdit) onNavigateToEdit(b);
                          else if (onNavigateToAdd) onNavigateToAdd(b);
                          notify(`Editing blog "${b.title}"`);
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn-blog-action-icon delete"
                        title="Delete Blog"
                        onClick={() => setDeleteModal({ isOpen: true, id: b.id, title: b.title })}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="blogs-table-footer">
          <div className="pagination-pills-row">
            <button className="btn-pagination-nav" disabled={currentPage === 1}>
              <ChevronLeft size={14} /> Prev
            </button>
            <button className="btn-page-num-pill active">1</button>
            <button className="btn-page-num-pill">2</button>
            <button className="btn-page-num-pill">3</button>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>...</span>
            <button className="btn-page-num-pill">117</button>
            <button className="btn-pagination-nav">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* View Blog Modal */}
      <ViewBlogModal
        isOpen={viewModal.isOpen}
        blog={viewModal.blog}
        onClose={() => setViewModal({ isOpen: false, blog: null })}
        onEdit={(blogToEdit) => {
          if (onNavigateToEdit) onNavigateToEdit(blogToEdit);
          else if (onNavigateToAdd) onNavigateToAdd(blogToEdit);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Blog Post"
        itemName={deleteModal.title}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={() => {
          handleDeleteBlog(deleteModal.id, deleteModal.title);
          setDeleteModal({ isOpen: false, id: null, title: '' });
        }}
      />
    </div>
  );
}

