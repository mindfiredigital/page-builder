export const getHiddenEmail = (email: string, maxLength = 25) => {
  const hiddenEmail = email.split('@')[0] + '@*****';
  return hiddenEmail.length > maxLength
    ? `${hiddenEmail.slice(0, maxLength)}...`
    : hiddenEmail;
};

export const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => currentYear + i);
};

export const getMonthName = (month: number) => {
  const date = new Date(2024, month - 1);
  return date.toLocaleString('default', { month: 'long' });
};
