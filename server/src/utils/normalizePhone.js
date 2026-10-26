const normalizePhone = (value) => {
  if (!value) {
    return null;
  }

  const digits = String(value).replace(/\D/g, '');
  const normalizedDigits = digits.length === 11 && digits.startsWith('8') ? `7${digits.slice(1)}` : digits;

  if (!/^7\d{10}$/.test(normalizedDigits)) {
    return null;
  }

  return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}-${normalizedDigits.slice(9, 11)}`;
};

module.exports = normalizePhone;
