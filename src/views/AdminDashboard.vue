<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 16px;">
    <section class="card">
      <div class="header">
        <h2>管理与分析</h2>
        <div class="actions">
          <button class="btn" @click="showReport = true">生成报表</button>
          <button class="btn secondary" @click="showAlert = true">告警</button>
          <button class="btn" @click="showSetting = true">配置</button>
        </div>
      </div>
      <p v-if="statusMessage" class="status">{{ statusMessage }}</p>
      <table class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>状态</th>
            <th>消耗</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in projects" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
            <td>{{ item.cost }}</td>
            <td>
              <button class="btn secondary" @click="openBudget(item)">预算</button>
              <button class="btn" @click="openInsight(item)">洞察</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <div class="header">
        <h3>监控概览</h3>
        <button class="btn secondary" @click="showMonitor = true">刷新</button>
      </div>
      <div class="dashboard-chart">
        <div v-for="item in monitors" :key="item.label" class="bar" :style="{ height: item.value + 'px' }">
          {{ item.label }}
        </div>
      </div>
      <ul class="chips">
        <li v-for="item in tags" :key="item" class="chip">{{ item }}</li>
      </ul>
      <div v-if="reports.length" class="reports">
        <h4>最近报表</h4>
        <ul>
          <li v-for="report in reports" :key="report.time">{{ report.title }} · {{ report.format }}</li>
        </ul>
      </div>
    </section>
  </div>

  <Modal v-if="showReport" title="生成报表" @close="showReport = false">
    <form class="form-grid" @submit.prevent="generateReport">
      <label>选择周期</label>
      <select v-model="reportRange">
        <option>最近 7 天</option>
        <option>最近 30 天</option>
      </select>
      <label>输出格式</label>
      <select v-model="reportFormat">
        <option>PDF</option>
        <option>XLSX</option>
      </select>
      <button class="btn" type="submit">生成</button>
    </form>
  </Modal>

  <Modal v-if="showAlert" title="平台告警" @close="showAlert = false">
    <p>发现 2 条数据异常，已自动降级部分推荐位。</p>
    <button class="btn" @click="showAlert = false">确认</button>
  </Modal>

  <Modal v-if="showSetting" title="配置开关" @close="showSetting = false">
    <form class="form-grid" @submit.prevent="saveSetting">
      <label>流量保护</label>
      <select v-model="settingForm.protect">
        <option>自动</option>
        <option>手动</option>
      </select>
      <label>发布审批</label>
      <select v-model="settingForm.review">
        <option>需要</option>
        <option>跳过</option>
      </select>
      <button class="btn" type="submit">保存配置</button>
    </form>
  </Modal>

  <Modal v-if="activeBudget" :title="`调整 ${activeBudget.name} 预算`" @close="activeBudget = null">
    <form class="form-grid" @submit.prevent="submitBudget">
      <label>日预算</label>
      <input v-model.number="budgetForm.daily" type="number" min="0" step="500" />
      <label>投放上限</label>
      <input v-model.number="budgetForm.cap" type="number" min="0" step="1000" />
      <button class="btn" type="submit">保存</button>
    </form>
  </Modal>

  <Modal v-if="activeInsight" :title="`${activeInsight.name} 洞察`" @close="activeInsight = null">
    <p>正在生成频道曝光曲线... {{ insightProgress }}%</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: insightProgress + '%' }"></div>
    </div>
  </Modal>

  <Modal v-if="showMonitor" title="刷新监控" @close="showMonitor = false">
    <p>刷新会重新计算质量分，预计耗时 30 秒。</p>
    <button class="btn" @click="refreshMonitors">开始刷新</button>
  </Modal>
</template>

<script setup>
import { reactive, ref, onUnmounted, watch } from 'vue';
import Modal from '../components/Modal.vue';

