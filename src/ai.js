const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

// Configuration path: ~/.giti/config.json
const CONFIG_DIR = path.join(os.homedir(), '.giti');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const SECRET_FILE = path.join(CONFIG_DIR, 'secret.key');
const WINDOWS_KEYCHAIN_FILE = path.join(CONFIG_DIR, 'keychain.dat');
const RATE_LIMIT_FILE = path.join(CONFIG_DIR, 'usage.json');

// Put your emergency backup keys here if you want to provide a free tier.
// For the public version, we leave this empty to prevent key leakage.
const BACKUP_KEYS = [];

const API_HOSTNAME = 'api.groq.com';
const API_PATH = '/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';
const CONFIG_DIR_MODE = 0o700;
const CONFIG_FILE_MODE = 0o600;
const SECRET_FILE_MODE = 0o600;
const RATE_LIMIT_MAX_REQUESTS = 4;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_DUPLICATE_WINDOW_MS = 60 * 1000;
const ALGO = 'aes-256-gcm';
const IV_BYTES = 12;

let currentBackupIndex = 0;

let currentEnvIndex = 0;

function readLocalEnvApiKey() {
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return null;

    const env = fs.readFileSync(envPath, 'utf8');
    const lines = env.split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^['\"]|['\"]$/g, '');
        if (key === 'GITI_API_KEY' && value) {
            return value;
        }
    }

    return null;
}

function ensureSecureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: CONFIG_DIR_MODE });
    }
}

function removeFileIfExists(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (e) {
        // Ignore cleanup failures.
    }
}

function runPowerShell(script, env = {}, input) {
    const encodedCommand = Buffer.from(script, 'utf16le').toString('base64');
    const result = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-EncodedCommand', encodedCommand], {
        env: { ...process.env, ...env },
        input,
        encoding: 'utf8'
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(result.stderr || 'PowerShell command failed.');
    }

    return String(result.stdout || '').trim();
}

function canUseWindowsKeychain() {
    return process.platform === 'win32';
}

function writeWindowsKeychain(key) {
    ensureSecureConfigDir();

    const script = `
$secure = ConvertTo-SecureString $env:GITI_PLAIN_KEY -AsPlainText -Force
$blob = ConvertFrom-SecureString $secure
[Console]::Out.Write($blob)
`;

    const blob = runPowerShell(script, { GITI_PLAIN_KEY: String(key) });
    fs.writeFileSync(WINDOWS_KEYCHAIN_FILE, blob, { mode: CONFIG_FILE_MODE });
    removeFileIfExists(SECRET_FILE);
}

function readWindowsKeychain() {
    if (!fs.existsSync(WINDOWS_KEYCHAIN_FILE)) return null;

    const blob = fs.readFileSync(WINDOWS_KEYCHAIN_FILE, 'utf8').trim();
    if (!blob) return null;

    const script = `
$blob = [Console]::In.ReadToEnd().Trim()
if ([string]::IsNullOrWhiteSpace($blob)) { exit 1 }
$secure = ConvertTo-SecureString $blob
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
    [Console]::Out.Write($plain)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}
`;

    return runPowerShell(script, {}, blob);
}

function getSecretFromEnv() {
    const raw = process.env.GITI_CONFIG_SECRET;
    if (!raw) return null;

    try {
        const key = Buffer.from(raw, 'base64');
        if (key.length === 32) return key;
    } catch (e) {
        // ignore malformed env secret
    }

    return null;
}

function getOrCreateConfigSecret() {
    const envSecret = getSecretFromEnv();
    if (envSecret) return envSecret;

    ensureSecureConfigDir();

    if (fs.existsSync(SECRET_FILE)) {
        const raw = fs.readFileSync(SECRET_FILE, 'utf8').trim();
        const key = Buffer.from(raw, 'base64');
        if (key.length === 32) return key;
    }

    const key = crypto.randomBytes(32);
    fs.writeFileSync(SECRET_FILE, key.toString('base64'), { mode: SECRET_FILE_MODE });
    return key;
}

