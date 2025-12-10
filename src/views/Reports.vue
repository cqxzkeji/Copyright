<template>
  <div class="card">
    <header style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
      <div>
        <h3 style="margin: 0;">报表中心</h3>
        <p class="tagline">销售趋势、库存健康度、产品动销</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn" @click="openFilter">条件筛选</button>
        <button class="btn secondary" @click="openExport">导出报表</button>
      </div>
    </header>
    <div class="grid cols-2" style="margin-bottom: 16px; align-items: stretch;">
      <div class="card" style="box-shadow: none; background: #ecfeff; border-color: #bae6fd;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 700;">近10日销量走势</div>
            <div class="tagline">每日销量(件)</div>
          </div>
          <button class="btn" @click="openInsight('销量图已按最新10天数据计算')">查看说明</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 10px; align-items: end; height: 200px; margin-top: 16px;">
          <div v-for="point in salesTrend" :key="point.day" style="text-align: center;">
            <div :style="{ height: `${point.value}px`, background: 'linear-gradient(180deg, #0ea5e9, #22c55e)', borderRadius: '10px', boxShadow: '0 6px 12px rgba(14,165,233,0.3)' }"></div>
            <small style="display: block; margin-top: 6px; color: #0f172a;">{{ point.day }}</small>
          </div>
        </div>
      </div>
      <div class="card" style="box-shadow: none; background: #f0f9ff; border-color: #dbeafe;">
        <div style="font-weight: 700;">SKU 动销占比</div>
        <div class="tagline">按销量排名前10的产品</div>
        <ul style="list-style: none; padding: 0; margin-top: 10px; display: grid; gap: 8px;">
          <li v-for="item in topSkus" :key="item.name" style="background: #fff; border-radius: 12px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
            <span>{{ item.name }}</span>
            <span style="font-weight: 800; color: #0ea5e9;">{{ item.volume }} 件</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card" style="box-shadow: none; border-color: #e2e8f0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div>
          <div style="font-weight: 700;">数据明细</div>
          <div class="tagline">包含产品、销量、毛利等指标</div>
        </div>
        <button class="btn" @click="openInsight('表格支持筛选结果导出，点击导出按钮可查看进度。')">表格说明</button>
      </div>
      <div style="overflow-x: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>产品</th>
              <th>销量(件)</th>
              <th>收入(元)</th>
              <th>毛利率</th>
              <th>库存周转(天)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in detailRows" :key="row.name">
              <td>{{ row.name }}</td>
              <td>{{ row.volume }}</td>
              <td>{{ row.revenue }}</td>
              <td>{{ row.margin }}%</td>
              <td>{{ row.turnover }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showFilter" title="筛选条件" @confirm="applyFilter">
    <label>时间范围</label>
    <select class="input" v-model="filters.range">
      <option>近7天</option>
      <option>近30天</option>
      <option>季度</option>
    </select>
    <label>品类</label>
    <input class="input" v-model="filters.category" placeholder="可输入水果/蔬菜/粮油" />
  </ModalDialog>

  <ModalDialog v-model="showExport" title="导出进度">
    <p>正在导出报表为 XLSX，完成后会提示。</p>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${exportProgress}%` }"></div>
    </div>
    <template #footer>
      <button class="btn" @click="simulateExport">刷新进度</button>
      <button class="btn secondary" @click="showExport = false">关闭</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showInsight" title="提示">
    <p>{{ insight }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const salesTrend = reactive([
  { day: 'D1', value: 60 },
  { day: 'D2', value: 90 },
  { day: 'D3', value: 70 },
  { day: 'D4', value: 110 },
  { day: 'D5', value: 130 },
  { day: 'D6', value: 75 },
  { day: 'D7', value: 95 },
  { day: 'D8', value: 105 },
  { day: 'D9', value: 120 },
  { day: 'D10', value: 140 }
]);

const topSkus = reactive([
  { name: '富硒苹果', volume: 320 },
  { name: '有机西红柿', volume: 280 },
  { name: '冬枣', volume: 250 },
  { name: '草莓', volume: 230 },
  { name: '黄心土豆', volume: 210 },
  { name: '鲜鸡蛋', volume: 205 },
  { name: '菜籽油', volume: 190 },
  { name: '糙米', volume: 180 },
  { name: '藜麦', volume: 170 },
  { name: '有机胡萝卜', volume: 165 }
]);

const detailRows = reactive([
  { name: '富硒苹果', volume: 320, revenue: '¥25,600', margin: 32, turnover: 6 },
  { name: '有机西红柿', volume: 280, revenue: '¥10,480', margin: 28, turnover: 7 },
  { name: '冬枣', volume: 250, revenue: '¥14,250', margin: 30, turnover: 5 },
  { name: '草莓', volume: 230, revenue: '¥18,400', margin: 35, turnover: 4 },
  { name: '黄心土豆', volume: 210, revenue: '¥5,880', margin: 24, turnover: 8 },
  { name: '鲜鸡蛋', volume: 205, revenue: '¥10,250', margin: 26, turnover: 7 },
  { name: '菜籽油', volume: 190, revenue: '¥32,000', margin: 18, turnover: 15 },
  { name: '糙米', volume: 180, revenue: '¥9,360', margin: 22, turnover: 11 },
  { name: '藜麦', volume: 170, revenue: '¥15,300', margin: 25, turnover: 12 },
  { name: '有机胡萝卜', volume: 165, revenue: '¥6,270', margin: 27, turnover: 9 }
]);

const showFilter = ref(false);
const showExport = ref(false);
const showInsight = ref(false);
const exportProgress = ref(25);
const insight = ref('');
const filters = reactive({ range: '近7天', category: '' });

const openFilter = () => {
  showFilter.value = true;
};

const openExport = () => {
  showExport.value = true;
};

const openInsight = (text) => {
  insight.value = text;
  showInsight.value = true;
};

const applyFilter = () => {
  showFilter.value = false;
  openInsight(`筛选已应用：${filters.range}，品类 ${filters.category || '全部'}`);
};

const simulateExport = () => {
  exportProgress.value = Math.min(100, exportProgress.value + 20);
  if (exportProgress.value >= 100) {
    insight.value = '报表已导出，可在下载中心查看';
    showInsight.value = true;
  }
};

const openExportProgress = () => {
  showExport.value = true;
};
</script>
