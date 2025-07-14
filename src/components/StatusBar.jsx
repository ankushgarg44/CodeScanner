import React from 'react';

const StatusBar = ({ isConnected, currentScan }) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Current Scan Status */}
      {currentScan && (
        <div className="flex items-center space-x-2 bg-red-100 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-800 font-medium">
            Scanning: {currentScan.qr_id}
          </span>
        </div>
      )}

      {/* System Status */}
      <div className="text-xs text-gray-500">
        QR Visualization System
      </div>
    </div>
  );
};

export default StatusBar; 