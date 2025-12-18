<template>
  <div class="grid">
    <div class="card">
      <h3>销售趋势</h3>
      <div class="chart">
        <div v-for="point in sales" :key="point.label" class="bar" :style="{ height: point.value + 'px' }">
          <span>{{ point.label }}</span>
        </div>
      </div>
      <div class="stat-bar" v-for="channel in channels" :key="channel.name">
        <div style="min-width: 70px;">{{ channel.name }}</div>
        <div class="bar"><span :style="{ width: channel.rate + '%' }"></span></div>
        <span style="color: var(--muted);">{{ channel.rate }}%</span>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap;">
        <button @click="showExport = true">导出报表</button>
        <button class="ghost" @click="showRefresh = true">刷新指标</button>
      </div>
    </div>

    <div class="card">
      <h3>数据统计表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>今日</th>
            <th>昨日</th>
            <th>环比</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in stats" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.today }}</td>
            <td>{{ row.yesterday }}</td>
            <td><span class="badge">{{ row.rate }}</span></td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="showExport" title="导出报表">
    <p style="margin-top: 0;">选择导出范围后生成 Excel，并展示进度。</p>
    <div class="form-grid">
      <div>
        <label>日期范围</label>
        <input v-model="exportForm.range" placeholder="近7天" />
      </div>
      <div>
        <label>包含模块</label>
        <input v-model="exportForm.modules" placeholder="用户/订单/商品" />
      </div>
    </div>
    <div class="progress-track" style="margin-top: 12px;">
      <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
    </div>
    <template #footer>
      <button class="ghost" @click="showExport = false">取消</button>
      <button @click="runExport">生成</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showRefresh" title="刷新指标">
    <p style="margin-top: 0;">重新拉取 BI 数据会消耗 API 配额，请确认。</p>
    <template #footer>
      <button class="ghost" @click="showRefresh = false">稍后</button>
      <button class="secondary" @click="refresh">立即刷新</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showInfo" title="操作提示">
    <p style="margin: 0; color: var(--muted);">{{ infoMessage }}</p>
    <template #footer>
      <button class="ghost" @click="showInfo = false">好的</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const sales = ref([
  { label: '周一', value: 80 },
  { label: '周二', value: 120 },
  { label: '周三', value: 160 },
  { label: '周四', value: 140 },
  { label: '周五', value: 200 },
  { label: '周六', value: 170 },
  { label: '周日', value: 210 }
]);

const channels = ref([
  { name: '小程序', rate: 62 },
  { name: 'APP', rate: 55 },
  { name: 'PC', rate: 48 },
  { name: '社群', rate: 36 }
]);

const stats = ref([
  { name: 'GMV', today: '¥580,000', yesterday: '¥520,000', rate: '+11.5%', note: '活动拉升' },
  { name: '支付转化率', today: '12.3%', yesterday: '11.6%', rate: '+0.7%', note: '渠道投放' },
  { name: '客单价', today: '¥96', yesterday: '¥91', rate: '+5.5%', note: '组合装提升' },
  { name: '复购率', today: '32%', yesterday: '30%', rate: '+2%', note: '会员权益' },
  { name: '退款率', today: '1.2%', yesterday: '1.4%', rate: '-0.2%', note: '售后优化' },
  { name: '履约准时率', today: '97%', yesterday: '96%', rate: '+1%', note: '路线优化' },
  { name: '库存周转天数', today: '18天', yesterday: '20天', rate: '-2天', note: '周转提升' },
  { name: '客服满意度', today: '4.8', yesterday: '4.7', rate: '+0.1', note: '质检' },
  { name: 'UV', today: '28,000', yesterday: '26,500', rate: '+5.6%', note: '投放增长' },
  { name: 'DAU', today: '9,800', yesterday: '9,200', rate: '+6.5%', note: '活跃提升' }
]);

const showExport = ref(false);
const showRefresh = ref(false);
const exportProgress = ref(28);
const showInfo = ref(false);
const infoMessage = ref('');

const exportForm = reactive({
  range: '近7天',
  modules: '用户/订单/商品'
});

const runExport = () => {
  exportProgress.value = Math.min(100, exportProgress.value + 30);
  infoMessage.value = '导出任务已提交，生成完成后将自动下载';
  showInfo.value = true;
};

const refresh = () => {
  infoMessage.value = '已刷新 BI 指标';
  showRefresh.value = false;
  showInfo.value = true;
};
</script>
