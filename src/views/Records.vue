<template>
  <div class="card">
    <div class="flex-between">
      <h2 class="section-title">数据存储</h2>
      <div class="table-actions">
        <button class="btn" @click="openExport">导出报表</button>
        <button class="btn secondary" @click="openCleanup">清理缓存</button>
      </div>
    </div>
    <p class="hint">采集数据自动保存，按设备与时间维度记录</p>
    <table class="table">
      <thead>
        <tr>
          <th>记录ID</th>
          <th>设备</th>
          <th>采集时间</th>
          <th>电压(V)</th>
          <th>存储分区</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id">
          <td>{{ record.id }}</td>
          <td>{{ record.device }}</td>
          <td>{{ record.time }}</td>
          <td>{{ record.voltage }}</td>
          <td>{{ record.bucket }}</td>
          <td class="table-actions">
            <button class="btn" @click="viewRecord(record)">查看</button>
            <button class="btn secondary" @click="tagRecord(record)">打标签</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="modal.type" class="modal-backdrop">
    <div class="modal-card">
      <div class="flex-between">
        <h3>{{ modal.title }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <div v-if="modal.type === 'export'">
        <p>导出最近 {{ exportRange }} 天的电压记录。</p>
        <input v-model.number="exportRange" class="input" type="number" min="1" max="30" />
        <div class="flex-between" style="margin-top: 12px;">
          <span class="chip">支持 CSV / Excel</span>
          <button class="btn" @click="confirmExport">开始导出</button>
        </div>
      </div>
      <div v-else-if="modal.type === 'cleanup'">
        <p>即将清理历史缓存，归档数据将保留。</p>
        <div class="progress-bar">
          <span :style="{ width: cleanupPercent + '%' }"></span>
        </div>
        <p style="color: var(--muted);">清理进度 {{ cleanupPercent }}%</p>
      </div>
      <div v-else-if="modal.type === 'view'">
        <p>记录 {{ currentRecord.id }} ｜ 设备 {{ currentRecord.device }}</p>
        <p>时间：{{ currentRecord.time }} ｜ 电压：{{ currentRecord.voltage }} V</p>
        <p>存储分区：{{ currentRecord.bucket }}</p>
      </div>
      <div v-else-if="modal.type === 'tag'">
        <label>标签说明</label>
        <input v-model="tagText" class="input" placeholder="如：夜间波动、异常尖峰" />
        <div class="flex-between" style="margin-top: 12px;">
          <span class="chip">标签用于后续溯源</span>
          <button class="btn" @click="saveTag">保存标签</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const records = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    id: `R-${String(i + 1).padStart(3, '0')}`,
    device: `D-${String((i % 8) + 1).padStart(3, '0')}`,
    time: `2024-05-16 0${(i % 9) + 1}:2${i % 6}`,
    voltage: (12 + Math.random()).toFixed(2),
    bucket: `zone-${(i % 4) + 1}`
  }))
);

const modal = reactive({ type: '', title: '' });
const currentRecord = ref({});
const exportRange = ref(7);
const cleanupPercent = ref(18);
const tagText = ref('');

const openExport = () => {
  modal.type = 'export';
  modal.title = '导出报表';
};

const openCleanup = () => {
  modal.type = 'cleanup';
  modal.title = '清理缓存';
  cleanupPercent.value = 18;
  const timer = setInterval(() => {
    cleanupPercent.value = Math.min(100, cleanupPercent.value + 20);
    if (cleanupPercent.value >= 100) clearInterval(timer);
  }, 600);
};

const viewRecord = (record) => {
  currentRecord.value = record;
  modal.type = 'view';
  modal.title = '记录详情';
};

const tagRecord = (record) => {
  currentRecord.value = record;
  modal.type = 'tag';
  modal.title = '打标签';
};

const confirmExport = () => {
  modal.type = 'cleanup';
  modal.title = `正在导出 ${exportRange.value} 天数据`;
  cleanupPercent.value = 0;
  const timer = setInterval(() => {
    cleanupPercent.value = Math.min(100, cleanupPercent.value + 25);
    if (cleanupPercent.value >= 100) clearInterval(timer);
  }, 500);
};

const saveTag = () => {
  alert(`标签已保存：${tagText.value}`);
  tagText.value = '';
  closeModal();
};

const closeModal = () => {
  modal.type = '';
};
</script>

<style scoped>
.hint {
  color: var(--muted);
  margin: 6px 0 12px;
}
</style>