function encryptApiKey(plain) {
    const key = getOrCreateConfigSecret();
    const iv = crypto.randomBytes(IV_BYTES);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const encrypted = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `v1:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

function decryptApiKey(encoded) {
    if (!encoded || typeof encoded !== 'string') return null;

    const parts = encoded.split(':');
    if (parts.length !== 4 || parts[0] !== 'v1') return null;

    const key = getOrCreateConfigSecret();
    const iv = Buffer.from(parts[1], 'base64');
    const tag = Buffer.from(parts[2], 'base64');
    const encrypted = Buffer.from(parts[3], 'base64');

    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8').trim() || null;
}

function writeConfig(config) {
    ensureSecureConfigDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), { mode: CONFIG_FILE_MODE });
}

function normalizeQuery(query) {
    return String(query || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function hashQuery(query) {
    return crypto.createHash('sha256').update(normalizeQuery(query)).digest('hex');
}

function readRateLimitState() {
    ensureSecureConfigDir();

    if (!fs.existsSync(RATE_LIMIT_FILE)) {
        return { requests: [], lastQueries: {} };
    }

    try {
        const state = JSON.parse(fs.readFileSync(RATE_LIMIT_FILE, 'utf8'));
        return {
            requests: Array.isArray(state.requests) ? state.requests.filter(n => Number.isFinite(Number(n))) : [],
            lastQueries: state.lastQueries && typeof state.lastQueries === 'object' ? state.lastQueries : {}
        };
    } catch (e) {
        return { requests: [], lastQueries: {} };
    }
}

function writeRateLimitState(state) {
    ensureSecureConfigDir();
    fs.writeFileSync(RATE_LIMIT_FILE, JSON.stringify(state, null, 2), { mode: CONFIG_FILE_MODE });
}

function checkAiRateLimit(query) {
    const now = Date.now();
    const queryHash = hashQuery(query);
    const state = readRateLimitState();

    const recentRequests = state.requests.filter((timestamp) => now - Number(timestamp) < RATE_LIMIT_WINDOW_MS);
    const lastQueryAt = Number(state.lastQueries[queryHash] || 0);

    if (now - lastQueryAt < RATE_LIMIT_DUPLICATE_WINDOW_MS) {
        const retryAfterMs = RATE_LIMIT_DUPLICATE_WINDOW_MS - (now - lastQueryAt);
        return {
            allowed: false,
            message: `Too many repeated AI requests for the same query. Try again in ${Math.ceil(retryAfterMs / 1000)}s.`
        };
    }

    if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
        const oldest = Math.min(...recentRequests);
        const retryAfterMs = Math.max(0, RATE_LIMIT_WINDOW_MS - (now - oldest));
        return {
            allowed: false,
            message: `AI request rate limit reached. Try again in ${Math.ceil(retryAfterMs / 1000)}s.`
        };
    }

    recentRequests.push(now);
    state.requests = recentRequests;
    state.lastQueries[queryHash] = now;
    writeRateLimitState(state);

    return { allowed: true };
}

function sanitizeCommand(raw) {
    return String(raw || '')
        .replace(/^`+|`+$/g, '')
        .trim();
}

function isSafeGitCommand(command) {
    if (!command) return false;
    if (!/^git(?:\s|$)/i.test(command)) return false;
    if (/[\r\n]/.test(command)) return false;
    // Block shell control operators and redirection characters.
    if (/[;&|><`$]/.test(command)) return false;
    return true;
}

/**
 * Gets the API key from environment, config file, or fallback list.
 */
function getApiKey() {
    // 0. Load .env file if it exists (for local dev)
    const envKey = readLocalEnvApiKey();
    if (envKey) {
        process.env.GITI_API_KEY = envKey;
    }

    // 1. Check Environment Variable
    if (process.env.GITI_API_KEY) {
        const keys = process.env.GITI_API_KEY
            .split(',')
            .map(k => k.trim())
            .filter(Boolean);
        if (keys.length === 0) return { key: null, source: 'none' };

        const key = keys[currentEnvIndex % keys.length];
        return { 
            key: key, 
            source: 'env',
            keyCount: keys.length,
            rotate: () => { currentEnvIndex++; }
        };
    }

    // 2. Check local OS-backed keychain on Windows.
    if (canUseWindowsKeychain()) {
        try {
            const keychainKey = readWindowsKeychain();
            if (keychainKey) return { key: keychainKey, source: 'keychain' };
        } catch (e) {
            // Fall through to encrypted-file storage.
        }
    }

    // 3. Check Local Config File
    if (fs.existsSync(CONFIG_FILE)) {
        try {
            const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
            if (config.apiKeyEncrypted) {
                const decrypted = decryptApiKey(config.apiKeyEncrypted);
                if (decrypted) return { key: decrypted, source: 'config' };
            }

            // Backward compatibility: migrate old plaintext field to encrypted storage.
            if (config.apiKey) {
                const raw = String(config.apiKey).trim();
                if (raw) {
                    if (canUseWindowsKeychain()) {
                        writeWindowsKeychain(raw);
                        delete config.apiKey;
                        delete config.apiKeyEncrypted;
                        writeConfig(config);
                    } else {
                        config.apiKeyEncrypted = encryptApiKey(raw);
                        delete config.apiKey;
                        writeConfig(config);
                    }
                    return { key: raw, source: 'config' };
                }
            }
        } catch (e) {
            // Silently fail and use fallback
        }
    }

    // 4. Fallback to Backup Keys
    if (BACKUP_KEYS.length > 0) {
        return { 
            key: BACKUP_KEYS[currentBackupIndex], 
            source: 'backup',
            isBackup: true,
            keyCount: BACKUP_KEYS.length,
            rotate: () => { currentBackupIndex = (currentBackupIndex + 1) % BACKUP_KEYS.length; }
        };
    }

    return { key: null, source: 'none' };
}

