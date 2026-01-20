<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>可视化分析展示</h2>
        <p>通过图表与看板实时展示关键指标与变化趋势。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="showPanel = true">新增看板</button>
        <button class="secondary" @click="startRefresh">刷新大屏</button>
        <button class="ghost" @click="showTip = true">展示提示</button>
        <button class="ghost" @click="showDetail = true">查看模板</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h3>核心指标趋势</h3>
        <div class="line-chart">
          <div v-for="point in line" :key="point.label" class="line-point" :style="{ left: point.x, bottom: point.y }"></div>
        </div>
        <div class="line-labels">
          <span v-for="point in line" :key="point.label">{{ point.label }}</span>
        </div>
      </div>
      <div class="card">
        <h3>实时看板摘要</h3>
        <div class="metrics">
          <div>
            <strong>4.2M</strong>
            <span>实时指标/分钟</span>
          </div>
          <div>
            <strong>52</strong>
            <span>活跃看板</span>
          </div>
          <div>
            <strong>1.8s</strong>
            <span>可视化延迟</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-header">
        <h3>可视化看板</h3>
        <button class="secondary" @click="startPublish">发布大屏</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>看板名称</th>
              <th>使用场景</th>
              <th>刷新频率</th>
              <th>负责人</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="board in boards" :key="board.id">
              <td>{{ board.id }}</td>
              <td>{{ board.name }}</td>
              <td>{{ board.scene }}</td>
              <td>{{ board.refresh }}</td>
              <td>{{ board.owner }}</td>
              <td>{{ board.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <Modal v-model="showPanel" title="新增可视化看板">
    <form class="modal-form">
      <label>
        看板名称
        <input v-model="form.name" type="text" placeholder="如：实时运营监控" />
      </label>
      <label>
        展示主题
        <select v-model="form.theme">
          <option>运营指标</option>
          <option>链路监控</option>
          <option>业务洞察</option>
        </select>
      </label>
      <label>
        刷新频率
        <input v-model="form.refresh" type="text" placeholder="如：5 秒" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="showPanel = false">取消</button>
      <button class="primary" type="button" @click="submitPanel">确认新增</button>
    </template>
  </Modal>

  <Modal v-model="showProgress" title="大屏刷新中">
    <p>正在同步最新指标并渲染图表。</p>
    <div class="progress-space">
      <ProgressBar :progress="progress" />
    </div>
  </Modal>

  <Modal v-model="showTip" title="展示提示">
    <ul class="tip-list">
      <li>推荐将实时指标分组展示，便于对比。</li>
      <li>支持多屏轮播，适合运营大屏展示。</li>
      <li>图表刷新不宜过快，避免影响性能。</li>
    </ul>
  </Modal>

  <Modal v-model="showDetail" title="模板说明">
    <p>当前提供运营监控、链路告警、用户增长等 12 套模板。</p>
    <p>可按业务域拖拽组合并自定义主题色。</p>
    <template #footer>
      <button class="primary" type="button" @click="showDetail = false">确认</button>
    </template>
  </Modal>

  <Modal v-model="showPublish" title="看板发布进度">
    <p>正在发布至 5 个显示屏终端。</p>
    <div class="progress-space">
      <ProgressBar :progress="publishProgress" />
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import Modal from '../components/Modal.vue';
import ProgressBar from '../components/ProgressBar.vue';

const line = [
  { label: '09:00', x: '6%', y: '24%' },
  { label: '10:00', x: '20%', y: '42%' },
  { label: '11:00', x: '34%', y: '32%' },
  { label: '12:00', x: '48%', y: '60%' },
  { label: '13:00', x: '62%', y: '48%' },
  { label: '14:00', x: '76%', y: '68%' },
  { label: '15:00', x: '90%', y: '52%' }
];

const boards = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `实时看板-${index + 1}`,
  scene: ['运营监控', '物流调度', '支付风控', '用户增长'][index % 4],
  refresh: `${3 + (index % 5)} 秒`,
  owner: ['张敏', '刘畅', '王宁', '陈佳'][index % 4],
  status: index % 3 === 0 ? '展示中' : '待发布'
}));

const showPanel = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const showDetail = ref(false);
const showPublish = ref(false);

const progress = ref(0);
const publishProgress = ref(0);
let timer;
let publishTimer;

const form = reactive({
  name: '',
  theme: '运营指标',
  refresh: ''
});

const submitPanel = () => {
  showPanel.value = false;
  startRefresh();
};

const startRefresh = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 17;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    }
  }, 220);
};

const startPublish = () => {
  showPublish.value = true;
  publishProgress.value = 0;
  clearInterval(publishTimer);
  publishTimer = setInterval(() => {
    publishProgress.value += 19;
    if (publishProgress.value >= 100) {
      clearInterval(publishTimer);
      showPublish.value = false;
    }
  }, 220);
};

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(publishTimer);
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

.line-chart {
  position: relative;
  height: 160px;
  background: linear-gradient(180deg, #eff6ff, #ffffff);
  border-radius: 12px;
  margin-top: 16px;
  overflow: hidden;
}

.line-point {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.15);
}

.line-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #64748b;
  font-size: 12px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.metrics strong {
  display: block;
  font-size: 20px;
  color: #0f172a;
}

.metrics span {
  color: #64748b;
  font-size: 13px;
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
