import fs from 'fs';
import path from 'path';

const logEvent = (message) => {
  const logsDir = path.join(process.cwd(), 'logs'); // Use process.cwd() to get the current working directory
  
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; 
  const logFilePath = path.join(logsDir, `${dateStr}.txt`);

  const logMessage = `${now.toISOString()} - ${message}\n`;
  
  // Append the log message to the file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });
};

export default logEvent;
