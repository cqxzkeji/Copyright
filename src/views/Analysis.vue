<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>数据记录与回放分析</h3>
        <div class="flex">
          <button @click="openReplay = true">回放</button>
          <button @click="openExport = true">导出数据</button>
        </div>
      </div>
      <table class="table" style="margin-top: 12px">
        <thead>
          <tr>
            <th>时间</th>
            <th>事件</th>
            <th>指标</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in logs" :key="row.time">
            <td>{{ row.time }}</td>
            <td>{{ row.event }}</td>
            <td>{{ row.metric }}</td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid" style="gap: 12px">
      <div class="card">
        <div class="flex-between">
          <h4>趋势图</h4>
          <button @click="openTrim = true">裁剪窗口</button>
        </div>
        <svg viewBox="0 0 260 140" style="width: 100%; height: auto;">
          <polyline :points="chartPoints" fill="none" stroke="#1e88e5" stroke-width="3" />
          <line x1="0" x2="260" y1="120" y2="120" stroke="#dbeafe" />
          <line x1="20" x2="20" y1="0" y2="140" stroke="#dbeafe" />
        </svg>
        <p>指标：稳定度指数（越高越稳定）</p>
      </div>
      <div class="card">
        <div class="flex-between">
          <h4>系统管理</h4>
          <button @click="openConfig = true">系统配置</button>
        </div>
        <p>日志存储：{{ storage.used }} / {{ storage.total }} GB</p>
        <div class="progress-bar" style="margin-top: 10px">
          <div class="progress-inner" :style="{ width: storagePercent + '%' }"></div>
        </div>
        <p>备份状态：{{ storage.backup }}</p>
      </div>
    </div>
  </div>

  <div v-if="openReplay" class="modal-overlay" @click.self="openReplay = false">
    <div class="modal">
      <h3>数据回放</h3>
      <p>选择时间窗口进行回放。</p>
      <label>起始<input v-model="replay.start" placeholder="10:00" /></label>
      <label>结束<input v-model="replay.end" placeholder="10:10" /></label>
      <div class="flex-between" style="margin-top: 10px">
        <span>回放速率 2x</span>
        <button @click="startReplay">开始回放</button>
      </div>
    </div>
  </div>

  <div v-if="openExport" class="modal-overlay" @click.self="openExport = false">
    <div class="modal">
      <h3>导出数据</h3>
      <p>选择导出格式与范围。</p>
      <label>格式<select v-model="exportForm.format"><option>CSV</option><option>JSON</option></select></label>
      <label>范围<select v-model="exportForm.range"><option>最近 10 分钟</option><option>最近 1 小时</option><option>全部</option></select></label>
      <button style="margin-top: 10px" @click="exportData">导出</button>
    </div>
  </div>

  <div v-if="openTrim" class="modal-overlay" @click.self="openTrim = false">
    <div class="modal">
      <h3>裁剪窗口</h3>
      <label>窗口<input v-model="trimWindow" placeholder="20s" /></label>
      <div class="flex-between" style="margin-top: 10px">
        <span>当前 {{ trimWindow }}</span>
        <button @click="applyTrim">确定</button>
      </div>
    </div>
  </div>

  <div v-if="openConfig" class="modal-overlay" @click.self="openConfig = false">
    <div class="modal">
      <h3>系统配置与维护</h3>
      <label>自动备份<select v-model="storage.backup"><option>启用</option><option>关闭</option></select></label>
      <label>清理阈值<input v-model="storage.threshold" type="number" /></label>
      <button style="margin-top: 10px" @click="saveConfig">保存</button>
    </div>
  </div>

  <div v-if="statusModal.open" class="modal-overlay" @click.self="statusModal.open = false">
    <div class="modal">
      <h3>{{ statusModal.title }}</h3>
      <p>{{ statusModal.message }}</p>
      <div class="flex-between" style="margin-top: 12px">
        <span class="tag">数据分析</span>
        <button @click="statusModal.open = false">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const logs = ref(
  Array.from({ length: 24 }).map((_, i) => ({
    time: `10:${(i + 10).toString().padStart(2, '0')}:00`,
    event: i % 2 === 0 ? '姿态调整' : '路径规划',
    metric: `${(90 + i).toFixed(1)}%`,
    note: i % 3 === 0 ? '稳定' : '轻微抖动'
  }))
);

const chartPoints = computed(() => logs.value.slice(0, 12).map((row, idx) => `${20 + idx * 20},${140 - (parseFloat(row.metric) - 80)}`).join(' '));

const storage = reactive({ used: 38, total: 64, backup: '启用', threshold: 80 });
const storagePercent = computed(() => Math.round((storage.used / storage.total) * 100));

const openReplay = ref(false);
const openExport = ref(false);
const openTrim = ref(false);
const openConfig = ref(false);
const statusModal = reactive({ open: false, title: '', message: '' });

const replay = reactive({ start: '10:00', end: '10:10' });
const exportForm = reactive({ format: 'CSV', range: '最近 10 分钟' });
const trimWindow = ref('20s');

const startReplay = () => {
  statusModal.title = '回放准备就绪';
  statusModal.message = `时间窗 ${replay.start} - ${replay.end} 已加载。`;
  statusModal.open = true;
  openReplay.value = false;
};

const exportData = () => {
  statusModal.title = '导出完成';
  statusModal.message = `${exportForm.format} 已导出，范围 ${exportForm.range}`;
  statusModal.open = true;
  openExport.value = false;
};

const applyTrim = () => {
  statusModal.title = '裁剪已应用';
  statusModal.message = `窗口 ${trimWindow.value} 已应用到当前曲线。`;
  statusModal.open = true;
  openTrim.value = false;
};

const saveConfig = () => {
  statusModal.title = '系统配置已保存';
  statusModal.message = `备份：${storage.backup}，阈值：${storage.threshold}%`;
  statusModal.open = true;
  openConfig.value = false;
};
</script>
