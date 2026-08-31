/**
 * ANC Direct Customer Portal — Account Home preview (plain JS)
 */

const EXPIRY_PAGE_SIZE = 5;
const EXPIRY_WINDOW_DAYS = 30;

/** Member visa/permit dates — ISO YYYY-MM-DD for filtering */
const MEMBER_EXPIRIES = [
  {
    id: 'PER-14778',
    name: 'VANESSA PELAGIE FOUDA METSOGO',
    residenceVisaExpiry: '2026-10-15',
    entryPermitExpiry: '2026-09-08',
    actionUrl: '#renew-entry-permit'
  },
  {
    id: 'PER-14802',
    name: 'Ahmed Hassan',
    residenceVisaExpiry: '2026-09-10',
    entryPermitExpiry: '2026-11-20',
    actionUrl: '#renew-residence-visa'
  },
  {
    id: 'PER-14819',
    name: 'Sara Al Mansouri',
    residenceVisaExpiry: '2026-09-25',
    entryPermitExpiry: '2026-09-05',
    actionUrl: '#renew-entry-permit'
  },
  {
    id: 'PER-14833',
    name: 'Anjali Susan Mathew',
    residenceVisaExpiry: '2026-09-20',
    entryPermitExpiry: '2026-12-01',
    actionUrl: '#renew-residence-visa'
  },
  {
    id: 'PER-14841',
    name: 'Omar Al Nuaimi',
    residenceVisaExpiry: '2026-11-05',
    entryPermitExpiry: '2026-09-15',
    actionUrl: '#renew-entry-permit'
  },
  {
    id: 'PER-14855',
    name: 'Kabir Ahmad',
    residenceVisaExpiry: '2026-09-12',
    entryPermitExpiry: '2026-10-28',
    actionUrl: '#renew-residence-visa'
  },
  {
    id: 'PER-14862',
    name: 'test2 knscyaa',
    residenceVisaExpiry: '2026-09-28',
    entryPermitExpiry: '2027-01-10',
    actionUrl: '#renew-residence-visa'
  },
  {
    id: 'PER-14870',
    name: 'test3 knscyaa',
    residenceVisaExpiry: '2026-12-20',
    entryPermitExpiry: '2026-09-25',
    actionUrl: '#renew-entry-permit'
  },
  {
    id: 'PER-14888',
    name: 'Adelin Tchakounte Tchoutang',
    residenceVisaExpiry: '2026-09-18',
    entryPermitExpiry: '2026-09-18',
    actionUrl: '#renew-residence-visa'
  },
  {
    id: 'PER-14901',
    name: 'test4 knscyaa',
    residenceVisaExpiry: '2026-11-30',
    entryPermitExpiry: '2026-11-30',
    actionUrl: '#renew-residence-visa'
  }
];

let expiryAlerts = [];
let expiryPage = 1;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseIsoDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return startOfDay(new Date(y, m - 1, d));
}

