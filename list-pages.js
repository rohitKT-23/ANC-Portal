/**
 * Shared list pages for cspDashboardV2 preview
 * members | inProgress | completed
 */

const MEMBERS = [
  {
    name: 'test2 knscyaa',
    company: 'ATT Service',
    role: '',
    phone: '0600000000',
    email: 'test2knscyaa@exmpl.com',
    owner: 'Zaafar Ali',
    createdDate: '18/09/2024, 8:30 AM'
  },
  {
    name: 'test3 knscyaa',
    company: 'ATT Service',
    role: '',
    phone: '0600000000',
    email: 'test3knscyaa@exmpl.com',
    owner: 'Imran Kadavath',
    createdDate: '18/09/2024, 8:30 AM'
  },
  {
    name: 'test4 knscyaa',
    company: 'ATT Service',
    role: 'UBO',
    phone: '0600000000',
    email: 'test4knscyaa@exmpl.com',
    owner: 'Reem El Hadad',
    createdDate: '18/09/2024, 8:30 AM'
  },
  {
    name: 'Ahmed Hassan',
    company: 'INVESTAX',
    role: 'Manager',
    phone: '0501234567',
    email: 'ahmed.hassan@investax.ae',
    owner: 'Kabir Ahmad',
    createdDate: '12/08/2025, 10:15 AM'
  },
  {
    name: 'Sara Al Mansouri',
    company: 'INVESTAX',
    role: 'Shareholder',
    phone: '0559876543',
    email: 'sara.mansouri@investax.ae',
    owner: 'Kabir Ahmad',
    createdDate: '10/08/2025, 9:40 AM'
  },
  {
    name: 'Anjali Susan Mathew',
    company: 'INVESTAX',
    role: 'Director',
    phone: '0521112233',
    email: 'anjali.mathew@investax.ae',
    owner: 'Kabir Ahmad',
    createdDate: '02/06/2025, 2:20 PM'
  },
  {
    name: 'Kabir Ahmad',
    company: 'INVESTAX',
    role: 'Manager, UBO',
    phone: '0507654321',
    email: 'kabir.ahmad@investax.ae',
    owner: 'Kabir Ahmad',
    createdDate: '01/05/2025, 3:10 PM'
  },
  {
    name: 'Omar Al Nuaimi',
    company: 'INVESTAX',
    role: 'Shareholder, Manager, UBO',
    phone: '0543332211',
    email: 'omar.nuaimi@investax.ae',
    owner: 'Kabir Ahmad',
    createdDate: '15/03/2025, 1:45 PM'
  }
];

const IN_PROGRESS = [
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
  },
  {
    number: 'SR-2025-10388',
    subject: 'Residence Visa',
    serviceType: 'New',
    memberName: 'Sara Al Mansouri',
    status: 'Under Review',
    statusClass: 'status-badge status-primary',
    createdDate: '10/08/2025, 11:30 AM'
  }
];

/** Completed Requests page — Status must be Completed only */
const COMPLETED = [
  {
    number: '00029810',
    subject: 'License Renewal',
    serviceType: 'Renewal',
    memberName: 'INVESTAX',
    status: 'Completed',
    statusClass: 'status-badge status-success',
    createdDate: '20/08/2026, 11:20 AM'
  },
  {
    number: '00027144',
    subject: 'Residence Visa',
    serviceType: 'New',
    memberName: 'Sara Al Mansouri',
    status: 'Completed',
    statusClass: 'status-badge status-success',
    createdDate: '05/08/2026, 9:15 AM'
  },
  {
    number: '00025001',
    subject: 'Establishment Card',
    serviceType: 'New',
    memberName: 'Ahmed Hassan',
    status: 'Completed',
    statusClass: 'status-badge status-success',
    createdDate: '20/01/2025, 4:05 PM'
  }
];

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Parse "DD/MM/YYYY, h:mm AM/PM" or "DD/MM/YYYY" */
function parseCreatedDate(dateStr) {
  if (!dateStr) return null;
  const datePart = String(dateStr).split(',')[0].trim();
  const parts = datePart.split('/');
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);
  const d = new Date(year, month, day);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function filterByDays(rows, days) {
  if (!days) return rows;
  const today = startOfDay(new Date());
  const from = new Date(today);
  from.setDate(from.getDate() - (days - 1));

  return rows.filter((row) => {
    const created = parseCreatedDate(row.createdDate);
    if (!created) return false;
    const createdDay = startOfDay(created);
    return createdDay >= from && createdDay <= today;
  });
}

function filterByTerm(rows, term, fields) {
  const q = (term || '').trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) =>
    fields.some((field) => String(row[field] || '').toLowerCase().includes(q))
  );
}

function onlyCompletedStatus(rows) {
  return rows.filter((r) => String(r.status || '').toLowerCase() === 'completed');
}

const PRIMARY_ROLES = ['Manager', 'UBO', 'Shareholder'];

/** Split "Manager, UBO" → ['Manager', 'UBO'] */
function parseRoleTokens(roleStr) {
  return String(roleStr || '')
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean);
}

function hasPrimaryRole(tokens, roleName) {
  const target = roleName.toLowerCase();
  return tokens.some((t) => t.toLowerCase() === target);
}

function filterByRole(rows, role) {
  if (!role) return rows;

  if (role === 'Others') {
    return rows.filter((r) => {
      const tokens = parseRoleTokens(r.role);
      // Others = no Manager / UBO / Shareholder token
      return !PRIMARY_ROLES.some((p) => hasPrimaryRole(tokens, p));
    });
  }

  // Manager / UBO / Shareholder: match if Role contains that token
  // e.g. Manager matches "Manager" and "Manager, UBO"
  return rows.filter((r) => hasPrimaryRole(parseRoleTokens(r.role), role));
}

