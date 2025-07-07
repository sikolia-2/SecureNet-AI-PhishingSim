import React from 'react';
import PhishingForms from './components/PhishingForms';
import PhishingDashboard from './components/PhishingDashboard'; // 👈 use the new dashboard

function App() {
  return (
    <div>
      <PhishingForms />
      <hr />
      <PhishingDashboard />
    </div>
  );
}

export default App;
