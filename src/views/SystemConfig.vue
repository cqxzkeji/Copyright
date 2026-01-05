<template>
  <div class="grid" style="gap:16px;">
    <div class="card">
      <div class="toolbar" style="justify-content: space-between;">
        <div>
          <h3 class="section-title">数据分析与系统配置</h3>
          <p class="muted">统计分析、通信方式管理与系统运行参数维护。</p>
        </div>
        <div class="toolbar">
          <button class="btn" @click="openAnalysis = true">统计分析</button>
          <button class="btn secondary" @click="openConfig = true">保存配置</button>
          <button class="btn ghost" @click="syncTime">同步时间</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
        <div class="card" v-for="item in analytics" :key="item.title">
          <h4 class="section-title">{{ item.title }}</h4>
          <div class="progress-track" style="margin:8px 0;">
            <div class="progress-bar" :style="{ width: item.value + '%' }"></div>
          </div>
          <p class="muted">{{ item.note }}</p>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:1.2fr 1fr;gap:16px;">
      <div class="card">
        <div class="toolbar" style="justify-content: space-between;">
          <h4 class="section-title">通信与运行参数</h4>
          <button class="btn ghost" @click="openComm = true">通信方式</button>
        </div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
          <div class="card" v-for="item in commStatus" :key="item.label">
            <strong>{{ item.label }}</strong>
            <p class="muted">{{ item.value }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="toolbar" style="justify-content: space-between;">
          <h4 class="section-title">配置记录表（20+）</h4>
          <button class="btn secondary" @click="openTableHint = true">表格提示</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>时间</th>
              <th>参数项</th>
              <th>数值</th>
              <th>操作人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in configRows" :key="row.time + row.item">
              <td>{{ row.time }}</td>
              <td>{{ row.item }}</td>
              <td>{{ row.value }}</td>
              <td>{{ row.operator }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog :open="openAnalysis" @close="openAnalysis = false" @confirm="openAnalysis = false">
      <template #title><h3 style="margin:0;">统计分析</h3></template>
      <p>已完成数据统计，生成趋势图与告警列表，可导出 CSV。</p>
    </ModalDialog>
    <ModalDialog :open="openConfig" @close="openConfig = false" @confirm="openConfig = false">
      <template #title><h3 style="margin:0;">保存配置</h3></template>
      <div class="input-row">
        <label>温度阈值<input v-model.number="settings.temp" type="number" /></label>
        <label>电源策略<select v-model="settings.power"><option>高性能</option><option>均衡</option><option>节能</option></select></label>
      </div>
    </ModalDialog>
    <ProgressModal :open="openSync" :progress="syncProgress" title="时间同步" subtitle="同步中" @close="openSync = false" @confirm="openSync = false" />
    <ModalDialog :open="openComm" @close="openComm = false" @confirm="openComm = false">
      <template #title><h3 style="margin:0;">通信方式</h3></template>
      <ul style="margin:0;padding-left:18px;">
        <li>WiFi：{{ commStatus[0].value }}</li>
        <li>蓝牙：{{ commStatus[1].value }}</li>
        <li>有线：{{ commStatus[2].value }}</li>
      </ul>
    </ModalDialog>
    <ModalDialog :open="openTableHint" @close="openTableHint = false" @confirm="openTableHint = false">
      <template #title><h3 style="margin:0;">表格提示</h3></template>
      <p>配置记录表包含 20+ 条历史记录，可追溯参数变更。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressModal from '../components/ProgressModal.vue';

const analytics = reactive([
  { title: '距离偏差趋势', value: 74, note: '下降 3%' },
  { title: '角度波动趋势', value: 68, note: '稳定区间内' },
  { title: '速度一致性', value: 82, note: '平稳提升' },
  { title: '通信成功率', value: 91, note: 'WiFi/蓝牙稳定' }
]);

const commStatus = reactive([
  { label: 'WiFi', value: '开启 · 2.4G & 5G 负载均衡' },
  { label: '蓝牙', value: '可发现 · 自动重连' },
  { label: '有线', value: '千兆以太网 · VLAN 隔离' }
]);

const configRows = reactive(Array.from({ length: 22 }).map((_, i) => ({
  time: `2024-05-1${Math.floor(i / 10)} ${(8 + i).toString().padStart(2, '0')}:20`,
  item: ['温度阈值', '电源策略', '通信信道', '风扇档位'][i % 4],
  value: ['75℃', '均衡', '自动', '智能'][i % 4],
  operator: ['工程师A', '工程师B', '系统'][i % 3]
})));

const settings = reactive({ temp: 72, power: '均衡' });
const openAnalysis = ref(false);
const openConfig = ref(false);
const openSync = ref(false);
const openComm = ref(false);
const openTableHint = ref(false);
const syncProgress = ref(0);

const syncTime = () => {
  syncProgress.value = 45;
  openSync.value = true;
};
</script>

<style scoped>
.muted { color: var(--muted); margin: 4px 0 0; }
</style>
