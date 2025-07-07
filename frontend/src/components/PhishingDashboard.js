import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const PhishingDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [submittedFilter, setSubmittedFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hoveredCol, setHoveredCol] = useState(null); // 👈 track hovered column

  const fetchLogs = useCallback(async () => {
    try {
      const params = {
        page,
        limit,
        ...(userIdFilter && { user_id: userIdFilter }),
        ...(submittedFilter && { submitted: submittedFilter }),
        ...(startDate && endDate && { startDate, endDate }),
      };

      const res = await axios.get('http://localhost:5000/api/phishing/logs', { params });
      setLogs(res.data.logs || res.data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  }, [page, limit, userIdFilter, submittedFilter, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleExportCSV = () => {
    const headers = ['User ID', 'Email', 'Password', 'Submitted?', 'IP Address', 'User Agent', 'Timestamp'];
    const rows = logs.map(log => [
      log.user_id,
      log.email,
      log.password,
      log.submitted_credentials ? 'Yes' : 'No',
      log.ip_address,
      log.user_agent,
      new Date(log.timestamp).toLocaleString(),
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'phishing_logs.csv';
    link.click();
  };

  const thStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: '#e1eaff',
    color: '#333',
  };

  const tdBaseStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'left',
  };

  // Column highlighting logic
  const getColStyle = (colIndex) => {
    return {
      ...tdBaseStyle,
      backgroundColor: hoveredCol === colIndex ? '#d2e6ff' : 'inherit',
    };
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3>📊 Phishing Logs Dashboard</h3>

      <div style={{ marginBottom: '1rem' }}>
        <label>User ID: </label>
        <input value={userIdFilter} onChange={e => setUserIdFilter(e.target.value)} />

        <label style={{ marginLeft: '1rem' }}>Submitted: </label>
        <select value={submittedFilter} onChange={e => setSubmittedFilter(e.target.value)}>
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <label style={{ marginLeft: '1rem' }}>From: </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

        <label style={{ marginLeft: '0.5rem' }}>To: </label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

        <button style={{ marginLeft: '1rem' }} onClick={fetchLogs}>
          Filter
        </button>

        <button style={{ marginLeft: '1rem' }} onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead>
          <tr>
            {['User ID', 'Email', 'Password', 'Submitted?', 'IP', 'User Agent', 'Time'].map((header, i) => (
              <th
                key={i}
                style={{
                  ...thStyle,
                  backgroundColor: hoveredCol === i ? '#cbe2ff' : thStyle.backgroundColor,
                }}
                onMouseEnter={() => setHoveredCol(i)}
                onMouseLeave={() => setHoveredCol(null)}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, rowIndex) => (
            <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              <td style={getColStyle(0)}>{log.user_id}</td>
              <td style={getColStyle(1)}>{log.email}</td>
              <td style={getColStyle(2)}>{log.password ? '••••••••' : 'N/A'}</td>
              <td style={getColStyle(3)}>{log.submitted_credentials ? '✅' : '❌'}</td>
              <td style={getColStyle(4)}>{log.ip_address}</td>
              <td style={getColStyle(5)}>{log.user_agent}</td>
              <td style={getColStyle(6)}>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span style={{ margin: '0 1rem' }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default PhishingDashboard;
