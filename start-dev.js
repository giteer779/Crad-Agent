import { spawn } from 'child_process';
import path from 'path';

// Define the root workspace path
const rootDir = process.cwd();

console.log('🚀 Starting Command Center Decoupled Environment...');

// Spawn backend server process
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'backend'),
  shell: true,
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`[Backend] ${data}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`[Backend Error] ${data}`);
});

// Spawn frontend server process
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'frontend'),
  shell: true,
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`[Frontend] ${data}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`[Frontend Error] ${data}`);
});

// Clean termination handlers
const cleanup = () => {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
