<template>
  <div class="page">
    <section class="section-card header-card">
      <div>
        <h2>LSTM 模型训练与推理</h2>
        <p>训练课堂行为识别模型，实时输出教学质量评分。</p>
      </div>
      <div class="actions">
        <button class="secondary-btn" @click="openModal('tip')">训练建议</button>
        <button class="primary-btn" @click="openModal('form')">创建训练任务</button>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>训练损失曲线</h2>
        <span class="badge">20 轮训练</span>
      </div>
      <div class="chart">
        <div v-for="epoch in chartData" :key="epoch.label">
          <div class="chart-bar" :style="{ height: epoch.value + '%' }"></div>
          <div class="chart-label">{{ epoch.label }}</div>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>推理批次监控</h2>
        <div class="actions">
          <button class="secondary-btn" @click="openModal('progress')">推理进度</button>
          <button class="primary-btn" @click="openModal('form')">更新参数</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>批次</th>
              <th>窗口长度</th>
              <th>识别准确率</th>
              <th>响应时延</th>
              <th>质量评分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.batch }}</td>
              <td>{{ item.window }}</td>
              <td>{{ item.accuracy }}%</td>
              <td>{{ item.latency }} ms</td>
              <td><span class="tag">{{ item.score }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal === 'tip'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>训练建议</h3>
        <p>建议增加课堂互动标签样本，提高异常行为识别的准确率。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'form'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>创建训练任务</h3>
        <p>设置 LSTM 模型训练超参数。</p>
        <div class="modal-form">
          <label>
            时间步长度
            <input type="number" value="60" />
          </label>
          <label>
            隐藏层维度
            <input type="number" value="128" />
          </label>
          <label>
            迭代轮数
            <input type="number" value="20" />
          </label>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">取消</button>
          <button class="primary-btn" @click="closeModal">启动训练</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'progress'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>推理进度</h3>
        <p>当前批次模型正在执行课堂行为推理。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: '54%' }"></div>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">停止推理</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeModal = ref('');
const chartData = Array.from({ length: 20 }, (_, index) => ({
  label: `E${index + 1}`,
  value: 85 - ((index * 3) % 55)
}));

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  batch: `B-${index + 101}`,
  window: `${45 + index}s`,
  accuracy: 82 + ((index * 2) % 15),
  latency: 120 + index * 3,
  score: 78 + ((index * 4) % 20)
}));

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 800px) {
  .header-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
