export const buildChart = () =>
  [68, 72, 65, 78, 82, 76, 70, 74, 80, 86, 83, 88, 75, 79, 84, 90, 92, 87, 81, 76, 73, 77, 85, 89];

export const buildTable = (label) =>
  Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    site: `${label}-${String(index + 1).padStart(2, "0")}`,
    flow: `${(120 + index * 3).toFixed(1)} m³/h`,
    pressure: `${(0.22 + index * 0.01).toFixed(2)} MPa`,
    quality: index % 4 === 0 ? "需关注" : "正常",
    energy: `${(38 + index * 1.4).toFixed(1)} kWh`,
    status: index % 6 === 0 ? "维护中" : "运行中"
  }));
