<template>
  <div class="page">
    <section class="section-card header-card">
      <div>
        <h2>注意力机制优化</h2>
        <p>提升关键互动事件识别精度，突出教师反馈与学生提问。</p>
      </div>
      <div class="actions">
        <button class="secondary-btn" @click="openModal('tip')">优化提示</button>
        <button class="primary-btn" @click="openModal('form')">配置注意力权重</button>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>关键事件权重分布</h2>
        <span class="badge">20 个事件</span>
      </div>
      <div class="chart">
        <div v-for="item in chartData" :key="item.label">
          <div class="chart-bar" :style="{ height: item.value + '%' }"></div>
          <div class="chart-label">{{ item.label }}</div>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>注意力事件清单</h2>
        <div class="actions">
          <button class="secondary-btn" @click="openModal('progress')">融合进度</button>
          <button class="primary-btn" @click="openModal('form')">新增事件</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>事件编号</th>
              <th>事件类型</th>
              <th>权重</th>
              <th>出现频次</th>
              <th>贡献评分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.code }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.weight }}</td>
              <td>{{ item.frequency }}</td>
              <td><span class="tag">{{ item.score }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal === 'tip'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>优化提示</h3>
        <p>建议提高“学生提问”事件权重，以突出课堂互动质量。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'form'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>配置注意力权重</h3>
        <p>设定不同互动事件的注意力强度。</p>
        <div class="modal-form">
          <label>
            事件类型
            <select>
              <option>学生提问</option>
              <option>教师反馈</option>
              <option>课堂讨论</option>
            </select>
          </label>
          <label>
            权重
            <input type="number" value="0.72" step="0.01" />
          </label>
          <label>
            备注说明
            <textarea rows="3" placeholder="权重调整原因"></textarea>
          </label>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">取消</button>
          <button class="primary-btn" @click="closeModal">保存配置</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'progress'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>融合进度</h3>
        <p>注意力机制正在融合最新课堂互动事件。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: '72%' }"></div>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">停止</button>
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
  value: 45 + ((index * 5) % 50)
}));

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `ATT-${index + 1}`,
  type: index % 3 === 0 ? '学生提问' : index % 3 === 1 ? '教师反馈' : '课堂讨论',
  weight: (0.5 + ((index * 7) % 40) / 100).toFixed(2),
  frequency: 8 + index,
  score: 75 + ((index * 3) % 20)
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
