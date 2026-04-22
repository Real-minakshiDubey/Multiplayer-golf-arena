import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

// Language configs: cmd to run a file
const LANGUAGE_CONFIG = {
  python: { cmd: 'python', ext: '.py' },
  javascript: { cmd: 'node', ext: '.js' },
  typescript: { cmd: 'node', ext: '.js' },
  ruby: { cmd: 'ruby', ext: '.rb' },
  lua: { cmd: 'lua', ext: '.lua' },
  php: { cmd: 'php', ext: '.php' }
};

export async function executeCode(code, language, input = '') {
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    return {
      success: false,
      output: '',
      error: `Language "${language}" is not supported for local execution.`
    };
  }

  // Write code to a temp file
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
      const proc = spawn(config.cmd, [filePath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: process.platform === 'win32'
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
        // Clean up temp file
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

        if (killed) {
          resolve({ success: false, output: '', error: 'Execution timed out (10s limit)' });
          return;
        }

        if (exitCode !== 0) {
          resolve({ success: false, output: stdout.trim(), error: stderr.trim() });
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
          error: `Failed to run ${language}: ${err.message}. Make sure the runtime is installed.`
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