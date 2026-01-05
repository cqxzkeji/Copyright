<template>
  <div class="table-card">
    <div class="section-header">
      <div>
        <h2>数据统计分析与可视化展示</h2>
        <p>通过区域、类型、用途维度展示盘活成效与收益变化。</p>
      </div>
      <div class="action-row">
        <button @click="showFilter = true">自定义筛选</button>
        <button style="background:#10b981" @click="showGenerate = true">生成图表</button>
        <button style="background:#eef2ff;color:#0b5bd3" @click="showDownload = true">下载数据</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="bar-chart">
        <h4>区域资产规模（万㎡）</h4>
        <div v-for="item in regionStats" :key="item.region" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ item.region }}</span>
            <span>{{ item.area }}</span>
          </div>
          <div class="bar"><div class="bar-fill" :style="{ width: item.percent + '%' }"></div></div>
        </div>
      </div>
      <div class="bar-chart">
        <h4>收益变化（万元）</h4>
        <div v-for="item in revenueChanges" :key="item.name" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ item.name }}</span>
            <span>{{ item.value }}</span>
          </div>
          <div class="bar"><div class="bar-fill" :style="{ width: item.percent + '%' }"></div></div>
        </div>
      </div>
    </div>

    <table class="table" style="margin-top:12px;">
      <thead>
        <tr>
          <th>区域</th>
          <th>资产数量</th>
          <th>面积(万㎡)</th>
          <th>平均收益率</th>
          <th>盘活项目数</th>
          <th>空置率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in regionDetails" :key="item.region">
          <td>{{ item.region }}</td>
          <td>{{ item.count }}</td>
          <td>{{ item.area }}</td>
          <td>{{ item.roi }}%</td>
          <td>{{ item.projects }}</td>
          <td>{{ item.vacancy }}%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showFilter" title="自定义筛选" @close="showFilter = false">
    <div class="form-grid">
      <div class="input-group">
        <label>区域</label>
        <select v-model="filter.region">
          <option>全区</option>
          <option>东片区</option>
          <option>西片区</option>
          <option>南片区</option>
          <option>北片区</option>
        </select>
      </div>
      <div class="input-group">
        <label>用途</label>
        <select v-model="filter.usage">
          <option>全部</option>
          <option>商业</option>
          <option>产业</option>
          <option>公共</option>
        </select>
      </div>
      <div class="input-group">
        <label>时间区间</label>
        <input v-model="filter.period" placeholder="2024Q1-2024Q2" />
      </div>
    </div>
    <template #footer>
      <button style="background:#eef2ff;color:#0b5bd3" @click="showFilter = false">取消</button>
      <button @click="showFilter = false">应用筛选</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showGenerate" title="正在生成图表" @close="showGenerate = false">
    <p>正在根据最新筛选条件渲染多维统计图和热力图，请稍候。</p>
    <div class="progress-bar"><div class="progress-bar-fill" :style="{ width: generateProgress + '%' }"></div></div>
  </ModalDialog>

  <ModalDialog v-if="showDownload" title="下载数据" @close="showDownload = false">
    <p>可下载CSV、XLSX或PDF格式，包含基础数据和汇总指标。</p>
  </ModalDialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showFilter = ref(false);
const showGenerate = ref(false);
const showDownload = ref(false);
const generateProgress = ref(35);

const filter = reactive({ region: '全区', usage: '全部', period: '2024Q1-2024Q2' });

const regionStats = ref([
  { region: '东片区', area: 38, percent: 86 },
  { region: '西片区', area: 24, percent: 62 },
  { region: '南片区', area: 19, percent: 48 },
  { region: '北片区', area: 16, percent: 41 }
]);

const revenueChanges = ref([
  { name: '商业提升', value: 320, percent: 90 },
  { name: '合作运营', value: 260, percent: 74 },
  { name: '改造升级', value: 220, percent: 63 },
  { name: '功能置换', value: 180, percent: 52 }
]);

const regionDetails = ref([
  { region: '东片区', count: 42, area: 38, roi: 7.8, projects: 18, vacancy: 8 },
  { region: '西片区', count: 33, area: 24, roi: 6.4, projects: 15, vacancy: 11 },
  { region: '南片区', count: 27, area: 19, roi: 6.9, projects: 12, vacancy: 10 },
  { region: '北片区', count: 24, area: 16, roi: 6.1, projects: 10, vacancy: 12 },
  { region: '中心区', count: 35, area: 29, roi: 8.2, projects: 16, vacancy: 7 },
  { region: '科创走廊', count: 18, area: 22, roi: 9.1, projects: 9, vacancy: 6 },
  { region: '滨河带', count: 21, area: 18, roi: 7.3, projects: 11, vacancy: 9 },
  { region: '综合保税区', count: 16, area: 20, roi: 8.7, projects: 7, vacancy: 5 },
  { region: '老城区', count: 28, area: 14, roi: 5.5, projects: 13, vacancy: 14 },
  { region: '新区拓展', count: 19, area: 17, roi: 6.8, projects: 8, vacancy: 10 },
  { region: '绿色示范区', count: 14, area: 12, roi: 6.5, projects: 6, vacancy: 9 },
  { region: '产业先导区', count: 22, area: 25, roi: 7.9, projects: 10, vacancy: 7 },
  { region: '物流枢纽区', count: 17, area: 21, roi: 6.7, projects: 9, vacancy: 11 },
  { region: '文旅融合区', count: 20, area: 15, roi: 6.2, projects: 8, vacancy: 12 },
  { region: '教育集聚区', count: 15, area: 13, roi: 7.0, projects: 7, vacancy: 8 },
  { region: '港口经济区', count: 13, area: 16, roi: 7.5, projects: 6, vacancy: 9 },
  { region: '数字经济区', count: 18, area: 19, roi: 8.4, projects: 9, vacancy: 6 },
  { region: '医养结合区', count: 11, area: 12, roi: 6.1, projects: 5, vacancy: 10 },
  { region: '综合行政区', count: 23, area: 18, roi: 7.2, projects: 10, vacancy: 7 },
  { region: '空港配套区', count: 12, area: 14, roi: 6.6, projects: 5, vacancy: 11 }
]);

onMounted(() => {
  const timer = setInterval(() => {
    generateProgress.value = Math.min(generateProgress.value + 10, 100);
    if (generateProgress.value === 100) clearInterval(timer);
  }, 400);
});
</script>
