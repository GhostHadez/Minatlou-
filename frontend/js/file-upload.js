/**
 * =============================================================
 * MINATLOU SECURITY & PROJECTS — FILE UPLOAD WIDGET
 * =============================================================
 * Reusable, dependency-free file upload zone with:
 *  - click-to-browse and drag & drop
 *  - type validation (PDF, DOC, DOCX)
 *  - size validation (configurable max, default 5MB)
 *  - single or multiple file support
 *  - a live list of selected files with remove buttons
 *
 * Usage:
 *   const uploader = createFileUpload({
 *     zoneId: 'cvUploadZone',
 *     inputId: 'cvUploadInput',
 *     listId: 'cvFileList',
 *     multiple: false,
 *     maxSizeMB: 5,
 *     allowedTypes: ['application/pdf', 'application/msword',
 *       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
 *     allowedExt: ['pdf', 'doc', 'docx'],
 *   });
 *   uploader.getFiles() -> File[]
 * =============================================================
 */

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function createFileUpload(options) {
  const {
    zoneId,
    inputId,
    listId,
    multiple = false,
    maxSizeMB = 5,
    allowedTypes = [],
    allowedExt = [],
    onChange = () => {},
  } = options;

  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  let files = [];

  function extOf(name) {
    return (name.split('.').pop() || '').toLowerCase();
  }

  function validate(file) {
    const ext = extOf(file.name);
    const typeOk =
      (!allowedTypes.length || allowedTypes.includes(file.type)) &&
      (!allowedExt.length || allowedExt.includes(ext));
    if (!typeOk) {
      return `File type not allowed. Accepted: ${allowedExt.join(', ').toUpperCase()}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File exceeds ${maxSizeMB}MB limit`;
    }
    return null;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render() {
    list.innerHTML = '';
    files.forEach((entry, idx) => {
      const row = document.createElement('div');
      row.className = 'file-item' + (entry.error ? ' error' : '');
      row.innerHTML = `
        <div class="fname">
          <span>📄</span>
          <span class="n">${escapeHtml(entry.file.name)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          ${entry.error ? `<span class="file-err-msg">${escapeHtml(entry.error)}</span>` : `<span class="fsize">${formatBytes(entry.file.size)}</span>`}
          <button type="button" class="remove-file" data-idx="${idx}" aria-label="Remove file">✕</button>
        </div>
      `;
      list.appendChild(row);
    });
    list.querySelectorAll('.remove-file').forEach((btn) => {
      btn.addEventListener('click', () => {
        files.splice(Number(btn.dataset.idx), 1);
        render();
        onChange(getFiles());
      });
    });
  }

  function addFiles(fileList) {
    const incoming = Array.from(fileList);
    if (!multiple) files = [];
    incoming.forEach((file) => {
      const error = validate(file);
      files.push({ file, error });
    });
    render();
    onChange(getFiles());
  }

  function getFiles() {
    return files.filter((f) => !f.error).map((f) => f.file);
  }

  function hasErrors() {
    return files.some((f) => f.error);
  }

  function clear() {
    files = [];
    render();
  }

  if (zone && input) {
    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => addFiles(e.target.files));

    ['dragenter', 'dragover'].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
      });
    });
    zone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    });
  }

  return { getFiles, hasErrors, clear, addFiles };
}

window.createFileUpload = createFileUpload;
window.formatBytes = formatBytes;
