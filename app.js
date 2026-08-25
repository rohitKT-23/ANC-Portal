/**
 * ANC Direct Customer Portal — Account Home preview (plain JS)
 */

const pendingSRs = [
  {
    number: '00165972',
    subject: 'Establishment Card',
    serviceType: 'Renewal',
    memberName: 'FDI ZONE CSP LLC',
    status: 'In Progress',
    statusClass: 'status-badge status-primary',
    createdDate: '25/08/2026, 2:54 PM'
  },
  {
    number: '00033770',
    subject: 'Letters & Certificates',
    serviceType: '',
    memberName: 'Anjali Susan Mathew',
    status: 'Draft',
    statusClass: 'status-badge status-info',
    createdDate: '02/10/2025, 12:24 PM'
  },
  {
    number: 'SR-2025-10421',
    subject: 'Establishment Card',
    serviceType: 'Renewal',
    memberName: 'Ahmed Hassan',
    status: 'Returned for Modification',
    statusClass: 'status-badge status-warning',
    createdDate: '12/08/2025, 10:00 AM'
  }
];

const completedSRs = [
  {
    number: '00029810',
    subject: 'License Renewal',
    serviceType: 'Renewal',
    memberName: 'INVESTAX',
    status: 'Completed',
    statusClass: 'status-badge status-success',
    createdDate: '15/06/2025, 11:20 AM'
  },
  {
    number: '00027144',
    subject: 'Residence Visa',
    serviceType: 'New',
    memberName: 'Sara Al Mansouri',
    status: 'Closed',
    statusClass: 'status-badge status-info',
    createdDate: '03/04/2025, 9:15 AM'
  }
];

function filterSRs(list, search, status, type) {
  const term = (search || '').trim().toLowerCase();
  return list.filter((r) => {
    if (status && r.status !== status) return false;
    if (type && r.serviceType !== type) return false;
    if (!term) return true;
    const hay = [r.number, r.subject, r.serviceType, r.memberName, r.status]
      .join(' ')
      .toLowerCase();
    return hay.includes(term);
  });
}

function renderSrTable(tbodyId, countId, rows) {
  const tbody = document.getElementById(tbodyId);
  const countEl = document.getElementById(countId);
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="empty-cell"><p>No service requests found.</p></td></tr>';
    if (countEl) countEl.textContent = '0 of 0';
    return;
  }

  tbody.innerHTML = rows
    .map(
      (r) => `
    <tr>
      <td data-label="Service Request Number"><span class="field-link">${r.number}</span></td>
      <td data-label="Subject">${r.subject || '—'}</td>
      <td data-label="Service Type">${r.serviceType || '—'}</td>
      <td data-label="Members Name">${r.memberName || '—'}</td>
      <td data-label="Status"><span class="${r.statusClass}">${r.status}</span></td>
      <td data-label="SR Created Date">${r.createdDate}</td>
    </tr>`
    )
    .join('');

  if (countEl) countEl.textContent = `1-${rows.length} of ${rows.length}`;
}

function renderPendingSRs() {
  const search = document.getElementById('pendingSearch')?.value || '';
  const status = document.getElementById('pendingStatus')?.value || '';
  const type = document.getElementById('pendingType')?.value || '';
  renderSrTable('pendingSrBody', 'pendingSrCount', filterSRs(pendingSRs, search, status, type));
}

function renderCompletedSRs() {
  const search = document.getElementById('completedSearch')?.value || '';
  const status = document.getElementById('completedStatus')?.value || '';
  const type = document.getElementById('completedType')?.value || '';
  renderSrTable('completedSrBody', 'completedSrCount', filterSRs(completedSRs, search, status, type));
}

function wrapAccordionBodies() {
  document.querySelectorAll('.acc-body').forEach((body) => {
    if (body.querySelector(':scope > .acc-body-inner')) return;
    const inner = document.createElement('div');
    inner.className = 'acc-body-inner';
    while (body.firstChild) {
      inner.appendChild(body.firstChild);
    }
    body.appendChild(inner);
  });
}

function initAccordions() {
  wrapAccordionBodies();

  document.querySelectorAll('.acc-header').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = btn.closest('.acc-section');
      if (section) section.classList.toggle('is-open');
    });
  });
}

function initMainTabs() {
  const tabs = document.querySelectorAll('.main-tab');
  const panels = {
    company: document.getElementById('panel-company'),
    members: document.getElementById('panel-members'),
    services: document.getElementById('panel-services')
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.mainTab;
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      Object.keys(panels).forEach((k) => {
        const panel = panels[k];
        if (!panel) return;
        const active = k === key;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    });
  });
}

function initSrFilters() {
  ['pendingSearch', 'pendingStatus', 'pendingType'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', renderPendingSRs);
  });
  ['completedSearch', 'completedStatus', 'completedType'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', renderCompletedSRs);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initMainTabs();
  initSrFilters();
  renderPendingSRs();
  renderCompletedSRs();
});
