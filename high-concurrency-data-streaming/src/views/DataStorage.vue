<template>
  <section class="page">
    <div class="card">
      <div class="card-header">
        <div>
          <h2>存储资源概览</h2>
          <p>分布式存储与时序数据库实时状态。</p>
        </div>
        <div class="actions">
          <button class="primary" @click="openShard">新增分区</button>
          <button class="secondary" @click="openBackup">启动备份</button>
          <button class="ghost" @click="openTip">存储提示</button>
        </div>
      </div>
      <div class="storage-grid">
        <div class="storage-card" v-for="item in storageStats" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.note }}</small>
        </div>
      </div>
      <div class="donut">
        <div class="donut-ring" :style="{ '--value': usagePercent + '%' }"></div>
        <div class="donut-info">
          <h3>{{ usagePercent }}%</h3>
          <p>平均空间利用率</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h2>存储节点详情</h2>
          <p>展示各节点压缩率、分区与冗余状态。</p>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>节点编号</th>
              <th>类型</th>
              <th>压缩率</th>
              <th>分区数</th>
              <th>冗余状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="node in nodes" :key="node.id">
              <td>{{ node.id }}</td>
              <td>{{ node.type }}</td>
              <td>{{ node.compress }}</td>
              <td>{{ node.partitions }}</td>
              <td><span :class="['badge', node.redundancy === '充足' ? 'success' : 'warning']">{{ node.redundancy }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-model="showShard" title="新增存储分区" @confirm="saveShard">
      <div class="form-grid">
        <label>
          分区名称
          <input v-model="shardForm.name" placeholder="如：tsdb-part-08" />
        </label>
        <label>
          数据保留周期
          <select v-model="shardForm.retention">
            <option>7 天</option>
            <option>30 天</option>
            <option>90 天</option>
          </select>
        </label>
        <label>
          副本数
          <input v-model="shardForm.replicas" placeholder="例如：3" />
        </label>
      </div>
    </Modal>

    <Modal v-model="showBackup" title="备份进度" @confirm="closeBackup">
      <div>
        <div class="progress-label">正在生成全量备份镜像</div>
        <div class="progress-bar"><span :style="{ width: backupProgress + '%' }" /></div>
        <p class="progress-note">压缩与校验同时进行。</p>
      </div>
    </Modal>

    <Modal v-model="showTip" title="存储提示" @confirm="closeTip">
      <ul class="tip-list">
        <li>冷热数据分层存储可显著提升查询效率。</li>
        <li>建议每周执行一次全量备份。</li>
        <li>多副本同步需保持跨机房链路稳定。</li>
      </ul>
    </Modal>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Modal from '../components/Modal.vue';

const showShard = ref(false);
const showBackup = ref(false);
const showTip = ref(false);

const usagePercent = 76;

const storageStats = [
  { label: '总存储容量', value: '2.4PB', note: '跨 12 个集群' },
  { label: '活跃分区', value: '320', note: '自动扩展中' },
  { label: '压缩比例', value: '4.8x', note: '实时压缩' },
  { label: '备份覆盖率', value: '99.5%', note: '跨地域冗余' }
];

const nodes = Array.from({ length: 20 }, (_, index) => ({
  id: `NODE-${String(index + 1).padStart(2, '0')}`,
  type: index % 2 === 0 ? '时序库' : '分布式存储',
  compress: `${(3.2 + index * 0.08).toFixed(1)}x`,
  partitions: 12 + index,
  redundancy: index % 6 === 0 ? '注意' : '充足'
}));

const shardForm = reactive({
  name: '',
  retention: '30 天',
  replicas: '3'
});

const backupProgress = ref(58);

const openShard = () => {
  showShard.value = true;
};

const openBackup = () => {
  showBackup.value = true;
};

const openTip = () => {
  showTip.value = true;
};

const saveShard = () => {
  showShard.value = false;
};

const closeBackup = () => {
  showBackup.value = false;
};

const closeTip = () => {
  showTip.value = false;
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.card-header h2 {
  font-size: 18px;
  margin-bottom: 6px;
}

.card-header p {
  font-size: 13px;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.primary,
.secondary,
.ghost {
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e2e8f0;
}

.ghost {
  background: #f8fafc;
  border: 1px dashed #cbd5f5;
}

.storage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.storage-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  display: grid;
  gap: 6px;
}

.storage-card span {
  color: #64748b;
  font-size: 13px;
}

.storage-card strong {
  font-size: 20px;
}

.storage-card small {
  color: #94a3b8;
}

.donut {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

.donut-ring {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(#38bdf8 var(--value), #e2e8f0 0%);
  position: relative;
}

.donut-ring::after {
  content: '';
  position: absolute;
  inset: 18px;
  background: #fff;
  border-radius: 50%;
}

.donut-info h3 {
  font-size: 26px;
  margin-bottom: 4px;
}

.donut-info p {
  font-size: 13px;
  color: #64748b;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

thead {
  background: #f1f5f9;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.success {
  background: #dcfce7;
  color: #15803d;
}

.warning {
  background: #fef9c3;
  color: #a16207;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.progress-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.progress-bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.progress-note {
  margin-top: 10px;
  font-size: 13px;
  color: #64748b;
}

.tip-list {
  display: grid;
  gap: 8px;
  padding-left: 16px;
  color: #475569;
}
</style>
