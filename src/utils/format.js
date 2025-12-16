export const formatBytes = (value) => {
  if (value > 1000) return `${(value / 1024).toFixed(1)} MB`;
  return `${value} KB`;
};

export const randomPercent = () => Math.round(40 + Math.random() * 55);
