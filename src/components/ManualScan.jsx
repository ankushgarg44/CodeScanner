import React, { useState } from 'react';

const ManualScan = ({ qrMappings, onScan }) => {
  const [selectedQR, setSelectedQR] = useState('');

  const handleScan = () => {
    if (selectedQR) {
      onScan(selectedQR);
      setSelectedQR('');
    }
  };

  const qrIds = Object.keys(qrMappings).sort();

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="qr-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select QR Code
        </label>
        <select
          id="qr-select"
          value={selectedQR}
          onChange={(e) => setSelectedQR(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a QR code...</option>
          {qrIds.map((qrId) => (
            <option key={qrId} value={qrId}>
              {qrId} - ({qrMappings[qrId].x}, {qrMappings[qrId].y})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleScan}
        disabled={!selectedQR}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          selectedQR
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Trigger Manual Scan
      </button>

      {selectedQR && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong> {selectedQR}
          </p>
          <p className="text-sm text-blue-600">
            Location: ({qrMappings[selectedQR].x}, {qrMappings[selectedQR].y})
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        Click on any QR code marker on the map to trigger a scan
      </div>
    </div>
  );
};

export default ManualScan; 