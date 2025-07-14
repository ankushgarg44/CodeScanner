# Robot QR Scanner Visualization

A responsive web application that visualizes the location of a robot as it scans QR codes placed in a mapped environment. Built with React.js, TailwindCSS, and Node.js.

## Features

- **Real-time QR Code Visualization**: Live updates when QR codes are scanned
- **Interactive Map**: Click on QR markers to trigger manual scans
- **Scan History**: Complete log of all QR code scans with timestamps
- **Manual Override**: Manually trigger scans for any QR code
- **WebSocket Integration**: Real-time communication between robot and frontend
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
my-react-app/
├── backend/
│   ├── package.json
│   └── server.js
├── src/
│   ├── components/
│   │   ├── QRVisualization.jsx
│   │   ├── QRMap.jsx
│   │   ├── ScanHistory.jsx
│   │   ├── ManualScan.jsx
│   │   └── StatusBar.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
cd Projects/my-react-app
npm install socket.io-client
```

### 2. Install Backend Dependencies

```bash
cd Projects/my-react-app/backend
npm install
```

### 3. Start the Backend Server

```bash
cd Projects/my-react-app/backend
npm run dev
```

The backend will start on `http://localhost:3001`

### 4. Start the Frontend Development Server

```bash
cd Projects/my-react-app
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### POST /qr-location
Accepts QR scan data from the robot.

**Request Body:**
```json
{
  "qr_id": "B104",
  "x": 12.5,
  "y": 8.1
}
```

**Response:**
```json
{
  "success": true,
  "scan": {
    "id": 1703123456789,
    "qr_id": "B104",
    "x": 350,
    "y": 50,
    "timestamp": "2023-12-21T10:30:45.123Z",
    "message": "QR Code B104 detected at (350, 50)"
  }
}
```

### GET /qr-mappings
Returns all available QR code locations.

### GET /qr-scans
Returns all scan history.

### POST /manual-scan
Triggers a manual scan for a specific QR code.

**Request Body:**
```json
{
  "qr_id": "B104"
}
```

## WebSocket Events

- `qr-scan`: Emitted when a new QR code is scanned
- `qr-mappings`: Emitted when QR mappings are updated
- `qr-scans`: Emitted when scan history is updated

## QR Code Mappings

The system includes 15 pre-defined QR codes arranged in a 5x3 grid:

- **Row 1**: B101, B102, B103, B104, B105
- **Row 2**: B201, B202, B203, B204, B205  
- **Row 3**: B301, B302, B303, B304, B305

## Testing the Application

### 1. Manual Testing
- Click on any QR code marker on the map to trigger a manual scan
- Use the dropdown in the "Manual Scan" panel to select and scan QR codes
- View scan history in the "Scan History" panel

### 2. Robot Integration Testing
Send a POST request to test robot integration:

```bash
curl -X POST http://localhost:3001/qr-location \
  -H "Content-Type: application/json" \
  -d '{"qr_id": "B104", "x": 350, "y": 50}'
```

### 3. WebSocket Testing
Connect to the WebSocket server to test real-time updates:

```javascript
const socket = io('http://localhost:3001');
socket.on('qr-scan', (data) => {
  console.log('New scan:', data);
});
```

## Features in Detail

### Map Visualization
- Grid-based layout with QR code markers
- Color-coded markers: Blue (available), Green (scanned), Red (currently scanning)
- Animated markers for active scans
- Click-to-scan functionality

### Real-time Updates
- WebSocket connection for instant updates
- Connection status indicator
- Automatic reconnection handling

### Scan History
- Chronological list of all scans
- Distinguishes between manual and robot scans
- Shows coordinates and timestamps
- Scrollable interface for large histories

### Manual Override
- Dropdown selection of all available QR codes
- One-click manual scan triggering
- Visual feedback for selected QR codes

## Customization

### Adding New QR Codes
Edit the `qrMappings` object in `backend/server.js`:

```javascript
const qrMappings = {
  "B106": { x: 550, y: 50, label: "B106" },
  // Add more QR codes here
};
```

### Modifying Map Layout
Adjust the map dimensions in `src/components/QRMap.jsx`:

```javascript
const mapWidth = 600;  // Change map width
const mapHeight = 400; // Change map height
const scale = 0.8;     // Change scale factor
```

### Styling
The application uses TailwindCSS for styling. Modify classes in any component to change the appearance.

## Troubleshooting

### Connection Issues
- Ensure the backend server is running on port 3001
- Check that CORS is properly configured
- Verify WebSocket connection in browser console

### QR Code Not Found
- Check that the QR ID exists in the `qrMappings` object
- Verify the API request format

### Frontend Not Updating
- Check WebSocket connection status
- Verify that Socket.IO client is properly installed
- Check browser console for errors

## Future Enhancements

- Database integration for persistent storage
- User authentication and authorization
- Multiple robot support
- Advanced mapping features (custom floor plans)
- Analytics and reporting
- Mobile app version
# Qrscan
# CodeScanner
# CodeScanner
