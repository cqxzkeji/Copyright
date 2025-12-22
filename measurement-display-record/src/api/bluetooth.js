export const scanBluetoothDevices = () => {
  return Promise.resolve([
    { id: 'BT-1001', name: '多参数仪-Alpha', signal: '强', battery: '86%' },
    { id: 'BT-1002', name: '多参数仪-Beta', signal: '中', battery: '72%' },
    { id: 'BT-1003', name: '多参数仪-Gamma', signal: '良', battery: '64%' }
  ]);
};
