<template>
  <div class="dashboard-grid">
    <div class="card">
      <div class="flex-between">
        <h2 class="section-title">统计与导出</h2>
        <button class="btn" @click="openExport">导出报表</button>
      </div>
      <p class="hint">电压数据简单统计，导出可用于共享</p>
      <table class="table">
        <thead>
          <tr>
            <th>设备</th>
            <th>最高电压</th>
            <th>最低电压</th>
            <th>平均电压</th>
            <th>采样点</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stat in stats" :key="stat.device">
            <td>{{ stat.device }}</td>
            <td>{{ stat.max }} V</td>
            <td>{{ stat.min }} V</td>
            <td>{{ stat.avg }} V</td>
            <td>{{ stat.count }}</td>
            <td class="table-actions">
              <button class="btn" @click="showStat(stat)">详情</button>
              <button class="btn secondary" @click="markReport(stat)">标记异常</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">系统配置与日志</h3>
        <button class="btn" @click="openLog">查看日志</button>
      </div>
      <div class="form-grid">
        <div>
          <label>数据保留天数</label>
          <input v-model.number="config.retention" class="input" type="number" min="7" />
        </div>
        <div>
          <label>告警阈值(V)</label>
          <input v-model.number="config.threshold" class="input" type="number" min="10" step="0.1" />
        </div>
        <div class="full">
          <label>通知邮箱</label>
          <input v-model="config.email" class="input" placeholder="ops@example.com" />
        </div>
      </div>
      <div class="flex-between" style="margin-top: 12px;">
        <span class="chip">修改后点击保存</span>
        <button class="btn" @click="saveConfig">保存配置</button>
      </div>
      <ul style="margin: 12px 0 0; padding: 0; list-style: none;">
        <li class="list-row" v-for="log in logs" :key="log.time">
          <div>
            <strong>{{ log.time }}</strong>
            <p style="margin: 4px 0 0; color: var(--muted);">{{ log.content }}</p>
          </div>
          <button class="btn secondary" @click="openLogDetail(log)">详情</button>
        </li>
      </ul>
    </div>
  </div>

  <div v-if="modal.type" class="modal-backdrop">
    <div class="modal-card">
      <div class="flex-between">
        <h3>{{ modal.title }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <div v-if="modal.type === 'export'">
        <p>导出统计报表，格式：{{ exportFormat }}</p>
        <select v-model="exportFormat" class="input">
          <option>CSV</option>
          <option>Excel</option>
          <option>PDF</option>
        </select>
        <div class="flex-between" style="margin-top: 12px;">
          <span class="chip">生成后会下载</span>
          <button class="btn" @click="confirmExport">立即导出</button>
        </div>
      </div>
      <div v-else-if="modal.type === 'stat'">
        <p>{{ currentStat.device }} 电压波动详情</p>
        <div class="progress-bar">
          <span :style="{ width: currentStat.stability + '%' }"></span>
        </div>
        <p style="color: var(--muted);">稳定度 {{ currentStat.stability }}%</p>
      </div>
      <div v-else-if="modal.type === 'mark'">
        <p>标记 {{ currentStat.device }} 为异常？</p>
        <div class="flex-between">
          <button class="btn secondary" @click="closeModal">取消</button>
          <button class="btn" @click="confirmMark">确认</button>
        </div>
      </div>
      <div v-else-if="modal.type === 'log'">
        <p>最新日志共 {{ logs.length }} 条。</p>
        <div class="progress-bar">
          <span :style="{ width: 100 + '%' }"></span>
        </div>
        <p style="color: var(--muted);">已全部加载</p>
      </div>
      <div v-else-if="modal.type === 'logDetail'">
        <p>{{ currentLog.time }}</p>
        <p>{{ currentLog.content }}</p>
      </div>
      <div v-else-if="modal.type === 'save'">
        <p>配置已保存：保留 {{ config.retention }} 天，阈值 {{ config.threshold }} V</p>
        <div class="progress-bar">
          <span :style="{ width: 100 + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const stats = reactive([
  { device: 'D-001', max: 12.9, min: 12.2, avg: 12.6, count: 320, stability: 92 },
  { device: 'D-004', max: 12.8, min: 12.1, avg: 12.5, count: 280, stability: 90 },
  { device: 'D-011', max: 12.1, min: 10.8, avg: 11.7, count: 140, stability: 62 },
  { device: 'D-020', max: 12.7, min: 12.3, avg: 12.5, count: 180, stability: 88 }
]);

const logs = reactive([
  { time: '2024-05-16 09:00', content: '夜间巡检任务完成，入库 2.1 万条数据' },
  { time: '2024-05-16 08:45', content: '设备 D-011 告警恢复，电压回升至 12.0V' },
  { time: '2024-05-16 08:30', content: '完成 WiFi 设备扫描，新增 2 台接入' },
  { time: '2024-05-16 08:10', content: '执行报表导出，生成日常巡检统计' }
]);

const config = reactive({ retention: 30, threshold: 11.5, email: 'ops@example.com' });
const modal = reactive({ type: '', title: '' });
const exportFormat = ref('CSV');
const currentStat = ref({});
const currentLog = ref({});

const openExport = () => {
  modal.type = 'export';
  modal.title = '导出统计报表';
};

const confirmExport = () => {
  modal.type = 'save';
  modal.title = '生成报表';
};

const showStat = (stat) => {
  currentStat.value = stat;
  modal.type = 'stat';
  modal.title = '统计详情';
};

const markReport = (stat) => {
  currentStat.value = stat;
  modal.type = 'mark';
  modal.title = '标记异常';
};

const openLog = () => {
  modal.type = 'log';
  modal.title = '日志列表';
};

const openLogDetail = (log) => {
  currentLog.value = log;
  modal.type = 'logDetail';
  modal.title = '日志详情';
};

const saveConfig = () => {
  modal.type = 'save';
  modal.title = '保存配置';
};

const confirmMark = () => {
  alert(`${currentStat.value.device} 已标记异常`);
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
