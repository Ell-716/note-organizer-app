// ===== Utilities =====

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }) + ' · ' + d.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit'
    });
  }
  
  function escapeHtml(str = '') {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  
  // ===== Toast =====
  
  let toastTimer;
  function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = 'toast'; }, 3000);
  }
  
  // ===== Render =====
  
  async function loadAndRender() {
    const res   = await fetch('/notes');
    const notes = await res.json();
  
    const container = document.getElementById('notes');
    const count     = document.getElementById('footerCount');
    container.innerHTML = '';
  
    count.textContent = notes.length
      ? `${notes.length} note${notes.length !== 1 ? 's' : ''}`
      : '';
  
    if (!notes.length) {
      container.innerHTML = '<p class="empty-state">No notes yet</p>';
      return;
    }
  
    notes.forEach((note, i) => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.innerHTML = `
        <span class="note-index">${String(i + 1).padStart(2, '0')}</span>
        <div class="note-main">
          <span class="note-title">${escapeHtml(note.title)}</span>
          <span class="note-date">${formatDate(note.time_added)}</span>
        </div>
        <label class="note-img-zone" title="Add image (coming soon)">
          <input type="file" accept="image/*" disabled style="display:none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
        </label>
        <div class="note-actions">
          <button class="btn-edit" data-title="${escapeHtml(note.title)}" data-body="${escapeHtml(note.body)}" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125L18 8.625"/>
            </svg>
          </button>
          <button class="btn-delete" data-title="${escapeHtml(note.title)}" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
            </svg>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  
    // Bind actions
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const title = btn.dataset.title;
        if (!confirm(`Delete "${title}"?`)) return;
        await fetch(`/notes/${encodeURIComponent(title)}`, { method: 'DELETE' });
        showToast('Note deleted');
        loadAndRender();
      });
    });
  
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal('edit', btn.dataset.title, btn.dataset.body);
      });
    });
  }
  
  // ===== Header date =====
  
  function setHeaderDate() {
    const el = document.getElementById('headerDate');
    const d  = new Date();
    el.textContent = d.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }
  
  // ===== Modal =====
  
  let modalMode  = 'add';
  let editTarget = null;
  
  function openModal(mode = 'add', title = '', body = '') {
    modalMode  = mode;
    editTarget = title;
  
    document.getElementById('noteTitle').value    = title;
    document.getElementById('noteBody').value     = body;
    document.getElementById('noteTitle').disabled = mode === 'edit';
    document.getElementById('modalTitle').textContent = mode === 'edit' ? 'Edit Note' : 'New Note';
  
    document.getElementById('modal').classList.remove('hidden');
    setTimeout(() => {
      (mode === 'edit'
        ? document.getElementById('noteBody')
        : document.getElementById('noteTitle')
      ).focus();
    }, 80);
  }
  
  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('noteTitle').value    = '';
    document.getElementById('noteBody').value     = '';
    document.getElementById('noteTitle').disabled = false;
  }
  
  document.getElementById('addBtn').addEventListener('click', () => openModal('add'));
  document.getElementById('cancelNote').addEventListener('click', closeModal);
  document.getElementById('cancelNote2').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
  
  document.getElementById('saveNote').addEventListener('click', async () => {
    const title = document.getElementById('noteTitle').value.trim();
    const body  = document.getElementById('noteBody').value.trim();
  
    if (!title || !body) {
      showToast('Title and content are required', 'error');
      return;
    }
  
    if (modalMode === 'add') {
      const res  = await fetch('/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body })
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error, 'error'); return; }
      showToast('Note added');
    } else {
      const res  = await fetch(`/notes/${encodeURIComponent(editTarget)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body })
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error, 'error'); return; }
      showToast('Note updated');
    }
  
    closeModal();
    loadAndRender();
  });
  
  // ===== Init =====
  setHeaderDate();
  loadAndRender();
  