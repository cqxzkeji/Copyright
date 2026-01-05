<template>
  <div class="grid" style="gap:16px;">
    <div class="card">
      <div class="toolbar" style="justify-content: space-between;">
        <div>
          <h3 class="section-title">数据记录与报告生成</h3>
          <p class="muted">支持手动/自动记录，关键截图与标准化报告一键生成。</p>
        </div>
        <div class="toolbar">
          <button class="btn" @click="toggleAuto">{{ autoRecord ? '停止自动记录' : '开启自动记录' }}</button>
          <button class="btn secondary" @click="openSnapshot = true">关键截图</button>
          <button class="btn ghost" @click="generateReport">生成报告</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>记录编号</th>
            <th>设备</th>
            <th>距离</th>
            <th>角度</th>
            <th>时间</th>
            <th>模式</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in records" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.device }}</td>
            <td>{{ row.distance }} m</td>
            <td>{{ row.angle }}°</td>
            <td>{{ row.time }}</td>
            <td>{{ row.mode }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid" style="grid-template-columns:2fr 1fr;gap:16px;">
      <div class="card">
        <div class="toolbar" style="justify-content: space-between;">
          <h4 class="section-title">数据趋势</h4>
          <button class="btn ghost" @click="showTrend = true">趋势弹窗</button>
        </div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr));">
          <div class="card" v-for="item in trend" :key="item.label">
            <strong>{{ item.label }}</strong>
            <div class="progress-track" style="margin-top:8px;">
              <div class="progress-bar" :style="{ width: item.value + '%' }"></div>
            </div>
            <p class="muted">{{ item.note }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="toolbar" style="justify-content: space-between;">
          <h4 class="section-title">记录控制</h4>
          <button class="btn secondary" @click="openForm = true">手动记录</button>
        </div>
        <ul style="margin:0;padding-left:18px;">
          <li>自动记录：{{ autoRecord ? '开启' : '关闭' }}</li>
          <li>截图保存：启用</li>
          <li>报告模板：标准 V3</li>
        </ul>
      </div>
    </div>

    <ModalDialog :open="openSnapshot" @close="openSnapshot = false" @confirm="openSnapshot = false">
      <template #title><h3 style="margin:0;">关键截图</h3></template>
      <p>已保存当前监控截图到 /records/snapshots/，并添加水印。</p>
    </ModalDialog>
    <ModalDialog :open="openTrend" @close="openTrend = false" @confirm="openTrend = false">
      <template #title><h3 style="margin:0;">趋势详情</h3></template>
      <p>最近 30 条记录已完成趋势分析，峰值 {{ Math.max(...trend.map(t => t.value)) }}%。</p>
    </ModalDialog>
    <ModalDialog :open="openForm" @close="openForm = false" @confirm="addRecord">
      <template #title><h3 style="margin:0;">手动记录</h3></template>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">
        <label class="input-row">设备<input v-model="form.device" placeholder="如：设备-1" /></label>
        <label class="input-row">距离<input v-model.number="form.distance" type="number" /></label>
        <label class="input-row">角度<input v-model.number="form.angle" type="number" /></label>
        <label class="input-row">模式<select v-model="form.mode"><option>自动</option><option>手动</option><option>回放</option></select></label>
      </div>
    </ModalDialog>
    <ProgressModal :open="openReport" :progress="reportProgress" title="报告生成" subtitle="生成中" @close="openReport = false" @confirm="openReport = false" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressModal from '../components/ProgressModal.vue';

const records = reactive(Array.from({ length: 21 }).map((_, i) => ({
  id: 1000 + i,
  device: `设备-${(i % 6) + 1}`,
  distance: (20 + i * 0.5).toFixed(1),
  angle: (i * 3.2).toFixed(1),
  time: `2024-05-20 10:${(i + 10).toString().padStart(2, '0')}`,
  mode: ['自动', '手动', '回放'][i % 3]
})));

const trend = reactive([
  { label: '距离稳定度', value: 86, note: '无明显抖动' },
  { label: '角度一致性', value: 78, note: '波动 < 2°' },
  { label: '截图完整度', value: 92, note: '关键帧齐全' },
  { label: '报告完成度', value: 64, note: '等待导出' }
]);

const autoRecord = ref(true);
const openSnapshot = ref(false);
const openTrend = ref(false);
const openForm = ref(false);
const openReport = ref(false);
const reportProgress = ref(0);
const form = reactive({ device: '', distance: 0, angle: 0, mode: '自动' });

const toggleAuto = () => {
  autoRecord.value = !autoRecord.value;
  openTrend.value = true;
};
const generateReport = () => {
  reportProgress.value = 30;
  openReport.value = true;
};
const addRecord = () => {
  records.unshift({
    id: Date.now(),
    device: form.device || '临时设备',
    distance: form.distance,
    angle: form.angle,
    time: new Date().toLocaleString(),
    mode: form.mode
  });
  openForm.value = false;
};
const showTrend = () => {
  openTrend.value = true;
};
</script>

<style scoped>
.muted { color: var(--muted); margin: 4px 0 0; }
</style>
