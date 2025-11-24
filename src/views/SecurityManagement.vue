<template>
  <div class="module flex-column">
    <div class="module-header flex-row">
      <div>
        <h2>安全管理</h2>
        <p>统一的权限与审计中心，追踪数据访问轨迹。</p>
      </div>
      <button class="primary-button" @click="openPolicyModal">发布安全策略</button>
    </div>

    <div class="flex-row panels">
      <div class="card panel flex-column">
        <h3>权限分层</h3>
        <div class="policy" v-for="policy in policies" :key="policy.name">
          <strong>{{ policy.name }}</strong>
          <p>{{ policy.desc }}</p>
          <button class="secondary-button" @click="showHint(policy.name + ' 已启用 MFA 强制策略')">查看详情</button>
        </div>
      </div>
      <div class="card panel flex-column">
        <h3>访问审计</h3>
        <ul class="audit-list">
          <li v-for="record in audits" :key="record.id">
            <div>
              <strong>{{ record.user }}</strong>
              <p>{{ record.action }}</p>
            </div>
            <span>{{ record.time }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="policyModal" class="modal-backdrop" @click="policyModal = false">
      <div class="modal-panel" @click.stop>
        <h3>发布策略</h3>
        <p>策略 <strong>关键数据加密轮换</strong> 将应用于 12 个数据库，确认执行？</p>
        <div class="flex-row" style="gap: 0.5rem">
          <button class="secondary-button" @click="policyModal = false">取消</button>
          <button class="primary-button" @click="confirmPolicy">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const policyModal = ref(false);
const policies = [
  { name: '只读账号', desc: '限制 DML，支持 IP 白名单与 MFA。' },
  { name: '核心库 DBA', desc: '具备高危操作审批与全量审计。' }
];
const audits = [
  { id: 1, user: 'svc-report', action: '导出销售聚合报表', time: '刚刚' },
  { id: 2, user: 'ops-admin', action: '调整 PROD 库备份策略', time: '5 分钟前' },
  { id: 3, user: 'bi-user', action: '查询订单明细 220 万行', time: '16 分钟前' }
];

const openPolicyModal = () => {
  policyModal.value = true;
};

const confirmPolicy = () => {
  policyModal.value = false;
  window.alert('策略下发成功，已同步至所有实例');
};

const showHint = (msg) => {
  window.alert(msg);
};
</script>

<style scoped>
.module {
  gap: 1.5rem;
}

.module-header {
  justify-content: space-between;
  align-items: center;
}

.panels {
  gap: 1.5rem;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  gap: 1rem;
}

.policy {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.policy p {
  color: #94a3b8;
}

.audit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.audit-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.8rem;
}

.audit-list span {
  color: #94a3b8;
  font-size: 0.9rem;
}
</style>
