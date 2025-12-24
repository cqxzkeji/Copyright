<template>
  <div class="grid">
    <ChartPanel
      title="渠道GMV趋势"
      subtitle="近7天"
      :labels="chart.labels"
      :values="chart.values"
    />
    <div class="card">
      <div class="section-title">
        <h3>运营看板</h3>
        <div class="actions">
          <button class="btn" @click="showMetric = true">新增指标</button>
          <button class="btn secondary" @click="startReport">生成周报</button>
          <button class="btn ghost" @click="showExport = true">导出报表</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>指标</th>
              <th>今日</th>
              <th>周环比</th>
              <th>目标达成</th>
              <th class="hide-mobile">备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="metric in metrics" :key="metric.name">
              <td>{{ metric.name }}</td>
              <td>{{ metric.today }}</td>
              <td>{{ metric.wow }}</td>
              <td><span class="status-pill" :class="metric.done >= 100 ? 'success' : ''">{{ metric.done }}%</span></td>
              <td class="hide-mobile">{{ metric.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <BaseModal v-model="showMetric" title="添加自定义指标">
    <div class="form-grid">
      <label>指标名称<input v-model="metricForm.name" placeholder="如：短视频成交转化" /></label>
      <label>今日值<input v-model="metricForm.today" placeholder="88000" /></label>
      <label>目标达成<input v-model="metricForm.done" type="number" placeholder="95" /></label>
      <label class="full-width">备注
        <textarea v-model="metricForm.note" rows="3" placeholder="填写监控维度"></textarea>
      </label>
    </div>
    <template #actions>
      <button class="btn ghost" @click="showMetric = false">取消</button>
      <button class="btn" @click="addMetric">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="showExport" title="导出报表">
    <div class="toast">报表将包含近30天分渠道GMV、转化率、履约时效与库存健康度指标。</div>
  </BaseModal>

  <BaseModal v-model="showProgress" title="正在生成周报">
    <p>正在汇总订单、库存与投流数据。</p>
    <div class="progress-bar"><div class="progress-bar__fill" :style="{ width: progress + '%' }"></div></div>
    <p>{{ progress }}% 已完成</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ChartPanel from '../components/ChartPanel.vue';

const showMetric = ref(false);
const showExport = ref(false);
const showProgress = ref(false);
const progress = ref(0);

const chart = {
  labels: ['一', '二', '三', '四', '五', '六', '日'],
  values: [80, 75, 90, 110, 130, 125, 138]
};

const metrics = ref([
  { name: 'GMV', today: '￥1,230,000', wow: '+12%', done: 88, note: '拼团+村播双驱' },
  { name: '支付转化率', today: '4.8%', wow: '+0.6%', done: 102, note: '详情页改版效果显著' },
  { name: '新客数', today: '8,920', wow: '+18%', done: 93, note: '短视频投流' },
  { name: '复购率', today: '23%', wow: '+2%', done: 81, note: '会员日券包' },
  { name: '履约准时率', today: '96%', wow: '+1%', done: 106, note: '冷链提升' },
  { name: '退货率', today: '2.3%', wow: '-0.4%', done: 110, note: '巡检客服质检' },
  { name: '直播成交', today: '￥320,000', wow: '+15%', done: 90, note: '达人共创' },
  { name: '短视频成交', today: '￥210,000', wow: '+9%', done: 85, note: '投流稳步提升' },
  { name: '内容发布量', today: '38条', wow: '+11%', done: 92, note: '模板化产出' },
  { name: '渠道库存周转', today: '18天', wow: '-2天', done: 97, note: '智能补货' }
]);

const metricForm = reactive({ name: '', today: '', wow: '+0%', done: 90, note: '' });

const addMetric = () => {
  if (!metricForm.name) return;
  metrics.value.unshift({ ...metricForm });
  showMetric.value = false;
};

const startReport = () => {
  progress.value = 0;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 700);
    }
  }, 350);
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
