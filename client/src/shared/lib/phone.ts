export const formatRussianPhoneInput = (value: string) => {
  const digits = value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
  const normalized = digits.startsWith('7') ? digits : digits ? `7${digits}` : '';

  if (!normalized) {
    return '';
  }

  const parts = [
    '+7',
    normalized.slice(1, 4),
    normalized.slice(4, 7),
    normalized.slice(7, 9),
    normalized.slice(9, 11),
  ];

  let result = parts[0];
  if (parts[1]) result += ` (${parts[1]}`;
  if (parts[1]?.length === 3) result += ')';
  if (parts[2]) result += ` ${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;
  if (parts[4]) result += `-${parts[4]}`;

  return result;
};

export const isRussianPhoneComplete = (value: string) => /^(\+7) \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);