function renderMembers(rows) {
  const tbody = document.getElementById('listBody');
  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="9" class="empty-cell"><p>No members match your search.</p></td></tr>';
    return;
  }

  tbody.innerHTML = rows
    .map(
      (m, i) => `
    <tr>
      <td data-label="#" class="col-index">${i + 1}</td>
      <td data-label="Name"><span class="field-link">${escapeHtml(m.name)}</span></td>
      <td data-label="Company Name"><span class="field-link">${escapeHtml(m.company)}</span></td>
      <td data-label="Role">${escapeHtml(m.role) || '—'}</td>
      <td data-label="Phone">${escapeHtml(m.phone)}</td>
      <td data-label="Email"><span class="field-link">${escapeHtml(m.email)}</span></td>
      <td data-label="Owner">${escapeHtml(m.owner)}</td>
      <td data-label="Created Date">${escapeHtml(m.createdDate)}</td>
      <td data-label="Actions"><button type="button" class="row-action" title="Actions">▾</button></td>
    </tr>`
    )
    .join('');
}

function renderRequests(rows, actionLabel) {
  const tbody = document.getElementById('listBody');
  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="empty-cell"><p>No requests match your search.</p></td></tr>';
    return;
  }

  tbody.innerHTML = rows
    .map(
      (r) => `
    <tr>
      <td data-label="SR Number"><span class="field-link">${escapeHtml(r.number)}</span></td>
      <td data-label="Subject">${escapeHtml(r.subject)}</td>
      <td data-label="Service Type">${escapeHtml(r.serviceType) || '—'}</td>
      <td data-label="Member Name">${escapeHtml(r.memberName)}</td>
      <td data-label="Status"><span class="${r.statusClass}">${escapeHtml(r.status)}</span></td>
      <td data-label="Created Date">${escapeHtml(r.createdDate)}</td>
      <td data-label="Actions">
        <button type="button" class="btn btn-primary btn-sm">${escapeHtml(actionLabel)}</button>
      </td>
    </tr>`
    )
    .join('');
}

function updateMeta(page, count, activeDays, activeRole) {
  const meta = document.getElementById('listMeta');
  const countEl = document.getElementById('listCount');
  const dateLabel = activeDays ? ` · Last ${activeDays} days` : '';
  const roleLabel = activeRole ? ` · Role: ${activeRole}` : ' · Filtered by All members';

  if (page === 'members') {
    if (meta) meta.textContent = `${count} items · Sorted by Name${roleLabel}`;
  } else if (page === 'inProgress') {
    if (meta) meta.textContent = `${count} items · Sorted by Created Date · In Progress only${dateLabel}`;
  } else {
    if (meta) meta.textContent = `${count} items · Sorted by Created Date · Status: Completed${dateLabel}`;
  }

  if (countEl) {
    countEl.textContent = count ? `1-${count} of ${count}` : '0 of 0';
  }
}

function syncDateFilterButtons(activeDays) {
  document.querySelectorAll('.date-filter-btn').forEach((btn) => {
    const days = Number(btn.dataset.days);
    btn.classList.toggle('is-active', activeDays === days);
    btn.setAttribute('aria-pressed', activeDays === days ? 'true' : 'false');
  });
}

function syncRoleFilterButtons(activeRole) {
  document.querySelectorAll('.role-filter-btn').forEach((btn) => {
    const role = btn.dataset.role;
    btn.classList.toggle('is-active', activeRole === role);
    btn.setAttribute('aria-pressed', activeRole === role ? 'true' : 'false');
  });
}

function initListPage(page) {
  const search = document.getElementById('listSearch');
  const reset = document.getElementById('btnReset');
  let activeDays = null;
  let activeRole = null;

  const refresh = () => {
    const term = search ? search.value : '';

    if (page === 'members') {
      let rows = filterByRole(MEMBERS, activeRole);
      rows = filterByTerm(rows, term, [
        'name',
        'company',
        'role',
        'phone',
        'email',
        'owner'
      ]);
      renderMembers(rows);
      updateMeta(page, rows.length, null, activeRole);
      return;
    }

    if (page === 'inProgress') {
      let rows = filterByDays(IN_PROGRESS, activeDays);
      rows = filterByTerm(rows, term, [
        'number',
        'subject',
        'serviceType',
        'memberName',
        'status'
      ]);
      renderRequests(rows, 'View Details');
      updateMeta(page, rows.length, activeDays, null);
      return;
    }

    // Completed: only Status = Completed
    let rows = onlyCompletedStatus(COMPLETED);
    rows = filterByDays(rows, activeDays);
    rows = filterByTerm(rows, term, [
      'number',
      'subject',
      'serviceType',
      'memberName',
      'status'
    ]);
    renderRequests(rows, 'View Details');
    updateMeta(page, rows.length, activeDays, null);
  };

  document.querySelectorAll('.date-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const days = Number(btn.dataset.days);
      activeDays = activeDays === days ? null : days;
      syncDateFilterButtons(activeDays);
      refresh();
    });
  });

  document.querySelectorAll('.role-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      activeRole = activeRole === role ? null : role;
      syncRoleFilterButtons(activeRole);
      refresh();
    });
  });

  if (search) search.addEventListener('input', refresh);
  if (reset) {
    reset.addEventListener('click', () => {
      if (search) search.value = '';
      activeDays = null;
      activeRole = null;
      syncDateFilterButtons(activeDays);
      syncRoleFilterButtons(activeRole);
      refresh();
    });
  }

  syncDateFilterButtons(activeDays);
  syncRoleFilterButtons(activeRole);
  refresh();
}
