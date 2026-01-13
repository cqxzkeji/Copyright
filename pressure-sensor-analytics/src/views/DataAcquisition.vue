<template>
  <section class="module">
    <div class="cards">
      <div class="card">
        <h4>实时采集通道</h4>
        <p class="metric">{{ activeChannels }} 条</p>
        <span>缓存队列 {{ cacheDepth }} 条</span>
      </div>
      <div class="card">
        <h4>数据清洗策略</h4>
        <p class="metric">去噪 + 补点</p>
        <span>同步误差 {{ syncError }} ms</span>
      </div>
      <div class="card">
        <h4>断点续传</h4>
        <p class="metric">{{ resumeTasks }} 项</p>
        <span>最近恢复 08:42</span>
      </div>
    </div>

    <div class="toolbar">
      <button type="button" @click="openModal('progress', '启动采集')">启动采集</button>
      <button type="button" @click="openModal('form', '补点任务')">补点任务</button>
      <button type="button" @click="openModal('form', '清洗规则')">清洗规则</button>
      <button type="button" @click="openModal('info', '缓存诊断')">缓存诊断</button>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h4>采集数据预处理队列</h4>
        <span>单位换算 / 异常值过滤 / 时间同步</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>时间戳</th>
            <th>通道</th>
            <th>原始值</th>
            <th>换算值</th>
            <th>清洗策略</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.time }}</td>
            <td>{{ item.channel }}</td>
            <td>{{ item.raw }}</td>
            <td>{{ item.converted }}</td>
            <td>{{ item.strategy }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <header>
          <h3>{{ modal.title }}</h3>
          <button type="button" class="icon" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <form v-if="modal.type === 'form'" class="modal-form" @submit.prevent="submitForm">
            <label>
              任务名称
              <input v-model="form.task" type="text" required />
            </label>
            <label>
              数据窗口
              <input v-model="form.window" type="text" required />
            </label>
            <label>
              处理策略
              <select v-model="form.strategy">
                <option>去噪 + 插值补点</option>
                <option>异常值过滤</option>
                <option>单位换算</option>
              </select>
            </label>
            <label>
              优先级
              <select v-model="form.priority">
                <option>高</option>
                <option>中</option>
                <option>低</option>
              </select>
            </label>
            <button type="submit" class="primary">提交任务</button>
          </form>
          <div v-else-if="modal.type === 'progress'">
            <p>采集任务启动中，正在建立缓存队列。</p>
            <div class="progress">
              <div class="bar" :style="{ width: `${progress}%` }"></div>
            </div>
            <p class="progress-tip">已完成 {{ progress }}%</p>
          </div>
          <div v-else class="info-body">
            <p>当前缓存占用 {{ cacheDepth }} 条数据，最大延迟 {{ maxDelay }} ms。</p>
            <p>建议扩容边缘缓冲或优化采样频率。</p>
            <button type="button" class="primary" @click="closeModal">生成诊断单</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from "vue";

const records = ref(
  Array.from({ length: 24 }, (_, index) => {
    const statusOptions = ["已清洗", "待清洗", "同步中"];
    const strategies = ["去噪", "补点", "换算"];
    return {
      id: index + 1,
      time: `09:${String(index + 10).padStart(2, "0")}:12`,
      channel: `CH-${String(index % 8 + 1).padStart(2, "0")}`,
      raw: `${(18 + index * 0.3).toFixed(2)} V`,
      converted: `${(6 + index * 0.12).toFixed(2)} MPa`,
      strategy: strategies[index % strategies.length],
      status: statusOptions[index % statusOptions.length]
    };
  })
);

const activeChannels = 18;
const cacheDepth = 320;
const syncError = 12;
const resumeTasks = 4;
const maxDelay = 240;

const modal = reactive({
  visible: false,
  type: "info",
  title: ""
});

const form = reactive({
  task: "补点-夜班02",
  window: "08:00-09:00",
  strategy: "去噪 + 插值补点",
  priority: "高"
});

const progress = ref(0);
const timer = ref(null);

const openModal = (type, title) => {
  modal.visible = true;
  modal.type = type;
  modal.title = title;
  if (type === "progress") {
    progress.value = 0;
    timer.value = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(timer.value);
        timer.value = null;
      } else {
        progress.value += 11;
      }
    }, 150);
  }
};

const closeModal = () => {
  modal.visible = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const submitForm = () => {
  records.value.unshift({
    id: records.value.length + 1,
    time: "09:58:00",
    channel: "CH-01",
    raw: "20.40 V",
    converted: "7.12 MPa",
    strategy: form.strategy,
    status: "待清洗"
  });
  closeModal();
};

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.metric {
  font-size: 22px;
  font-weight: 700;
  margin: 8px 0;
}

.card span {
  color: #64748b;
  font-size: 13px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.toolbar button {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.table-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.table-header span {
  color: #64748b;
  font-size: 13px;
}

.table-card table {
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

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 20px;
}

.modal-form {
  display: grid;
  gap: 10px;
}

.modal-form input,
.modal-form select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.primary {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.icon {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin: 12px 0;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #38bdf8);
  transition: width 0.2s ease;
}

.progress-tip {
  font-size: 13px;
  color: #64748b;
}
</style>
