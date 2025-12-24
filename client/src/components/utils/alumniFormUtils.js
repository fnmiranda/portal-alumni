export function normalizeYear(value = '') {
  return value.replace(/\D/g, '').slice(0, 4);
}

export function normalizeBrDate(value = '') {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);

  let out = dd;
  if (mm) out += `/${mm}`;
  if (yyyy) out += `/${yyyy}`;
  return out;
}

export function brToIso(br) {
  const m = br.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return '';

  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);

  const date = new Date(Date.UTC(yyyy, mm - 1, dd));
  const ok =
    date.getUTCFullYear() === yyyy &&
    date.getUTCMonth() === mm - 1 &&
    date.getUTCDate() === dd;

  if (!ok) return '';
  return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(
    2,
    '0',
  )}`;
}

export function isoToBr(iso) {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export function applyPtBrValidityMessage(el) {
  el.setCustomValidity('');

  if (el.validity.valueMissing) {
    el.setCustomValidity('Preencha este campo.');
    return;
  }

  if (el.validity.typeMismatch && el.type === 'email') {
    el.setCustomValidity('Digite um email válido.');
    return;
  }

  if (el.validity.patternMismatch) {
    if (el.name === 'graduationYear') {
      el.setCustomValidity('Digite um ano válido com 4 dígitos (ex: 2020).');
      return;
    }
    if (el.name === 'birthDate') {
      el.setCustomValidity('Use o formato dd/mm/aaaa.');
      return;
    }
    el.setCustomValidity('Formato inválido.');
  }
}

const COMMON_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'yahoo.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'uol.com.br',
  'bol.com.br',
  'ig.com.br',
  'terra.com.br',
]);

export function getEmailStatus(valueRaw = '') {
  const value = valueRaw.trim().toLowerCase();
  if (!value) return { status: 'empty', message: '' };

  const basicOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!basicOk)
    return { status: 'invalid', message: 'Formato de email inválido' };

  const domain = value.split('@')[1] || '';
  if (COMMON_EMAIL_DOMAINS.has(domain)) {
    return { status: 'valid', message: 'Email válido' };
  }

  return {
    status: 'uncommon',
    message: 'Domínio não comum, verifique se está correcto',
  };
}

/** Coloquei aqui um limite de 110 anos */
function toLocalIso(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getBirthDateBoundsIso(maxYears = 110) {
  const now = new Date();
  const maxIso = toLocalIso(now);

  const minDate = new Date(
    now.getFullYear() - maxYears,
    now.getMonth(),
    now.getDate(),
  );
  const minIso = toLocalIso(minDate);

  return { minIso, maxIso };
}

export function validateBirthDate(br, minIso, maxIso) {
  const v = (br || '').trim();
  if (!v) return '';

  const iso = brToIso(v);
  if (!iso) return 'Use dd/mm/aaaa e uma data real.';

  if (iso < minIso) return `Certeza que colocou a data certa?`;
  if (iso > maxIso) return `Data não pode ser no futuro.`;

  return '';
}