const showReport = ref(false);
const showAlert = ref(false);
const showSetting = ref(false);
const showMonitor = ref(false);
const insightProgress = ref(30);
const activeBudget = ref(null);
const activeInsight = ref(null);
const statusMessage = ref('');
const reportRange = ref('最近 7 天');
const reportFormat = ref('PDF');
const settingForm = reactive({ protect: '自动', review: '需要' });
const budgetForm = reactive({ daily: 0, cap: 0 });
const reports = reactive([]);
let insightTimer;

const projects = reactive([
  { name: '城市夜景池', type: '推荐计划', status: '在线', cost: '¥12,300' },
  { name: '新品测温', type: '品牌活动', status: '暂停', cost: '¥8,120' },
  { name: '创作者孵化', type: '运营', status: '在线', cost: '¥6,430' },
  { name: '夜市直播带货', type: '直播', status: '排期', cost: '¥9,120' },
  { name: '手绘创作节', type: '活动', status: '排期', cost: '¥4,300' },
  { name: '萌宠主题周', type: '主题策划', status: '在线', cost: '¥10,200' },
  { name: '高铁旅行季', type: '推广', status: '暂停', cost: '¥3,800' },
  { name: '健身挑战赛', type: '活动', status: '在线', cost: '¥5,900' },
  { name: '滑板新星计划', type: '招募', status: '审核中', cost: '¥2,700' },
  { name: '咖啡主题周', type: '主题策划', status: '在线', cost: '¥4,600' },
  { name: '街头音乐节', type: '活动', status: '在线', cost: '¥6,700' },
  { name: '露营季', type: '推荐计划', status: '在线', cost: '¥7,300' }
]);

const monitors = reactive([
  { label: '播放', value: 140 },
  { label: '互动', value: 170 },
  { label: '转化', value: 120 },
  { label: '留存', value: 150 },
  { label: '风控', value: 110 }
]);

const tags = reactive(['投放安全', '成本优化', '流量保护', '实验组']);

const openBudget = (item) => {
  activeBudget.value = item;
  budgetForm.daily = Number(item.cost.replace(/[^0-9]/g, '')) || 0;
  budgetForm.cap = budgetForm.daily * 2;
};

const openInsight = (item) => {
  activeInsight.value = item;
};

const generateReport = () => {
  const entry = {
    title: `${reportRange.value} 报表`,
    format: reportFormat.value,
    time: Date.now()
  };
  reports.unshift(entry);
  statusMessage.value = `${entry.title} 已生成 (${entry.format})`;
  showReport.value = false;
};

const saveSetting = () => {
  statusMessage.value = `配置已保存：流量${settingForm.protect}，审批${settingForm.review}`;
  showSetting.value = false;
};

const submitBudget = () => {
  if (activeBudget.value) {
    activeBudget.value.cost = `¥${budgetForm.daily.toLocaleString()}`;
    activeBudget.value.status = '预算已调优';
    statusMessage.value = `${activeBudget.value.name} 日预算调整为 ¥${budgetForm.daily.toLocaleString()}`;
  }
  activeBudget.value = null;
};

const refreshMonitors = () => {
  monitors.forEach((item) => (item.value = Math.min(220, item.value + Math.round(Math.random() * 25))));
  const newTag = `刷新于 ${new Date().toLocaleTimeString()}`;
  tags.push(newTag);
  statusMessage.value = '监控数据已刷新';
  showMonitor.value = false;
};

watch(
  () => activeInsight.value,
  (insight) => {
    clearInterval(insightTimer);
    if (insight) {
      insightProgress.value = 30;
      insightTimer = setInterval(() => {
        insightProgress.value = Math.min(100, insightProgress.value + 12);
        if (insightProgress.value >= 100) {
          statusMessage.value = `${insight.name} 曝光洞察已生成`;
          activeInsight.value = null;
          clearInterval(insightTimer);
        }
      }, 700);
    }
  }
);

onUnmounted(() => clearInterval(insightTimer));
</script>

<style scoped>
.chips {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reports ul {
  padding-left: 16px;
  margin: 6px 0 0;
}

.status {
  margin: 6px 0;
  font-weight: 600;
  color: #111827;
}
</style>
