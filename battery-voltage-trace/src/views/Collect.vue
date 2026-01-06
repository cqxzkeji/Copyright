<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom: 12px;">
      <div>
        <h3 class="section-title">电压数据采集</h3>
        <p style="color:var(--muted);">实时采集电压数据，支持异常过滤与数据校验。</p>
      </div>
      <div class="toolbar">
        <button class="btn btn-primary" @click="startModal = true">启动采集</button>
        <button class="btn btn-ghost" @click="filterModal = true">异常过滤</button>
        <button class="btn btn-ghost" @click="calibrateModal = true">数据校验</button>
      </div>
    </div>

    <div class="panel-grid">
      <div class="card">
        <div class="flex-between">
          <p style="font-weight:700;">实时电压曲线</p>
          <div class="tag"><span class="status-dot" style="background:#23c19a;"></span> 采集中</div>
        </div>
        <svg viewBox="0 0 320 120" style="width:100%; margin-top: 10px;">
          <polyline :points="points" fill="none" stroke="url(#grad1)" stroke-width="3" />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#1f7aec" />
              <stop offset="100%" stop-color="#23c19a" />
            </linearGradient>
          </defs>
        </svg>
        <div class="chip-row">
          <div class="tag">当前平均 {{ average }} V</div>
          <div class="tag">异常过滤规则：{{ rules }}</div>
        </div>
      </div>
      <div class="card">
        <p style="font-weight:700;">采集总览</p>
        <div class="kpi-grid" style="margin-top:10px;">
          <div class="card" style="box-shadow:none; border-style:dashed;">
            <p>采集包数</p>
            <h2>{{ packets }} 组</h2>
            <p style="color:var(--muted);">累计包数已校验</p>
          </div>
          <div class="card" style="box-shadow:none; border-style:dashed;">
            <p>异常过滤</p>
            <h2>{{ filtered }} 条</h2>
            <p style="color:var(--muted);">依据动态阈值过滤</p>
          </div>
          <div class="card" style="box-shadow:none; border-style:dashed;">
            <p>采集延迟</p>
            <h2>{{ latency }} ms</h2>
            <p style="color:var(--muted);">链路延迟监控</p>
          </div>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>时间戳</th>
          <th>设备</th>
          <th>电压(V)</th>
          <th>波动</th>
          <th>校验结果</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in dataset" :key="row.time">
          <td>{{ row.time }}</td>
          <td>{{ row.device }}</td>
          <td>{{ row.voltage }}</td>
          <td>{{ row.fluct }}</td>
          <td><span class="badge" :class="row.valid ? 'good' : 'warn'">{{ row.valid ? '通过' : '疑似异常' }}</span></td>
          <td><button class="btn btn-ghost" @click="openRow(row)">详情</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="startModal" title="启动采集任务">
    <div class="form-row">
      <div>
        <label>采集间隔(ms)</label>
        <input class="input" type="number" v-model="task.interval" />
      </div>
      <div>
        <label>异常上限(V)</label>
        <input class="input" type="number" v-model="task.upper" />
      </div>
      <div>
        <label>异常下限(V)</label>
        <input class="input" type="number" v-model="task.lower" />
      </div>
    </div>
    <div class="progress-track">
      <div class="progress-bar" :style="{width: task.progress + '%'}"></div>
    </div>
    <p style="margin-top:6px;color:var(--muted);">配置同步云端，剩余 {{ 100 - task.progress }}%</p>
  </ModalDialog>

  <ModalDialog v-model="filterModal" title="异常过滤设置">
    <div>
      <label>过滤规则</label>
      <select class="select" v-model="rules">
        <option>动态三倍标准差</option>
        <option>百分位过滤</option>
        <option>离群点手动确认</option>
      </select>
    </div>
    <div style="margin-top:10px;" class="chip-row">
      <div class="tag">最近异常 {{ filtered }} 条</div>
      <div class="tag">阈值自适应</div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="calibrateModal" title="数据校验" :withFooter="false">
    <p>通过对比基准电压自动校验偏差。</p>
    <div class="progress-track" style="margin-top:10px;">
      <div class="progress-bar" :style="{width: calibration + '%'}"></div>
    </div>
    <p style="color:var(--muted); margin-top:6px;">校验进度</p>
  </ModalDialog>

  <ModalDialog v-model="rowModal" title="采集详情" :withFooter="false">
    <p>时间：{{ currentRow?.time }}</p>
    <p>设备：{{ currentRow?.device }}</p>
    <p>电压：{{ currentRow?.voltage }} V</p>
    <p>波动：{{ currentRow?.fluct }}</p>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const dataset = reactive([
  { time: '10:00:01', device: 'BV-001', voltage: 54.3, fluctu: 0.1, fluctuText: '+0.1', fluct: '+0.10', valid: true },
  { time: '10:00:02', device: 'BV-002', voltage: 52.9, fluct: '+0.04', valid: true },
  { time: '10:00:03', device: 'BV-003', voltage: 55.1, fluct: '-0.02', valid: true },
  { time: '10:00:04', device: 'BV-004', voltage: 51.2, fluct: '+0.30', valid: false },
  { time: '10:00:05', device: 'BV-005', voltage: 53.7, fluct: '+0.08', valid: true },
  { time: '10:00:06', device: 'BV-006', voltage: 54.6, fluct: '-0.05', valid: true },
  { time: '10:00:07', device: 'BV-007', voltage: 50.8, fluct: '+0.22', valid: false },
  { time: '10:00:08', device: 'BV-008', voltage: 53.2, fluct: '-0.03', valid: true },
  { time: '10:00:09', device: 'BV-009', voltage: 55.2, fluct: '+0.02', valid: true },
  { time: '10:00:10', device: 'BV-010', voltage: 53.5, fluct: '+0.07', valid: true },
  { time: '10:00:11', device: 'BV-011', voltage: 54.4, fluct: '-0.01', valid: true },
  { time: '10:00:12', device: 'BV-012', voltage: 50.9, fluct: '+0.35', valid: false },
  { time: '10:00:13', device: 'BV-013', voltage: 53.0, fluct: '+0.06', valid: true },
  { time: '10:00:14', device: 'BV-014', voltage: 54.9, fluct: '+0.03', valid: true },
  { time: '10:00:15', device: 'BV-015', voltage: 53.1, fluct: '+0.05', valid: true },
  { time: '10:00:16', device: 'BV-016', voltage: 50.6, fluct: '+0.40', valid: false },
  { time: '10:00:17', device: 'BV-017', voltage: 55.3, fluct: '-0.01', valid: true },
  { time: '10:00:18', device: 'BV-018', voltage: 52.8, fluct: '+0.09', valid: true },
  { time: '10:00:19', device: 'BV-019', voltage: 54.2, fluct: '-0.04', valid: true },
  { time: '10:00:20', device: 'BV-020', voltage: 50.4, fluct: '+0.38', valid: false }
]);

const startModal = ref(false);
const filterModal = ref(false);
const calibrateModal = ref(false);
const rowModal = ref(false);
const task = reactive({ interval: 200, upper: 56, lower: 50, progress: 70 });
const rules = ref('动态三倍标准差');
const packets = ref(1200);
const filtered = ref(48);
const latency = ref(32);
const calibration = ref(62);
const currentRow = ref(null);

const points = computed(() => dataset.map((row, idx) => `${(idx * 16)} ${120 - (row.voltage - 50) * 4}`).join(' '));
const average = computed(() => (dataset.reduce((a, b) => a + b.voltage, 0) / dataset.length).toFixed(2));

const openRow = (row) => {
  currentRow.value = row;
  rowModal.value = true;
};
</script>
