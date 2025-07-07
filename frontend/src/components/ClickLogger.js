import React from 'react';
import axios from 'axios';

const ClickLogger = () => {
  const handleClick = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/phishing/click', {
        user_id: 'fedley123',
      });

      alert(response.data.message);
    } catch (error) {
      console.error('Click failed:', error);
      alert('Click failed. Check backend server or connection.');
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Simulate Click</h2>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
};

export default ClickLogger;
