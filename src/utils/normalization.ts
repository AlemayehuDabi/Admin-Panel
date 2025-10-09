export function normalizeEthiopianPhone(phone: string): string {
  phone = phone.trim();

  // Replace leading 0 with +251
  if (phone.startsWith('0')) {
    return '+251' + phone.slice(1);
  }

  // If already starts with +251, keep as is
  if (phone.startsWith('+251')) {
    return phone;
  }

  throw new Error('Invalid Ethiopian phone number');
}

