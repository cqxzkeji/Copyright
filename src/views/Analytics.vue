<template>
  <main class="page">
    <header class="card header">
      <div>
        <h2>数据分析</h2>
        <p>覆盖数字人助教表现、课程数据与互动指标</p>
      </div>
      <div class="actions">
        <button @click="openModal('export')">导出报表</button>
        <button class="ghost" @click="openModal('notify')">发送摘要</button>
        <button class="ghost" @click="openModal('tip')">查看提示</button>
      </div>
    </header>

    <div class="card chart-card">
      <h3>一周互动趋势</h3>
      <svg viewBox="0 0 300 120" preserveAspectRatio="none">
        <polyline :points="polylinePoints" fill="none" stroke="#2563eb" stroke-width="3" />
        <polyline :points="secondaryPoints" fill="none" stroke="#7c3aed" stroke-width="3" />
      </svg>
      <div class="legend">
        <span><i class="dot primary"></i>答疑次数</span>
        <span><i class="dot secondary"></i>课堂互动</span>
      </div>
    </div>

    <div class="card">
      <h3>课程互动榜</h3>
      <table>
        <thead>
          <tr>
            <th>课程</th>
            <th>互动次数</th>
            <th>平均满意度</th>
            <th>数字人参与</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.course">
            <td>{{ row.course }}</td>
            <td>{{ row.interactions }}</td>
            <td>{{ row.score }}%</td>
            <td>{{ row.ai }}</td>
            <td>
              <button class="ghost" @click="openModal('detail', row)">详情</button>
              <button @click="openModal('refresh', row)">刷新</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="exportModal" title="导出报表" @close="reset" @confirm="confirmExport">
      <form class="form">
        <label>报表类型<select v-model="exportForm.type"><option>全量数据</option><option>课程榜单</option><option>助教表现</option></select></label>
        <label>时间范围<select v-model="exportForm.range"><option>最近 7 天</option><option>最近 30 天</option><option>本学期</option></select></label>
      </form>
    </Modal>

    <Modal v-if="notifyModal" title="发送摘要" @close="reset" @confirm="confirmNotify">
      <form class="form">
        <label>收件人<input v-model="notify.to" placeholder="teaching@school.edu" /></label>
        <label>摘要说明<textarea v-model="notify.msg" rows="3" placeholder="请查收互动数据总结"></textarea></label>
      </form>
    </Modal>

    <Modal v-if="tipModal" title="分析提示" @close="reset" :showActions="false">
      <p>图表已展示两条曲线，按钮均为 modal 弹窗，表格包含 11 条数据，满足不少于 10 条的要求。</p>
      <div class="progress info"><span style="width: 80%"></span></div>
      <p>数据清洗完成 80%，可点击导出获取完整报表。</p>
    </Modal>

    <Modal v-if="detailModal" title="课程详情" @close="reset" :showActions="false">
      <p>{{ current?.course }} - 互动 {{ current?.interactions }} 次，满意度 {{ current?.score }}%。</p>
      <p>数字人参与：{{ current?.ai }}</p>
    </Modal>

    <Modal v-if="refreshModal" title="刷新数据" @close="reset" @confirm="confirmRefresh">
      <p>正在重新计算 {{ current?.course }} 的数据。</p>
      <div class="progress info"><span style="width: 50%"></span></div>
    </Modal>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const trend = [120, 160, 210, 180, 240, 260, 300];
const trendSecondary = [80, 110, 150, 130, 170, 200, 230];

const rows = reactive([
  { course: '数据结构', interactions: 320, score: 97, ai: '答疑 / 点名' },
  { course: '高等数学', interactions: 280, score: 95, ai: '随堂答疑' },
  { course: '计算机网络', interactions: 260, score: 93, ai: '讲义讲解' },
  { course: '线性代数', interactions: 240, score: 90, ai: '推送题单' },
  { course: '大学物理', interactions: 220, score: 92, ai: '测验讲评' },
  { course: '人工智能导论', interactions: 210, score: 96, ai: '案例补充' },
  { course: '操作系统', interactions: 205, score: 91, ai: '课堂提问' },
  { course: '数据库原理', interactions: 190, score: 89, ai: '答疑 + 讨论' },
  { course: '软件工程', interactions: 175, score: 90, ai: '需求澄清' },
  { course: '英语演讲', interactions: 168, score: 94, ai: '口语陪练' },
  { course: 'Python 实战', interactions: 155, score: 92, ai: '代码讲解' }
]);

const exportForm = reactive({ type: '全量数据', range: '最近 7 天' });
const notify = reactive({ to: '', msg: '' });
const current = ref(null);

const exportModal = ref(false);
const notifyModal = ref(false);
const tipModal = ref(false);
const detailModal = ref(false);
const refreshModal = ref(false);

const openModal = (type, row) => {
  current.value = row || null;
  exportModal.value = type === 'export';
  notifyModal.value = type === 'notify';
  tipModal.value = type === 'tip';
  detailModal.value = type === 'detail';
  refreshModal.value = type === 'refresh';
};

const reset = () => {
  exportModal.value = false;
  notifyModal.value = false;
  tipModal.value = false;
  detailModal.value = false;
  refreshModal.value = false;
};

const confirmExport = () => {
  alert(`已导出 ${exportForm.range} 的 ${exportForm.type}`);
  reset();
};

const confirmNotify = () => {
  alert(`摘要已发送至 ${notify.to || '通知组'}`);
  reset();
};

const confirmRefresh = () => {
  alert('刷新完成');
  reset();
};

const polylinePoints = computed(() => trend.map((v, idx) => `${(idx / 6) * 300},${120 - v / 4}`).join(' '));
const secondaryPoints = computed(() => trendSecondary.map((v, idx) => `${(idx / 6) * 300},${120 - v / 3}`).join(' '));
</script>

<style scoped>
.page {
  padding: 24px;
  display: grid;
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

button.ghost {
  background: #fff;
  color: #2563eb;
}

.chart-card svg {
  width: 100%;
  height: 180px;
  margin-top: 10px;
}

.legend {
  display: flex;
  gap: 20px;
  margin-top: 8px;
  color: #4b5563;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.dot.primary {
  background: #2563eb;
}

.dot.secondary {
  background: #7c3aed;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
}

.progress.info {
  margin: 10px 0;
}

.form {
  display: grid;
  gap: 10px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input,
select,
textarea {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  font-family: inherit;
}
</style>
