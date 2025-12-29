<template>
  <LayoutShell>
    <div class="card">
      <div class="section-title">
        <h3>数据处理队列</h3>
        <div class="toolbar">
          <button @click="openProgress('cleaning')">开始清洗</button>
          <button class="secondary" @click="openForm('transform')">转换规则</button>
          <button class="outline" @click="openInfo('storage')">存储策略</button>
        </div>
      </div>
      <div class="responsive-table">
        <table>
          <thead>
            <tr>
              <th>批次</th>
              <th>来源</th>
              <th>记录数</th>
              <th>任务</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tasks" :key="item.batch">
              <td>{{ item.batch }}</td>
              <td>{{ item.source }}</td>
              <td>{{ item.count }}</td>
              <td>{{ item.job }}</td>
              <td><span class="status-pill">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="section-title">
        <h3>时序数据库写入</h3>
        <div class="badge">InfluxDB</div>
      </div>
      <div class="grid">
        <div class="stat-card" v-for="db in dbStats" :key="db.title">
          <div class="flex-between">
            <h4>{{ db.title }}</h4>
            <span class="badge">存储</span>
          </div>
          <div class="value">{{ db.value }}</div>
          <div class="progress-container" style="margin-top: 8px;">
            <div class="progress-bar" :style="{ width: db.progress + '%' }"></div>
          </div>
          <div class="small-text">{{ db.desc }}</div>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'cleaning'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>数据清洗执行</h3>
          <button class="menu-button" @click="closeModal">停止</button>
        </div>
        <p>对重复、异常值进行过滤，保留高质量数据。</p>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'transform'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>转换规则配置</h3>
          <button class="menu-button" @click="closeModal">关闭</button>
        </div>
        <div class="input-group">
          <label>字段映射</label>
          <textarea v-model="form.mapping" rows="3" placeholder="deviceId -> device_id"></textarea>
        </div>
        <div class="input-group">
          <label>单位统一</label>
          <input v-model="form.unit" placeholder="温度统一为 ℃" />
        </div>
        <div class="modal-footer">
          <button class="outline" @click="closeModal">取消</button>
          <button class="secondary" @click="saveTransform">保存规则</button>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'storage'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>存储策略</h3>
          <button class="menu-button" @click="closeModal">确认</button>
        </div>
        <div class="alert">热点数据保留 30 天，历史数据转储对象存储。</div>
        <ul>
          <li>开启写入压缩，节省 22% 磁盘。</li>
          <li>高水位触发分片，写入速率平滑。</li>
          <li>实时索引，支持毫秒级查询。</li>
        </ul>
      </div>
    </div>
  </LayoutShell>
</template>

<script setup>
import { reactive } from 'vue';
import LayoutShell from '../components/LayoutShell.vue';

const tasks = Array.from({ length: 20 }).map((_, idx) => ({
  batch: `B-${(idx + 1).toString().padStart(3, '0')}`,
  source: idx % 2 === 0 ? '边缘网关' : '现场 PLC',
  count: 5000 + idx * 120,
  job: idx % 3 === 0 ? '清洗' : idx % 3 === 1 ? '转换' : '入库',
  status: idx % 4 === 0 ? '排队' : '处理中'
}));

const dbStats = [
  { title: '写入 QPS', value: '14.5k', progress: 65, desc: '持续落盘中' },
  { title: '存储占用', value: '512 GB', progress: 48, desc: '按日分片' },
  { title: '缓存命中', value: '92%', progress: 92, desc: '写前缓存' },
  { title: '查询延迟', value: '120 ms', progress: 55, desc: '统计窗查询' }
];

const modal = reactive({ type: '', progress: 0 });
const form = reactive({ mapping: 'deviceId -> device_id\nvalue -> metric', unit: '℃/kPa' });
let timer;

const openProgress = (type) => {
  modal.type = type;
  modal.progress = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 12);
    if (modal.progress >= 100) clearInterval(timer);
  }, 300);
};

const openForm = (type) => (modal.type = type);
const openInfo = (type) => (modal.type = type);

const saveTransform = () => {
  alert(`已保存映射: ${form.mapping.split('\n')[0]}，单位：${form.unit}`);
  modal.type = '';
};

const closeModal = () => {
  modal.type = '';
  clearInterval(timer);
};
</script>
