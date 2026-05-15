export const STORAGE_KEYS = {
  APP: "nexusos_v3_app"
};

export function uid() {
  return "id_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
}

export function saveApp(data) {
  localStorage.setItem(STORAGE_KEYS.APP, JSON.stringify(data));
}

export function loadApp() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP);

    if (!raw) {
      return {
        projects: [],
        trashProjects: [],
        trashButtons: [],
        settings: {
          gridMode: true
        }
      };
    }

    return JSON.parse(raw);
  } catch {
    return {
      projects: [],
      trashProjects: [],
      trashButtons: [],
      settings: {
        gridMode: true
      }
    };
  }
}

export function sanitize(text = "") {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

export function normalizeUrl(url = "") {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
}

export function copyText(text) {
  navigator.clipboard.writeText(text);
}

export function exportJson(filename, data) {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}