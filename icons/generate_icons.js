// Icon download helper for YouTube Playback Manager
// This script downloads placeholder icons for the extension - replace with your own icons for production use

// Canvas helpers to create placeholder icons
function createIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Red YouTube-inspired background
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0, 0, size, size);
  
  // White play/pause symbol
  ctx.fillStyle = 'white';
  
  // Draw a pause/play combo icon
  const padding = size * 0.2;
  const barWidth = size * 0.15;
  
  // Left half - pause icon
  ctx.fillRect(padding, padding, barWidth, size - padding * 2);
  ctx.fillRect(padding + barWidth * 2, padding, barWidth, size - padding * 2);
  
  // Right half - play icon (triangle)
  ctx.beginPath();
  ctx.moveTo(size - padding, size / 2);
  ctx.lineTo(size / 2 + barWidth, padding);
  ctx.lineTo(size / 2 + barWidth, size - padding);
  ctx.closePath();
  ctx.fill();
  
  return canvas.toDataURL('image/png');
}

// Function to download the icon
function downloadIcon(size) {
  const dataUrl = createIcon(size);
  const link = document.createElement('a');
  link.download = `icon${size}.png`;
  link.href = dataUrl;
  link.click();
}

// List of icon sizes needed
const sizes = [16, 32, 48, 128];
sizes.forEach(size => downloadIcon(size));

console.log('Icons generated! Please download them and place them in the icons folder.');
console.log('Note: This is a helper script to generate placeholder icons. Replace with your own icons for production use.');
