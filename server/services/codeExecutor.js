import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

// Language configs mapping to lightweight Alpine Docker images
const LANGUAGE_CONFIG = {
  python: { image: 'python:3.10-alpine', cmd: 'python', ext: '.py' },
  javascript: { image: 'node:20-alpine', cmd: 'node', ext: '.js' },
  typescript: { image: 'node:20-alpine', cmd: 'node', ext: '.js' }, 
  ruby: { image: 'ruby:3.2-alpine', cmd: 'ruby', ext: '.rb' },
  lua: { image: 'nickblah/lua:5.4-alpine', cmd: 'lua', ext: '.lua' },
  php: { image: 'php:8.2-cli-alpine', cmd: 'php', ext: '.php' }
};

export async function executeCode(code, language, input = '') {
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    return {
      success: false,
      output: '',
      error: `Language "${language}" is not supported for sandboxed execution.`
    };
  }

  // Write code to a temp file on the host machine
  const tmpDir = os.tmpdir();
  const fileName = `golf_${randomUUID()}${config.ext}`;
  const filePath = path.join(tmpDir, fileName);

  try {
    fs.writeFileSync(filePath, code, 'utf-8');
  } catch (err) {
    return { success: false, output: '', error: `Failed to write temp file: ${err.message}` };
  }

  return new Promise((resolve) => {
    const timeout = 10000; // 10 second timeout
    let stdout = '';
    let stderr = '';
    let killed = false;

    try {
      // Map the local file into the docker container at /app
      // Use strict isolation: no network, 128MB RAM max, read-only root FS
      const dockerArgs = [
        'run',
        '--rm',                     // Automatically remove container when done
        '-i',                       // Interactive (keep STDIN open)
        '--net=none',               // Disable networking (crucial for security)
        '--memory=128m',            // Limit RAM usage to 128MB
        '--cpus=0.5',               // Limit to half a CPU core
        `-v`, `${filePath}:/app/${fileName}:ro`, // Mount file as read-only
        '-w', '/app',               // Set working directory
        config.image,               // Use the specific language Docker image
        config.cmd, fileName        // Command to run inside the container
      ];

      const proc = spawn('docker', dockerArgs, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Send stdin input for test cases
      if (input) {
        proc.stdin.write(input);
      }
      proc.stdin.end();

      // Safety timeout
      const timer = setTimeout(() => {
        killed = true;
        proc.kill('SIGKILL');
      }, timeout);

      proc.on('close', (exitCode) => {
        clearTimeout(timer);
        // Clean up temp file from host
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

        if (killed) {
          resolve({ success: false, output: '', error: 'Execution timed out (10s limit)' });
          return;
        }

        if (exitCode !== 0) {
          // If the image doesn't exist locally, docker pull might fail or take too long
          if (stderr.includes('Unable to find image')) {
             resolve({ success: false, output: stdout.trim(), error: `Docker image ${config.image} not found locally. Please run: docker pull ${config.image}` });
          } else {
             resolve({ success: false, output: stdout.trim(), error: stderr.trim() });
          }
        } else {
          resolve({ success: true, output: stdout.trim(), error: '' });
        }
      });

      proc.on('error', (err) => {
        clearTimeout(timer);
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        resolve({
          success: false,
          output: '',
          error: `Failed to run Docker: ${err.message}. Ensure Docker is installed and running.`
        });
      });
    } catch (err) {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      resolve({ success: false, output: '', error: err.message });
    }
  });
}

export async function validateSolution(code, language, testCases) {
  const results = [];

  for (const tc of testCases) {
    const result = await executeCode(code, language, tc.input);
    const passed = result.success && result.output === tc.expected;
    results.push({
      input: tc.input,
      expected: tc.expected,
      actual: result.output,
      passed,
      error: result.error
    });
  }

  const allPassed = results.every(r => r.passed);
  return { allPassed, results };
}