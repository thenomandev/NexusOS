export function genId() {
  return Date.now() + Math.random().toString(36).slice(2);
}

export function sanitize(str = "") {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

export function saveLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function copyText(text) {
  navigator.clipboard.writeText(text);
}

export function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
}