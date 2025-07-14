import React from 'react';

const QRMap = ({ qrMappings, qrScans, currentScan, robotPosition, onQRClick }) => {
  const mapWidth = 600;
  const mapHeight = 400;
  const scale = 0.8;

  // Get the latest scan for each QR code
  const latestScans = {};
  qrScans.forEach(scan => {
    if (!latestScans[scan.qr_id] || new Date(scan.timestamp) > new Date(latestScans[scan.qr_id].timestamp)) {
      latestScans[scan.qr_id] = scan;
    }
  });

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        className="relative bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden"
        style={{ 
          width: mapWidth * scale, 
          height: mapHeight * scale,
          margin: '0 auto'
        }}
      >
        {/* Grid Lines */}
        <svg 
          width="100%" 
          height="100%" 
          className="absolute inset-0"
          style={{ width: mapWidth * scale, height: mapHeight * scale }}
        >
          {/* Vertical grid lines */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line
              key={`v-${i}`}
              x1={(i * 100) * scale}
              y1={0}
              x2={(i * 100) * scale}
              y2={mapHeight * scale}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Horizontal grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={(i * 100) * scale}
              x2={mapWidth * scale}
              y2={(i * 100) * scale}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* QR Code Markers */}
        {Object.entries(qrMappings).map(([qrId, mapping]) => {
          const isScanned = latestScans[qrId];
          const isCurrentScan = currentScan && currentScan.qr_id === qrId;
          
          return (
            <div
              key={qrId}
              className={`absolute cursor-pointer transition-all duration-300 ${
                isCurrentScan ? 'z-20' : 'z-10'
              }`}
              style={{
                left: (mapping.x - 15) * scale,
                top: (mapping.y - 15) * scale,
                transform: isCurrentScan ? 'scale(1.2)' : 'scale(1)'
              }}
              onClick={() => onQRClick(qrId)}
            >
              {/* QR Code Marker */}
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold
                ${isCurrentScan 
                  ? 'bg-red-500 border-red-600 text-white shadow-lg animate-pulse' 
                  : isScanned 
                    ? 'bg-green-500 border-green-600 text-white' 
                    : 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600'
                }
              `}>
                {qrId.replace('B', '')}
              </div>
              
              {/* QR Code Label */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {qrId}
              </div>
            </div>
          );
        })}

        {/* Robot Position (if available) */}
        {robotPosition && (
          <div
            className="absolute z-30"
            style={{
              left: (robotPosition.x - 10) * scale,
              top: (robotPosition.y - 10) * scale,
            }}
          >
            <div className="w-5 h-5 bg-purple-600 border-2 border-purple-700 rounded-full animate-ping"></div>
            <div className="w-5 h-5 bg-purple-600 border-2 border-purple-700 rounded-full absolute top-0 left-0"></div>
          </div>
        )}

        {/* Current Scan Message */}
        {currentScan && (
          <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 shadow-lg z-30">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-red-800 font-medium">{currentScan.message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Available QR Codes</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span>Scanned QR Codes</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span>Currently Scanning</span>
        </div>
        {robotPosition && (
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-600 rounded-full mr-2"></div>
            <span>Robot Position</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRMap; 