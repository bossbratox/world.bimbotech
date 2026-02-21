const DESKTOP_ORIGIN_PATTERNS = [
  /^https?:\/\/tauri\.localhost(:\d+)?$/,
  /^https?:\/\/[a-z0-9-]+\.tauri\.localhost(:\d+)?$/i,
  /^tauri:\/\/localhost$/,
  /^asset:\/\/localhost$/,
];

function isDesktopOrigin(origin) {
  return Boolean(origin) && DESKTOP_ORIGIN_PATTERNS.some(p => p.test(origin));
}

function getValidKeys() {
  return (process.env.WORLDMONITOR_VALID_KEYS || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function validateApiKey(req) {
  const key = req.headers.get('X-WorldMonitor-Key');
  const origin = req.headers.get('Origin') || '';
  const validKeys = getValidKeys();

  if (isDesktopOrigin(origin)) {
    if (!key) return { valid: false, required: true, error: 'API key required for desktop access' };
    if (!validKeys.includes(key)) return { valid: false, required: true, error: 'Invalid API key' };
    return { valid: true, required: true };
  }

  if (key) {
    if (!validKeys.includes(key)) return { valid: false, required: true, error: 'Invalid API key' };
    return { valid: true, required: true };
  }

  return { valid: false, required: false };
}
