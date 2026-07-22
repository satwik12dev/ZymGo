import React, { useState, useMemo } from 'react';
import { Search, Download, FileSpreadsheet } from 'lucide-react';
import './CityReport.css';

const initialCityReportData = [
  { city: 'Agra', total: 200, approved: 200, pending: 0, rejected: 0, seoDone: 197, seoNot: 3, placeId: 200, noPlaceId: 0, images: 4129, imgYes: 193, imgNo: 7 },
  { city: 'Ahmedabad', total: 105, approved: 105, pending: 0, rejected: 0, seoDone: 105, seoNot: 0, placeId: 0, noPlaceId: 105, images: 734, imgYes: 94, imgNo: 11 },
  { city: 'Ajmer', total: 100, approved: 0, pending: 100, rejected: 0, seoDone: 0, seoNot: 100, placeId: 100, noPlaceId: 0, images: 0, imgYes: 0, imgNo: 100 },
  { city: 'Aligarh', total: 138, approved: 108, pending: 30, rejected: 0, seoDone: 108, seoNot: 30, placeId: 138, noPlaceId: 0, images: 1962, imgYes: 121, imgNo: 17 },
  { city: 'Alwar', total: 80, approved: 0, pending: 80, rejected: 0, seoDone: 0, seoNot: 80, placeId: 80, noPlaceId: 0, images: 1331, imgYes: 73, imgNo: 7 },
  { city: 'Ambala', total: 51, approved: 0, pending: 51, rejected: 0, seoDone: 0, seoNot: 51, placeId: 51, noPlaceId: 0, images: 884, imgYes: 49, imgNo: 2 },
  { city: 'Ambedkar Nagar', total: 37, approved: 37, pending: 0, rejected: 0, seoDone: 37, seoNot: 0, placeId: 37, noPlaceId: 0, images: 527, imgYes: 33, imgNo: 4 },
  { city: 'Amritsar', total: 173, approved: 0, pending: 173, rejected: 0, seoDone: 0, seoNot: 173, placeId: 173, noPlaceId: 0, images: 1635, imgYes: 104, imgNo: 69 },
  { city: 'Amroha', total: 30, approved: 30, pending: 0, rejected: 0, seoDone: 24, seoNot: 6, placeId: 0, noPlaceId: 30, images: 237, imgYes: 28, imgNo: 2 },
  { city: 'Asansol', total: 43, approved: 0, pending: 43, rejected: 0, seoDone: 0, seoNot: 43, placeId: 43, noPlaceId: 0, images: 0, imgYes: 0, imgNo: 43 },
  { city: 'Ayodhya', total: 17, approved: 17, pending: 0, rejected: 0, seoDone: 17, seoNot: 0, placeId: 17, noPlaceId: 0, images: 272, imgYes: 16, imgNo: 1 },
  { city: 'Bengaluru', total: 420, approved: 380, pending: 40, rejected: 0, seoDone: 360, seoNot: 60, placeId: 390, noPlaceId: 30, images: 8450, imgYes: 375, imgNo: 45 },
  { city: 'Bhopal', total: 110, approved: 95, pending: 15, rejected: 0, seoDone: 90, seoNot: 20, placeId: 100, noPlaceId: 10, images: 2150, imgYes: 92, imgNo: 18 },
  { city: 'Jamshedpur', total: 95, approved: 95, pending: 0, rejected: 0, seoDone: 95, seoNot: 0, placeId: 95, noPlaceId: 0, images: 1840, imgYes: 90, imgNo: 5 },
  { city: 'Lucknow', total: 210, approved: 185, pending: 25, rejected: 0, seoDone: 180, seoNot: 30, placeId: 195, noPlaceId: 15, images: 4200, imgYes: 180, imgNo: 30 },
  { city: 'Patna', total: 85, approved: 70, pending: 15, rejected: 0, seoDone: 65, seoNot: 20, placeId: 75, noPlaceId: 10, images: 1420, imgYes: 68, imgNo: 17 },
  { city: 'Ranchi', total: 78, approved: 78, pending: 0, rejected: 0, seoDone: 78, seoNot: 0, placeId: 78, noPlaceId: 0, images: 1510, imgYes: 74, imgNo: 4 }
];

