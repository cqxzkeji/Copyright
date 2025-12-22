<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>数据存储与溯源</h2>
        <p>覆盖采集、归档、溯源全流程，保证数据不可篡改</p>
      </div>
      <div class="action-group">
        <button class="primary" @click="openModal('archive')">归档数据</button>
        <button class="secondary" @click="openModal('trace')">生成溯源码</button>
        <button class="secondary" @click="openModal('tip')">完整性提醒</button>
      </div>
    </div>

    <div class="stats">
      <div class="card">
        <h3>当日归档</h3>
        <strong>2,418</strong>
        <span>数据包</span>
      </div>
      <div class="card">
        <h3>链上校验</h3>
        <strong>99.7%</strong>
        <span>完整率</span>
      </div>
      <div class="card">
        <h3>异常溯源</h3>
        <strong>4</strong>
        <span>需跟进</span>
      </div>
    </div>

    <div class="layout">
      <div class="panel">
        <h3>归档记录</h3>
        <table>
          <thead>
            <tr>
              <th>批次号</th>
              <th>站点</th>
              <th>归档量</th>
              <th>哈希值</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in records" :key="item.batch">
              <td>{{ item.batch }}</td>
              <td>{{ item.site }}</td>
              <td>{{ item.count }}</td>
              <td class="hash">{{ item.hash }}</td>
              <td>
                <span class="tag" :class="item.statusClass">{{ item.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel">
        <h3>溯源链路示意</h3>
        <div class="chart-box">
          <svg viewBox="0 0 320 200" class="chart">
            <rect x="0" y="0" width="320" height="200" rx="16" fill="#f4f7ff" />
            <rect x="20" y="40" width="80" height="40" rx="10" fill="#7fb0ff" />
            <rect x="120" y="40" width="80" height="40" rx="10" fill="#5b74ff" />
            <rect x="220" y="40" width="80" height="40" rx="10" fill="#7fb0ff" />
            <rect x="70" y="120" width="80" height="40" rx="10" fill="#c7d5ff" />
            <rect x="170" y="120" width="80" height="40" rx="10" fill="#c7d5ff" />
            <line x1="100" y1="60" x2="120" y2="60" stroke="#a9b9ff" stroke-width="3" />
            <line x1="200" y1="60" x2="220" y2="60" stroke="#a9b9ff" stroke-width="3" />
            <line x1="160" y1="80" x2="110" y2="120" stroke="#a9b9ff" stroke-width="2" />
            <line x1="160" y1="80" x2="210" y2="120" stroke="#a9b9ff" stroke-width="2" />
          </svg>
          <div class="legend">
            <div>
              <span class="dot"></span>
              数据归档至溯源链路映射
            </div>
            <p>链上存证时间平均 4.2 秒，建议晚高峰预留缓存。</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal">
        <header>
          <h3>{{ modal.title }}</h3>
          <button class="close" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <form v-if="modal.type === 'archive'" @submit.prevent="archiveData">
            <label>
              归档批次
              <input v-model="archiveForm.batch" required />
            </label>
            <label>
              站点名称
              <input v-model="archiveForm.site" required />
            </label>
            <label>
              归档量
              <input v-model="archiveForm.count" type="number" required />
            </label>
            <div class="modal-actions">
              <button class="secondary" type="button" @click="closeModal">取消</button>
              <button class="primary" type="submit">确认归档</button>
            </div>
          </form>

          <div v-else-if="modal.type === 'trace'" class="progress-box">
            <p>正在生成溯源码并写入存证节点。</p>
            <div class="progress">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-text">已完成 {{ progress }}%</div>
            <button class="primary" @click="closeModal" :disabled="progress < 100">完成</button>
          </div>

          <div v-else class="tip-box">
            <p>检测到 2 条数据缺少签名，建议重新同步。</p>
            <button class="primary" @click="closeModal">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const records = ref([
  { batch: 'AR-2024-0901', site: '南区 A1', count: 260, hash: '5f3a1c7a2b9d', status: '已存证', statusClass: 'ok' },
  { batch: 'AR-2024-0902', site: '南区 A2', count: 244, hash: '9a4fbc8231ad', status: '已存证', statusClass: 'ok' },
  { batch: 'AR-2024-0903', site: '南区 A3', count: 228, hash: '4c9d118a3d7e', status: '待核验', statusClass: 'warn' },
  { batch: 'AR-2024-0904', site: '东区 B1', count: 280, hash: '0bbf73ac498c', status: '已存证', statusClass: 'ok' },
  { batch: 'AR-2024-0905', site: '东区 B2', count: 256, hash: '1c6de2f8a11b', status: '已存证', statusClass: 'ok' },
  { batch: 'AR-2024-0906', site: '东区 B3', count: 234, hash: '7a1b54c90f2e', status: '待核验', statusClass: 'warn' },
  { batch: 'AR-2024-0907', site: '西区 C1', count: 268, hash: '3e2d71a4c8b9', status: '已存证', statusClass: 'ok' },
  { batch: 'AR-2024-0908', site: '西区 C2', count: 252, hash: '6c1a9b7d4fe1', status: '已存证', statusClass: 'ok' },
  { batch: 'AR-2024-0909', site: '北区 D1', count: 238, hash: '2d4c8a7f9b1c', status: '待核验', statusClass: 'warn' },
  { batch: 'AR-2024-0910', site: '北区 D2', count: 276, hash: '8f1c7b9a3d5e', status: '已存证', statusClass: 'ok' }
]);

const archiveForm = reactive({
  batch: 'AR-2024-0911',
  site: '北区 D3',
  count: 220
});

const modal = reactive({
  visible: false,
  type: 'archive',
  title: ''
});

const progress = ref(0);
let timer;

const openModal = (type) => {
  modal.visible = true;
  modal.type = type;
  modal.title = type === 'archive' ? '归档数据批次' : type === 'trace' ? '生成溯源码' : '数据完整性提醒';
};

const closeModal = () => {
  modal.visible = false;
  progress.value = 0;
  clearInterval(timer);
};

const archiveData = () => {
  records.value.unshift({
    batch: archiveForm.batch,
    site: archiveForm.site,
    count: archiveForm.count,
    hash: Math.random().toString(16).slice(2, 14),
    status: '已存证',
    statusClass: 'ok'
  });
  closeModal();
};

watch(
  () => modal.type,
  (value) => {
    if (value === 'trace' && modal.visible) {
      progress.value = 0;
      clearInterval(timer);
      timer = setInterval(() => {
        progress.value = Math.min(progress.value + 15, 100);
        if (progress.value >= 100) {
          clearInterval(timer);
        }
      }, 350);
    }
  }
);
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.page-header h2 {
  margin: 0 0 6px;
}

.page-header p {
  margin: 0;
  color: #6f7b94;
}

.action-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary,
.secondary {
  border: none;
  border-radius: 12px;
  padding: 10px 18px;
  cursor: pointer;
  font-size: 14px;
}

.primary {
  background: linear-gradient(135deg, #7fb0ff, #5b74ff);
  color: #fff;
}

.secondary {
  background: #f1f5ff;
  color: #3a4a70;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(31, 42, 68, 0.08);
}

.card h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #7d8aa5;
}

.card strong {
  font-size: 24px;
}

.card span {
  display: block;
  color: #98a3ba;
  margin-top: 6px;
}

.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.panel {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(31, 42, 68, 0.08);
}

.panel h3 {
  margin-top: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  text-align: left;
  padding: 10px 6px;
  border-bottom: 1px solid #eef1f6;
}

.hash {
  font-family: "JetBrains Mono", "SFMono-Regular", monospace;
  font-size: 12px;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ok {
  background: #e7f8ef;
  color: #1c7a4d;
}

.tag.warn {
  background: #fff4e5;
  color: #c57600;
}

.chart-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart {
  width: 100%;
}

.legend {
  font-size: 13px;
  color: #7d8aa5;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #7fb0ff;
  margin-right: 6px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal {
  background: #fff;
  width: min(480px, 92vw);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(31, 42, 68, 0.2);
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  margin-top: 16px;
}

.modal-body form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-body input {
  border: 1px solid #d9e1f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.progress {
  background: #f0f3fa;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
  margin: 16px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #7fb0ff, #5b74ff);
  transition: width 0.4s ease;
}

.progress-text {
  color: #6f7b94;
  margin-bottom: 12px;
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
