<template>
  <div class="table-card">
    <div class="section-header">
      <div>
        <h2>资产利用监测与绩效评估</h2>
        <p>动态监测使用情况、收益水平、闲置率与周转效率。</p>
      </div>
      <div class="action-row">
        <button @click="showRefresh = true">刷新监测</button>
        <button style="background:#10b981" @click="showExport = true">导出报告</button>
        <button style="background:#eef2ff;color:#0b5bd3" @click="showWarning = true">指标预警</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="bar-chart">
        <h4>闲置率趋势</h4>
        <div v-for="(item, idx) in idleTrend" :key="idx" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ item.month }}</span>
            <span>{{ item.value }}%</span>
          </div>
          <div class="bar"><div class="bar-fill" :style="{ width: item.value + '%' }"></div></div>
        </div>
      </div>
      <div class="progress-chart">
        <h4>绩效得分</h4>
        <div v-for="item in metrics.slice(0,5)" :key="item.id" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ item.asset }}</span>
            <span>{{ item.score }}分</span>
          </div>
          <div class="progress-bar"><div class="progress-bar-fill" :style="{ width: item.score + '%' }"></div></div>
        </div>
      </div>
    </div>

    <table class="table" style="margin-top:12px;">
      <thead>
        <tr>
          <th>资产</th>
          <th>使用率</th>
          <th>收益(万元)</th>
          <th>闲置率</th>
          <th>周转天数</th>
          <th>绩效得分</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in metrics" :key="item.id">
          <td>{{ item.asset }}</td>
          <td>{{ item.utilization }}%</td>
          <td>{{ item.income }}</td>
          <td>{{ item.idle }}%</td>
          <td>{{ item.turnover }}</td>
          <td>{{ item.score }}</td>
          <td><span class="badge" :class="item.utilization > 75 ? 'active' : 'pending'">{{ item.utilization > 75 ? '良好' : '关注' }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showRefresh" title="刷新监测数据" @close="showRefresh = false">
    <p>正在同步最新能耗、租金、访问客流等数据源。</p>
    <div class="progress-bar"><div class="progress-bar-fill" :style="{ width: refreshProgress + '%' }"></div></div>
  </ModalDialog>

  <ModalDialog v-if="showExport" title="导出绩效报告" @close="showExport = false">
    <p>报告包含月度绩效得分、闲置率分析与收益对比，格式：PDF。</p>
  </ModalDialog>

  <ModalDialog v-if="showWarning" title="设置指标预警" @close="showWarning = false">
    <div class="form-grid">
      <div class="input-group">
        <label>闲置率阈值(%)</label>
        <input v-model="warningForm.idle" type="number" />
      </div>
      <div class="input-group">
        <label>收益下限(万元)</label>
        <input v-model="warningForm.income" type="number" />
      </div>
      <div class="input-group">
        <label>通知方式</label>
        <select v-model="warningForm.channel">
          <option>邮件</option>
          <option>短信</option>
          <option>站内信</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button style="background:#eef2ff;color:#0b5bd3" @click="showWarning = false">取消</button>
      <button @click="showWarning = false">保存预警</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showRefresh = ref(false);
const showExport = ref(false);
const showWarning = ref(false);
const refreshProgress = ref(20);

const warningForm = reactive({ idle: 15, income: 120, channel: '邮件' });

const idleTrend = ref([
  { month: '1月', value: 14 },
  { month: '2月', value: 13 },
  { month: '3月', value: 11 },
  { month: '4月', value: 10 },
  { month: '5月', value: 9 },
  { month: '6月', value: 8 }
]);

const metrics = ref([
  { id: 1, asset: '阳光办公楼', utilization: 86, income: 320, idle: 5, turnover: 18, score: 92 },
  { id: 2, asset: '产业孵化中心', utilization: 80, income: 410, idle: 8, turnover: 25, score: 88 },
  { id: 3, asset: '临街商铺组团', utilization: 78, income: 260, idle: 10, turnover: 30, score: 84 },
  { id: 4, asset: '旧粮仓', utilization: 42, income: 140, idle: 35, turnover: 58, score: 61 },
  { id: 5, asset: '历史街区房', utilization: 51, income: 160, idle: 28, turnover: 40, score: 70 },
  { id: 6, asset: '社区服务中心', utilization: 82, income: 230, idle: 7, turnover: 20, score: 89 },
  { id: 7, asset: '物流场站', utilization: 38, income: 120, idle: 45, turnover: 65, score: 55 },
  { id: 8, asset: '人才公寓', utilization: 90, income: 300, idle: 3, turnover: 14, score: 95 },
  { id: 9, asset: '滨河文创厂房', utilization: 57, income: 180, idle: 23, turnover: 44, score: 73 },
  { id: 10, asset: '广场地下空间', utilization: 35, income: 150, idle: 48, turnover: 70, score: 58 },
  { id: 11, asset: '公共停车楼', utilization: 75, income: 210, idle: 12, turnover: 32, score: 82 },
  { id: 12, asset: '科研实验楼', utilization: 68, income: 240, idle: 16, turnover: 28, score: 79 },
  { id: 13, asset: '沿街老旧住宅', utilization: 47, income: 130, idle: 32, turnover: 55, score: 64 },
  { id: 14, asset: '文化活动中心', utilization: 81, income: 260, idle: 9, turnover: 22, score: 90 },
  { id: 15, asset: '闲置厂房', utilization: 33, income: 110, idle: 50, turnover: 76, score: 52 },
  { id: 16, asset: '综合体育馆', utilization: 79, income: 280, idle: 11, turnover: 24, score: 87 },
  { id: 17, asset: '教学培训楼', utilization: 74, income: 200, idle: 14, turnover: 27, score: 83 },
  { id: 18, asset: '立体车库', utilization: 69, income: 190, idle: 17, turnover: 31, score: 78 },
  { id: 19, asset: '城郊农贸市场', utilization: 64, income: 175, idle: 19, turnover: 36, score: 76 },
  { id: 20, asset: '科技孵化楼', utilization: 72, income: 260, idle: 15, turnover: 29, score: 85 }
]);

onMounted(() => {
  const timer = setInterval(() => {
    refreshProgress.value = Math.min(refreshProgress.value + 15, 100);
    if (refreshProgress.value === 100) clearInterval(timer);
  }, 550);
});
</script>
