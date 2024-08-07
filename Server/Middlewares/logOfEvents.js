import fs from 'fs';
import path from 'path';

// Middleware to log events
const logEvent = (req, res, next) => {
  const logsDir = path.join(__dirname, '..', 'logs');
  
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const logFilePath = path.join(logsDir, `${dateStr}.txt`);

  const logMessage = `${now.toISOString()} - ${req.method} ${req.url}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });

  next();
};

export default logEvent;