/**
 * Saves the API key to ~/.giti/config.json
 */
function setApiKey(key) {
    if (!key || !String(key).trim()) return false;

    const config = fs.existsSync(CONFIG_FILE) 
        ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) 
        : {};

    const apiKey = String(key).trim();
    if (canUseWindowsKeychain()) {
        writeWindowsKeychain(apiKey);
        delete config.apiKey;
        delete config.apiKeyEncrypted;
        writeConfig(config);
        return true;
    }

    const encrypted = encryptApiKey(apiKey);
    config.apiKeyEncrypted = encrypted;
    delete config.apiKey;
    writeConfig(config);
    return true;
}

function askAI(query) {
    return new Promise((resolve, reject) => {
        const makeRequest = (attempts = 0) => {
            const result = getApiKey();

            if (!result.key) {
                return reject(new Error("No API key found. Please set one using: giti --auth <KEY>"));
            }

            if (attempts === 0) {
                const rateCheck = checkAiRateLimit(query);
                if (!rateCheck.allowed) {
                    return reject(new Error(rateCheck.message));
                }
            }

            const systemPrompt = `You are an expert Git CLI assistant. The user wants to perform a git action and our offline parser couldn't understand it.
YOUR TASK:
Reply with ONLY the exact git command you recommend.
Do NOT include markdown formatting, backticks, explanations, or extra text.
The reply must be a single line that starts with 'git '.
If the request is not related to git, reply exactly with 'UNKNOWN'.`;

            const payload = JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: query }
                ],
                temperature: 0.1,
                max_tokens: 150
            });

            const options = {
                hostname: API_HOSTNAME,
                port: 443,
                path: API_PATH,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${result.key}`,
                    'Content-Length': Buffer.byteLength(payload)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            const parsed = JSON.parse(data);
                            let command = sanitizeCommand(parsed.choices[0].message.content);
                            if (command === 'UNKNOWN' || command === '"UNKNOWN"') {
                                reject(new Error("Not a git command."));
                            } else if (!isSafeGitCommand(command)) {
                                reject(new Error("Unsafe AI command rejected."));
                            } else {
                                resolve(command);
                            }
                        } catch (e) {
                            reject(new Error("Failed to parse AI response."));
                        }
                    } else if (res.statusCode === 429 || res.statusCode === 401) {
                        if (result.rotate) {
                            result.rotate();
                            const keysCount = result.keyCount || 1;
                            if (attempts + 1 < keysCount) {
                                return makeRequest(attempts + 1);
                            }
                        }
                        
                        // If it's a user key from config, tell them it failed
                        const msg = res.statusCode === 429 
                            ? "Rate limit exceeded on your API key." 
                            : "Your API key is invalid or expired.";
                        reject(new Error(`${msg} Set a new one with: giti --auth <KEY>`));
                    } else {
                        reject(new Error(`API Error: ${res.statusCode}`));
                    }
                });
            });

            req.on('error', (e) => reject(new Error(`Network Error: ${e.message}`)));
            req.setTimeout(8000, () => {
                req.destroy();
                if (result.rotate) {
                    result.rotate();
                    const keysCount = result.keyCount || 1;
                    if (attempts + 1 < keysCount) {
                        makeRequest(attempts + 1);
                        return;
                    }
                    reject(new Error("AI request timed out."));
                } else {
                    reject(new Error("AI request timed out."));
                }
            });
            req.write(payload);
            req.end();
        };

        makeRequest();
    });
}

module.exports = { askAI, setApiKey };