export default function CityReport({ onActionTrigger }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return initialCityReportData.filter((row) =>
      row.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleExportCSV = () => {
    const headers = ['City,Total,Approved,Pending,Rejected,SEO Done,SEO Not,Place ID,No Place ID,Images,Img Yes,Img No'];
    const rows = filteredData.map(r => 
      `"${r.city}",${r.total},${r.approved},${r.pending},${r.rejected},${r.seoDone},${r.seoNot},${r.placeId},${r.noPlaceId},${r.images},${r.imgYes},${r.imgNo}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zymgoo_city_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onActionTrigger) onActionTrigger(`Exported City Report for ${filteredData.length} cities`);
  };

  return (
    <div className="city-report-page">
      {/* Header */}
      <div className="city-report-header">
        <h1>Gym City Report</h1>
        <p>City-wise gym breakdown — approval status, SEO, Place ID & media</p>
      </div>

      {/* 8 Stat Cards Row */}
      <div className="city-stats-grid">
        <div className="city-stat-card grey">
          <span className="city-stat-number">17855</span>
          <span className="city-stat-label">Total Gyms</span>
        </div>

        <div className="city-stat-card green">
          <span className="city-stat-number">12788</span>
          <span className="city-stat-label">Approved</span>
        </div>

        <div className="city-stat-card orange">
          <span className="city-stat-number">5067</span>
          <span className="city-stat-label">Pending</span>
        </div>

        <div className="city-stat-card red">
          <span className="city-stat-number">0</span>
          <span className="city-stat-label">Rejected</span>
        </div>

        <div className="city-stat-card blue">
          <span className="city-stat-number">10154</span>
          <span className="city-stat-label">SEO Done</span>
        </div>

        <div className="city-stat-card grey">
          <span className="city-stat-number">7701</span>
          <span className="city-stat-label">SEO Not Done</span>
        </div>

        <div className="city-stat-card teal">
          <span className="city-stat-number">11730</span>
          <span className="city-stat-label">Place ID Set</span>
        </div>

        <div className="city-stat-card dark-orange">
          <span className="city-stat-number">6125</span>
          <span className="city-stat-label">Place ID Empty</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="city-table-filter-bar">
        <div className="city-search-box">
          <Search size={16} />
          <input 
            type="text" 
            className="city-search-input" 
            placeholder="Search city name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn-bulk-upload" onClick={handleExportCSV}>
          <FileSpreadsheet size={16} />
          <span>Export City Report</span>
        </button>
      </div>

      {/* City Breakdown Table Card */}
      <div className="city-table-card">
        <div className="table-responsive">
          <table className="city-custom-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Total</th>
                <th className="col-approved">Approved</th>
                <th className="col-pending">Pending</th>
                <th className="col-rejected">Rejected</th>
                <th className="col-seo-done">SEO Done</th>
                <th className="col-seo-not">SEO Not</th>
                <th className="col-place-id">Place ID</th>
                <th className="col-no-place-id">No Place ID</th>
                <th>Images</th>
                <th className="col-img-yes">Img Yes</th>
                <th className="col-img-no">Img No</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.city}>
                  <td className="city-name-cell">{row.city}</td>
                  <td style={{ fontWeight: 700 }}>{row.total}</td>
                  <td className="val-approved">{row.approved}</td>
                  <td className="val-pending">{row.pending}</td>
                  <td className="val-rejected">{row.rejected}</td>
                  <td className="val-seo-done">{row.seoDone}</td>
                  <td className="val-seo-not">{row.seoNot}</td>
                  <td className="val-place-id">{row.placeId}</td>
                  <td className="val-no-place-id">{row.noPlaceId}</td>
                  <td style={{ fontWeight: 600 }}>{row.images}</td>
                  <td className="val-img-yes">{row.imgYes}</td>
                  <td className="val-img-no">{row.imgNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
