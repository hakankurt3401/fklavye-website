const { spawn } = require('child_process');
const path = require('path');

const appPath = __dirname;
const env = { ...process.env, PORT: process.env.PORT || '3000' };

const handler = spawn('node', ['node_modules/next/dist/bin/next', 'start', '-p', env.PORT], {
  cwd: appPath,
  stdio: 'inherit',
  shell: true,
  env: env
});

handler.on('close', (code) => {
  process.exit(code);
});