function formatDisplayDate(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function daysUntil(expiryDate, today) {
  const ms = expiryDate.getTime() - today.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function buildExpiryAlerts(members, windowDays = EXPIRY_WINDOW_DAYS) {
  const today = startOfDay(new Date());
  const alerts = [];

  members.forEach((member) => {
    const docs = [
      { type: 'Residence Visa', key: 'residenceVisaExpiry' },
      { type: 'Entry Permit', key: 'entryPermitExpiry' }
    ];

    docs.forEach((doc) => {
      const expiry = parseIsoDate(member[doc.key]);
      if (!expiry) return;

      const remaining = daysUntil(expiry, today);
      if (remaining < 0 || remaining > windowDays) return;

      alerts.push({
        id: member.id,
        name: member.name,
        document: doc.type,
        documentKey: doc.key,
        expiryDate: expiry,
        expiryDisplay: formatDisplayDate(expiry),
        daysRemaining: remaining,
        actionUrl: member.actionUrl || '#'
      });
    });
  });

  return alerts.sort((a, b) => {
    if (a.daysRemaining !== b.daysRemaining) return a.daysRemaining - b.daysRemaining;
    return a.name.localeCompare(b.name);
  });
}

function renderExpiryAlerts() {
  const tbody = document.getElementById('expiryAlertsBody');
  const pager = document.getElementById('expiryPager');
  const countEl = document.getElementById('expiryCount');
  const pageLabel = document.getElementById('expiryPageLabel');
  const prevBtn = document.getElementById('expiryPrev');
  const nextBtn = document.getElementById('expiryNext');

  if (!tbody) return;

  const total = expiryAlerts.length;
  const totalPages = Math.max(1, Math.ceil(total / EXPIRY_PAGE_SIZE));
  expiryPage = Math.min(expiryPage, totalPages);

  if (!total) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="empty-cell"><p>No members have visas or permits expiring within the next 30 days.</p></td></tr>';
    if (pager) pager.hidden = true;
    return;
  }

  const start = (expiryPage - 1) * EXPIRY_PAGE_SIZE;
  const pageRows = expiryAlerts.slice(start, start + EXPIRY_PAGE_SIZE);

  tbody.innerHTML = pageRows
    .map((row, index) => {
      const urgentClass = row.daysRemaining <= 7 ? ' is-urgent' : '';
      const docClass = row.document === 'Entry Permit' ? ' is-entry' : '';
      return `
    <tr>
      <td class="col-index" data-label="#">${start + index + 1}</td>
      <td data-label="Member Name"><span class="field-link">${row.name}</span></td>
      <td data-label="Document"><span class="expiry-doc-badge${docClass}">${row.document}</span></td>
      <td data-label="Days Remaining"><span class="expiry-days${urgentClass}">${row.daysRemaining} day${row.daysRemaining === 1 ? '' : 's'}</span></td>
      <td class="col-action" data-label="Action">
        <button type="button" class="btn btn-primary btn-sm expiry-action-btn" data-action-url="${row.actionUrl}" data-member-id="${row.id}" data-document="${row.documentKey}">
          Take Action
        </button>
      </td>
    </tr>`;
    })
    .join('');

  const end = start + pageRows.length;
  if (countEl) countEl.textContent = `${start + 1}-${end} of ${total}`;
  if (pageLabel) pageLabel.textContent = `Page ${expiryPage} of ${totalPages}`;
  if (prevBtn) prevBtn.disabled = expiryPage <= 1;
  if (nextBtn) nextBtn.disabled = expiryPage >= totalPages;
  if (pager) pager.hidden = total <= EXPIRY_PAGE_SIZE;
}

function initExpiryAlerts() {
  expiryAlerts = buildExpiryAlerts(MEMBER_EXPIRIES);
  expiryPage = 1;
  renderExpiryAlerts();

  document.getElementById('expiryPrev')?.addEventListener('click', () => {
    if (expiryPage > 1) {
      expiryPage -= 1;
      renderExpiryAlerts();
    }
  });

  document.getElementById('expiryNext')?.addEventListener('click', () => {
    const totalPages = Math.ceil(expiryAlerts.length / EXPIRY_PAGE_SIZE);
    if (expiryPage < totalPages) {
      expiryPage += 1;
      renderExpiryAlerts();
    }
  });

  document.getElementById('expiryAlertsBody')?.addEventListener('click', (event) => {
    const btn = event.target.closest('.expiry-action-btn');
    if (!btn) return;

    const url = btn.dataset.actionUrl || '#';
    const memberId = btn.dataset.memberId || '';
    const documentKey = btn.dataset.document || '';

    // Placeholder redirect — wire to service request flow when ready
    if (url && url !== '#') {
      window.location.href = `${url}?member=${encodeURIComponent(memberId)}&document=${encodeURIComponent(documentKey)}`;
    }
  });
}

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
  initExpiryAlerts();
  initAccordions();
  initMainTabs();
  initSrFilters();
  renderPendingSRs();
  renderCompletedSRs();
});
