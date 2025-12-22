<template>
  <div class="page">
    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h3>手动记录</h3>
          <button class="primary" @click="openModal('manual')">新增记录</button>
        </div>
        <form class="inline-form" @submit.prevent="submitInline">
          <label>
            <span>转速 (rpm)</span>
            <input v-model="manual.speed" type="number" min="0" />
          </label>
          <label>
            <span>角度 (°)</span>
            <input v-model="manual.angle" type="number" min="0" max="360" />
          </label>
          <label>
            <span>记录人</span>
            <input v-model="manual.operator" type="text" />
          </label>
          <button class="ghost" type="submit">立即记录</button>
        </form>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>自动记录策略</h3>
          <button class="primary" @click="openModal('auto')">配置策略</button>
        </div>
        <div class="strategy">
          <div>
            <span>采样频率</span>
            <strong>5s</strong>
          </div>
          <div>
            <span>触发阈值</span>
            <strong>600rpm</strong>
          </div>
          <div>
            <span>保存周期</span>
            <strong>24h</strong>
          </div>
        </div>
        <div class="progress">
          <div class="bar" :style="{ width: autoProgress + '%' }"></div>
        </div>
        <div class="progress-info">
          <span>自动记录任务</span>
          <strong>{{ autoProgress }}%</strong>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>转速/角度趋势</h3>
        <div class="card-actions">
          <button class="ghost" @click="openModal('export')">导出曲线</button>
          <button class="primary" @click="openModal('refresh')">刷新数据</button>
        </div>
      </div>
      <div class="chart">
        <svg viewBox="0 0 420 160" aria-label="转速曲线">
          <polyline points="10,120 60,80 110,95 160,60 210,70 260,40 310,65 360,50 410,30" />
        </svg>
        <svg viewBox="0 0 420 160" aria-label="角度曲线">
          <polyline points="10,90 60,70 110,120 160,85 210,105 260,70 310,90 360,60 410,80" />
        </svg>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>记录明细</h3>
        <button class="primary" @click="openModal('sync')">同步记录</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>时间</th>
              <th>转速</th>
              <th>角度</th>
              <th>方式</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in records" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.time }}</td>
              <td>{{ item.speed }}</td>
              <td>{{ item.angle }}</td>
              <td>{{ item.mode }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <template v-if="activeModal === 'manual'">
          <h3>新增记录</h3>
          <form class="modal-form" @submit.prevent="submitModal">
            <label>
              <span>转速</span>
              <input v-model="manual.speed" type="number" min="0" />
            </label>
            <label>
              <span>角度</span>
              <input v-model="manual.angle" type="number" min="0" max="360" />
            </label>
            <label>
              <span>备注</span>
              <input v-model="manual.note" type="text" placeholder="记录异常点" />
            </label>
            <div class="modal-actions">
              <button class="ghost" type="button" @click="closeModal">取消</button>
              <button class="primary" type="submit">保存</button>
            </div>
          </form>
        </template>

        <template v-else-if="activeModal === 'auto'">
          <h3>自动记录策略</h3>
          <form class="modal-form" @submit.prevent="submitModal">
            <label>
              <span>采样频率</span>
              <select v-model="autoConfig.interval">
                <option>5s</option>
                <option>10s</option>
                <option>30s</option>
              </select>
            </label>
            <label>
              <span>触发阈值 (rpm)</span>
              <input v-model="autoConfig.threshold" type="number" min="100" />
            </label>
            <label>
              <span>存储周期</span>
              <select v-model="autoConfig.retention">
                <option>24h</option>
                <option>72h</option>
                <option>7天</option>
              </select>
            </label>
            <div class="modal-actions">
              <button class="ghost" type="button" @click="closeModal">取消</button>
              <button class="primary" type="submit">保存策略</button>
            </div>
          </form>
        </template>

        <template v-else-if="activeModal === 'sync'">
          <h3>同步进度</h3>
          <p class="muted">正在同步记录数据到云端。</p>
          <div class="progress">
            <div class="bar" :style="{ width: syncProgress + '%' }"></div>
          </div>
          <div class="modal-actions">
            <button class="primary" @click="completeSync">完成</button>
          </div>
        </template>

        <template v-else>
          <h3>提示信息</h3>
          <p class="muted">{{ modalMessage }}</p>
          <div class="modal-actions">
            <button class="primary" @click="closeModal">知道了</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const records = [
  { id: "R-001", time: "09:10", speed: "520rpm", angle: "120°", mode: "自动" },
  { id: "R-002", time: "09:15", speed: "540rpm", angle: "130°", mode: "自动" },
  { id: "R-003", time: "09:20", speed: "610rpm", angle: "142°", mode: "手动" },
  { id: "R-004", time: "09:25", speed: "580rpm", angle: "118°", mode: "自动" },
  { id: "R-005", time: "09:30", speed: "600rpm", angle: "150°", mode: "自动" },
  { id: "R-006", time: "09:35", speed: "630rpm", angle: "160°", mode: "自动" },
  { id: "R-007", time: "09:40", speed: "590rpm", angle: "140°", mode: "手动" },
  { id: "R-008", time: "09:45", speed: "570rpm", angle: "135°", mode: "自动" },
  { id: "R-009", time: "09:50", speed: "620rpm", angle: "148°", mode: "自动" },
  { id: "R-010", time: "09:55", speed: "610rpm", angle: "152°", mode: "自动" }
];

const manual = reactive({
  speed: 600,
  angle: 120,
  operator: "李工",
  note: ""
});

const autoConfig = reactive({
  interval: "5s",
  threshold: 600,
  retention: "24h"
});

const activeModal = ref("");
const autoProgress = ref(64);
const syncProgress = ref(58);

const modalMessage = computed(() => {
  const messages = {
    refresh: "数据刷新完成，已加载最新记录。",
    export: "曲线已导出到报告中心。"
  };
  return messages[activeModal.value] || "操作完成。";
});

const openModal = (key) => {
  activeModal.value = key;
};

const closeModal = () => {
  activeModal.value = "";
};

const submitModal = () => {
  activeModal.value = "";
};

const submitInline = () => {
  activeModal.value = "";
};

const completeSync = () => {
  syncProgress.value = 100;
  activeModal.value = "";
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #eff6ff;
  border: none;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
}

.inline-form {
  display: grid;
  gap: 12px;
}

.inline-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.inline-form input {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.strategy {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.strategy span {
  font-size: 12px;
  color: #94a3b8;
}

.strategy strong {
  display: block;
  font-size: 18px;
  color: #1e3a8a;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar {
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  height: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #475569;
}

.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.chart svg {
  width: 100%;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
}

.chart polyline {
  fill: none;
  stroke: #2563eb;
  stroke-width: 3;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
 td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  color: #475569;
  font-weight: 600;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  z-index: 30;
}

.modal {
  width: min(420px, 90vw);
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: grid;
  gap: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.modal-form input,
.modal-form select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.muted {
  margin: 0;
  color: #64748b;
}
</style>
