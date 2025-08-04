const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting development environment...\n');

// Start backend server
const backend = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '5000'
  }
});

console.log('📡 Backend server starting on port 5000...');

// Start frontend development server
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    VITE_SERVER_URL: 'http://localhost:5000'
  }
});

console.log('🌐 Frontend development server starting on port 5173...\n');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

// Handle backend exit
backend.on('close', (code) => {
  console.log(`\n❌ Backend server exited with code ${code}`);
  frontend.kill('SIGINT');
  process.exit(code);
});

// Handle frontend exit
frontend.on('close', (code) => {
  console.log(`\n❌ Frontend server exited with code ${code}`);
  backend.kill('SIGINT');
  process.exit(code);
}); 