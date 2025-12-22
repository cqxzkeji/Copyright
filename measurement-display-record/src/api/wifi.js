export const fetchWifiStatus = () => {
  return Promise.resolve({
    ssid: 'Lab-Measure-5G',
    strength: 92,
    ip: '192.168.3.88',
    latency: '12ms'
  });
};
