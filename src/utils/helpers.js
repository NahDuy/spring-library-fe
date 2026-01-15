export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN');
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const getDaysRemaining = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

export const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};
