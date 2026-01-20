<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>数据存储管理</h2>
        <p>分层存储实时数据与分析结果，支持快速查询。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="showPlan = true">新增存储策略</button>
        <button class="secondary" @click="startSync">执行冷热迁移</button>
        <button class="ghost" @click="showTip = true">存储提示</button>
        <button class="ghost" @click="showDetail = true">查看索引</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h3>存储分层使用率</h3>
        <div class="chart">
          <div v-for="bar in bars" :key="bar.label" class="bar">
            <div class="bar-fill" :style="{ height: `${bar.value}%` }"></div>
            <span>{{ bar.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>存储摘要</h3>
        <ul class="status-list">
          <li v-for="item in summary" :key="item.name">
            <span>{{ item.name }}</span>
            <em>{{ item.value }}</em>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="table-header">
        <h3>存储层级列表</h3>
        <button class="secondary" @click="startBackup">执行快照</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>层级</th>
              <th>介质</th>
              <th>容量</th>
              <th>使用率</th>
              <th>查询延迟</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tier in tiers" :key="tier.id">
              <td>{{ tier.name }}</td>
              <td>{{ tier.media }}</td>
              <td>{{ tier.capacity }}</td>
              <td>{{ tier.usage }}</td>
              <td>{{ tier.latency }}</td>
              <td>{{ tier.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <Modal v-model="showPlan" title="新增存储策略">
    <form class="modal-form">
      <label>
        策略名称
        <input v-model="form.name" type="text" placeholder="如：热点保留 7 天" />
      </label>
      <label>
        目标层级
        <select v-model="form.tier">
          <option>热存储</option>
          <option>温存储</option>
          <option>冷存储</option>
        </select>
      </label>
      <label>
        保留周期
        <input v-model="form.duration" type="text" placeholder="如：30 天" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="showPlan = false">取消</button>
      <button class="primary" type="button" @click="submitPlan">确认策略</button>
    </template>
  </Modal>

  <Modal v-model="showProgress" title="冷热迁移执行中">
    <p>正在迁移 12 TB 热数据至温存储。</p>
    <div class="progress-space">
      <ProgressBar :progress="progress" />
    </div>
  </Modal>

  <Modal v-model="showTip" title="存储提示">
    <ul class="tip-list">
      <li>建议热点数据保留 7-14 天便于分析。</li>
      <li>冷存储可启用压缩以降低成本。</li>
      <li>快照执行期间会降低写入吞吐。</li>
    </ul>
  </Modal>

  <Modal v-model="showDetail" title="索引与查询策略">
    <p>当前启用了时序索引、标签索引与二级缓存。</p>
    <p>支持按业务域快速检索与冷热数据聚合查询。</p>
    <template #footer>
      <button class="primary" type="button" @click="showDetail = false">确认</button>
    </template>
  </Modal>

  <Modal v-model="showBackup" title="快照执行中">
    <p>正在生成全量快照，并同步至容灾节点。</p>
    <div class="progress-space">
      <ProgressBar :progress="backupProgress" />
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import Modal from '../components/Modal.vue';
import ProgressBar from '../components/ProgressBar.vue';

const bars = [
  { label: '热', value: 82 },
  { label: '温', value: 64 },
  { label: '冷', value: 45 },
  { label: '归档', value: 30 }
];

const summary = [
  { name: '总容量', value: '48 PB' },
  { name: '今日写入', value: '4.8 TB' },
  { name: '可用率', value: '99.99%' },
  { name: '查询并发', value: '12,480' }
];

const tiers = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `Tier-${index + 1}`,
  media: ['SSD', 'SATA', 'Object', 'Archive'][index % 4],
  capacity: `${4 + index} PB`,
  usage: `${60 + (index % 30)}%`,
  latency: `${8 + (index % 7)} ms`,
  status: index % 4 === 0 ? '扩容中' : '稳定'
}));

const showPlan = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const showDetail = ref(false);
const showBackup = ref(false);

const progress = ref(0);
const backupProgress = ref(0);
let timer;
let backupTimer;

const form = reactive({
  name: '',
  tier: '热存储',
  duration: ''
});

const submitPlan = () => {
  showPlan.value = false;
  startSync();
};

const startSync = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 16;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    }
  }, 220);
};

const startBackup = () => {
  showBackup.value = true;
  backupProgress.value = 0;
  clearInterval(backupTimer);
  backupTimer = setInterval(() => {
    backupProgress.value += 22;
    if (backupProgress.value >= 100) {
      clearInterval(backupTimer);
      showBackup.value = false;
    }
  }, 220);
};

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(backupTimer);
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
}

.page-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary,
.secondary,
.ghost {
  border-radius: 12px;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  font-weight: 600;
}

.primary {
  background: #2563eb;
  color: #ffffff;
}

.secondary {
  background: #e0f2fe;
  color: #0369a1;
}

.ghost {
  background: #ffffff;
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.chart {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 20px;
  align-items: end;
  height: 140px;
}

.bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #64748b;
}

.bar-fill {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(180deg, #22c55e, #16a34a);
}

.status-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 12px;
}

.status-list li {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 12px;
}

.status-list em {
  font-style: normal;
  color: #0f766e;
  font-weight: 600;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.table-wrap {
  overflow-x: auto;
  margin-top: 12px;
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-wrap th,
.table-wrap td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

.modal-form input,
.modal-form select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.progress-space {
  margin-top: 16px;
}

.tip-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #475569;
}
</style>
