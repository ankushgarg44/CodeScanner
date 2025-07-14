import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import QRMap from './QRMap.jsx';
import ScanHistory from './ScanHistory.jsx';
import ManualScan from './ManualScan.jsx';
import StatusBar from './StatusBar.jsx';

const QRVisualization = () => {
  const [qrMappings, setQrMappings] = useState({});
  const [qrScans, setQrScans] = useState([]);
  const [currentScan, setCurrentScan] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [robotPosition, setRobotPosition] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socketRef.current.on('qr-mappings', (mappings) => {
      setQrMappings(mappings);
    });

    socketRef.current.on('qr-scans', (scans) => {
      setQrScans(scans);
    });

    socketRef.current.on('qr-scan', (scan) => {
      setQrScans(prev => [...prev, scan]);
      setCurrentScan(scan);
      
      // Clear current scan after 3 seconds
      setTimeout(() => {
        setCurrentScan(null);
      }, 3000);
    });

    // Load initial data
    const loadInitialData = async () => {
      try {
        const [mappingsRes, scansRes] = await Promise.all([
          axios.get('http://localhost:3001/qr-mappings'),
          axios.get('http://localhost:3001/qr-scans')
        ]);
        
        setQrMappings(mappingsRes.data);
        setQrScans(scansRes.data);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleManualScan = async (qrId) => {
    try {
      const response = await axios.post('http://localhost:3001/manual-scan', { qr_id: qrId });
      console.log('Manual scan successful:', response.data);
    } catch (error) {
      console.error('Error with manual scan:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900"></h1>
              <p className="text-sm text-gray-600">Real-time QR code detection and mapping</p>
            </div>
            <StatusBar isConnected={isConnected} currentScan={currentScan} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Map</h2>
              <QRMap 
                qrMappings={qrMappings}
                qrScans={qrScans}
                currentScan={currentScan}
                robotPosition={robotPosition}
                onQRClick={handleManualScan}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Manual Scan */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Manual Scan</h2>
              <ManualScan 
                qrMappings={qrMappings}
                onScan={handleManualScan}
              />
            </div>

            {/* Scan History */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan History</h2>
              <ScanHistory scans={qrScans} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRVisualization; 