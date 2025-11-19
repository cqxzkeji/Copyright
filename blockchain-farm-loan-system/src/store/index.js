import { reactive } from 'vue';

export const store = reactive({
  farms: [
    { id: 'F-001', owner: '王田', area: 36, location: '河北邢台', status: '可抵押' },
    { id: 'F-002', owner: '李农', area: 25, location: '河南信阳', status: '已抵押' }
  ],
  applications: [
    { id: 'A-1201', farmer: '王田', amount: 50, stage: '资料审核' },
    { id: 'A-1202', farmer: '张平', amount: 80, stage: '链上验证' }
  ],
  contracts: [
    { id: 'C-9101', farmId: 'F-001', bank: '三农银行', amount: 50, status: '履约中' }
  ],
  blockchainEvents: [
    { id: 'B-41', type: '抵押记录', hash: '0x8fae...21d', time: '09:12' },
    { id: 'B-42', type: '放款确认', hash: '0x9bc1...98d', time: '10:20' }
  ],
  risks: [
    { id: 'R-01', type: '利率波动', impact: '中', action: '上调质押率' },
    { id: 'R-02', type: '旱灾预警', impact: '高', action: '追加保证金' }
  ],
  addFarm(newFarm) {
    this.farms.push(newFarm);
  },
  addApplication(newApplication) {
    this.applications.push(newApplication);
  },
  updateApplicationStage(id, stage) {
    const target = this.applications.find((item) => item.id === id);
    if (target) target.stage = stage;
  },
  addContract(contract) {
    this.contracts.push(contract);
  },
  addBlockchainEvent(event) {
    this.blockchainEvents.unshift(event);
  },
  acknowledgeRisk(id) {
    this.risks = this.risks.map((risk) =>
      risk.id === id ? { ...risk, action: '已执行对冲措施' } : risk
    );
  }
});
