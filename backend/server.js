import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for QR data
const qrScans = [];
const qrMappings = {
  "B101": { x: 50, y: 50, label: "B101" },
  "B102": { x: 150, y: 50, label: "B102" },
  "B103": { x: 250, y: 50, label: "B103" },
  "B104": { x: 350, y: 50, label: "B104" },
  "B105": { x: 450, y: 50, label: "B105" },
  "B201": { x: 50, y: 150, label: "B201" },
  "B202": { x: 150, y: 150, label: "B202" },
  "B203": { x: 250, y: 150, label: "B203" },
  "B204": { x: 350, y: 150, label: "B204" },
  "B205": { x: 450, y: 150, label: "B205" },
  "B301": { x: 50, y: 250, label: "B301" },
  "B302": { x: 150, y: 250, label: "B302" },
  "B303": { x: 250, y: 250, label: "B303" },
  "B304": { x: 350, y: 250, label: "B304" },
  "B305": { x: 450, y: 250, label: "B305" }
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current QR mappings to new client
  socket.emit('qr-mappings', qrMappings);
  socket.emit('qr-scans', qrScans);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.post('/qr-location', (req, res) => {
  const { qr_id, x, y } = req.body;
  
  if (!qr_id) {
    return res.status(400).json({ error: 'QR ID is required' });
  }
  
  // Use provided coordinates or get from mappings
  const coordinates = x && y ? { x: parseFloat(x), y: parseFloat(y) } : qrMappings[qr_id];
  
  if (!coordinates) {
    return res.status(404).json({ error: 'QR code not found in mappings' });
  }
  
  const scanData = {
    id: Date.now(),
    qr_id,
    x: coordinates.x,
    y: coordinates.y,
    timestamp: new Date().toISOString(),
    message: `QR Code ${qr_id} detected at (${coordinates.x}, ${coordinates.y})`
  };
  
  qrScans.push(scanData);
  
  // Emit to all connected clients
  io.emit('qr-scan', scanData);
  
  res.json({ success: true, scan: scanData });
});

app.get('/qr-mappings', (req, res) => {
  res.json(qrMappings);
});

app.get('/qr-scans/', (req, res) => {
  res.json(qrScans);
});

app.post('/manual-scan', (req, res) => {
  const { qr_id } = req.body;
  
  if (!qr_id || !qrMappings[qr_id]) {
    return res.status(404).json({ error: 'QR code not found' });
  }
  
  const coordinates = qrMappings[qr_id];
  const scanData = {
    id: Date.now(),
    qr_id,
    x: coordinates.x,
    y: coordinates.y,
    timestamp: new Date().toISOString(),
    message: `QR Code ${qr_id} manually selected at (${coordinates.x}, ${coordinates.y})`,
    manual: true
  };
  
  qrScans.push(scanData);
  io.emit('qr-scan', scanData);
  
  res.json({ success: true, scan: scanData });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready for real-time updates`);
}); 