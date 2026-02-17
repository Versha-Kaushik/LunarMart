export const addCurrency = num => {
  return `₹${num?.toLocaleString('en-IN')}`;
};
