import React from 'react';

const ScanHistory = ({ scans }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const sortedScans = [...scans].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="space-y-3">
      {sortedScans.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">📋</div>
          <p>No scans yet</p>
          <p className="text-sm">QR code scans will appear here</p>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {sortedScans.map((scan) => (
            <div
              key={scan.id}
              className={`p-3 rounded-lg border-l-4 ${
                scan.manual 
                  ? 'bg-blue-50 border-blue-400' 
                  : 'bg-green-50 border-green-400'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      {scan.qr_id}
                    </span>
                    {scan.manual && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Manual
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {scan.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(scan.timestamp)}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  ({scan.x}, {scan.y})
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {scans.length > 0 && (
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Total scans: {scans.length}
        </div>
      )}
    </div>
  );
};

export default ScanHistory; 