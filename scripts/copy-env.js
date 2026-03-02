import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check possible safe directory locations above the web root on Hostinger
const possiblePaths = [
  path.resolve(__dirname, '../../secrets/.env'),
  path.resolve(__dirname, '../../config/.env'),
];

const localEnvPath = path.resolve(__dirname, '../.env');

let copied = false;

for (const secretPath of possiblePaths) {
  if (fs.existsSync(secretPath)) {
    fs.copyFileSync(secretPath, localEnvPath);
    console.log(`✅ Safe deployment: Copied .env from ${secretPath} into project root.`);
    copied = true;
    break;
  }
}

if (!copied) {
  console.log('ℹ️ Safe deployment: No safe .env found in parent directories. Assuming local development (skipping copy).');
}
