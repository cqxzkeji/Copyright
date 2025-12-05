<template>
  <div class="page">
    <header class="page-header">
      <div>
        <p class="eyebrow">资源管理</p>
        <h2>资源池与节点调度</h2>
      </div>
      <div class="btns">
        <button class="primary" @click="showCreate = true">新增资源</button>
        <button @click="showMigrate = true">批量迁移</button>
        <button @click="showChart = true">查看资源分布图</button>
      </div>
    </header>

    <section class="cards">
      <div class="card" v-for="group in summary" :key="group.label">
        <div class="card-top">
          <span class="label">{{ group.label }}</span>
          <span class="value">{{ group.value }}</span>
        </div>
        <div class="bar">
          <div class="fill" :style="{ width: group.percent + '%' }"></div>
        </div>
        <p class="desc">占比 {{ group.percent }}%</p>
      </div>
    </section>

    <section class="table-card">
      <div class="table-head">
        <h3>资源节点列表</h3>
        <button @click="showTips = true">使用指南</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>CPU</th>
            <th>内存</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in resources" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.cpu }} Core</td>
            <td>{{ item.memory }} GB</td>
            <td>
              <span class="status" :class="item.status === '健康' ? 'ok' : 'warn'">{{ item.status }}</span>
            </td>
            <td>
              <button @click="openDetail(item)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal v-if="showCreate" title="新增资源" @close="showCreate = false">
      <form class="form" @submit.prevent="submitCreate">
        <label>名称<input v-model="form.name" required /></label>
        <label>类型<input v-model="form.type" required /></label>
        <label>CPU 核数<input type="number" v-model.number="form.cpu" min="1" required /></label>
        <label>内存容量 (GB)<input type="number" v-model.number="form.memory" min="1" required /></label>
        <div class="modal-actions">
          <button type="submit" class="primary">提交</button>
          <button type="button" @click="showCreate = false">取消</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal v-if="showMigrate" title="批量迁移进度" @close="showMigrate = false">
      <p>已锁定节点并开始迁移。</p>
      <div class="progress">
        <div class="progress-fill" :style="{ width: migratePercent + '%' }"></div>
      </div>
      <p class="desc">当前完成度：{{ migratePercent }}%</p>
      <div class="modal-actions">
        <button class="primary" @click="increaseMigrate">刷新进度</button>
        <button @click="showMigrate = false">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showChart" title="资源分布" @close="showChart = false">
      <div class="chart">
        <div v-for="item in summary" :key="item.label" class="chart-row">
          <span>{{ item.label }}</span>
          <div class="chart-bar">
            <div class="chart-fill" :style="{ width: item.percent + '%' }"></div>
          </div>
          <span class="chart-value">{{ item.value }}</span>
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary" @click="showChart = false">完成</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showTips" title="操作提示" @close="showTips = false">
      <p>可在表格行点击“查看”快速获取资源详情并执行伸缩。</p>
      <div class="modal-actions">
        <button class="primary" @click="showTips = false">我知道了</button>
      </div>
    </BaseModal>

    <BaseModal v-if="detail" :title="detail.name + ' 详情'" @close="detail = null">
      <ul class="detail-list">
        <li>类型：{{ detail.type }}</li>
        <li>CPU：{{ detail.cpu }} Core</li>
        <li>内存：{{ detail.memory }} GB</li>
        <li>状态：{{ detail.status }}</li>
      </ul>
      <div class="modal-actions">
        <button class="primary" @click="showScale = true">执行伸缩</button>
        <button @click="detail = null">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showScale" title="弹性伸缩" @close="showScale = false">
      <p>伸缩操作会立即影响运行任务。</p>
      <div class="modal-actions">
        <button class="primary" @click="showScale = false">确认执行</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from './components/BaseModal.vue';

const resources = ref([
  { name: 'cn-sh-node-01', type: '计算型', cpu: 32, memory: 128, status: '健康' },
  { name: 'cn-sh-node-02', type: '通用型', cpu: 24, memory: 96, status: '健康' },
  { name: 'cn-bj-node-01', type: '存储型', cpu: 16, memory: 256, status: '预警' },
  { name: 'cn-bj-node-02', type: 'GPU型', cpu: 48, memory: 192, status: '健康' },
  { name: 'eu-fr-node-01', type: '通用型', cpu: 32, memory: 128, status: '健康' },
  { name: 'eu-fr-node-02', type: '计算型', cpu: 36, memory: 144, status: '预警' },
  { name: 'ap-sg-node-01', type: 'GPU型', cpu: 64, memory: 256, status: '健康' },
  { name: 'ap-sg-node-02', type: '内存型', cpu: 24, memory: 320, status: '健康' },
  { name: 'us-ca-node-01', type: '通用型', cpu: 16, memory: 64, status: '健康' },
  { name: 'us-ca-node-02', type: '计算型', cpu: 40, memory: 160, status: '预警' }
]);

const summary = [
  { label: '计算型', value: 6, percent: 35 },
  { label: '通用型', value: 8, percent: 28 },
  { label: 'GPU型', value: 4, percent: 17 },
  { label: '存储/内存型', value: 5, percent: 20 }
];

const showCreate = ref(false);
const showMigrate = ref(false);
const showChart = ref(false);
const showTips = ref(false);
const detail = ref(null);
const showScale = ref(false);
const migratePercent = ref(32);

const form = ref({ name: '', type: '', cpu: 8, memory: 32 });

const submitCreate = () => {
  showCreate.value = false;
};

const increaseMigrate = () => {
  migratePercent.value = Math.min(100, migratePercent.value + 18);
};

const openDetail = (item) => {
  detail.value = item;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 18px 20px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.08);
}

.eyebrow {
  color: #6b7280;
  margin: 0;
}

.btns button {
  margin-left: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.08);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value {
  font-size: 24px;
  font-weight: 800;
}

.bar {
  margin: 12px 0 8px;
  background: #eef2ff;
  height: 8px;
  border-radius: 8px;
}

.fill {
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.desc {
  color: #6b7280;
  margin: 0;
}

.table-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
}

.table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.status {
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
}

.ok {
  background: #ecfdf3;
  color: #0f9f4f;
}

.warn {
  background: #fff7ed;
  color: #ea580c;
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #374151;
}

.form input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.modal-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  grid-column: span 2;
}

.progress {
  width: 100%;
  height: 12px;
  background: #eef2ff;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #22c55e);
}

.chart-row {
  display: grid;
  grid-template-columns: 120px 1fr 70px;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.chart-bar {
  background: #f1f5f9;
  height: 12px;
  border-radius: 10px;
}

.chart-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #a855f7);
  border-radius: 10px;
}

.detail-list {
  padding-left: 18px;
  color: #374151;
}

@media (max-width: 720px) {
  .form {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
