export function getDigits(value) {
  return value.replace(/\D/g, '');
}

export function getLocalPhoneDigits(value) {
  const digits = getDigits(value);

  if (digits.startsWith('7') || digits.startsWith('8')) {
    return digits.slice(1, 11);
  }

  return digits.slice(0, 10);
}

export function formatPhoneInput(value) {
  const digits = getLocalPhoneDigits(value);
  const chars = digits.padEnd(10, '_');

  return `+7 (${chars.slice(0, 3)}) ${chars.slice(3, 6)}-${chars.slice(6, 8)}-${chars.slice(8, 10)}`
}

export function toStoredPhone(value) {
  return `7${getLocalPhoneDigits(value)}`
}

export function formatStoredPhone(value) {
  return formatPhoneInput(value);
}