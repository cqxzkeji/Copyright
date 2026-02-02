<template>
  <div class="page">
    <section class="section-card header-card">
      <div>
        <h2>数据采集与预处理</h2>
        <p>多模态采集：视频、语音、互动数据同步去噪与归一化。</p>
      </div>
      <div class="actions">
        <button class="secondary-btn" @click="openModal('tip')">采集提醒</button>
        <button class="primary-btn" @click="openModal('form')">新增采集任务</button>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>采集通道状态</h2>
        <span class="badge">20 条通道</span>
      </div>
      <div class="chart">
        <div v-for="channel in chartData" :key="channel.label">
          <div class="chart-bar" :style="{ height: channel.value + '%' }"></div>
          <div class="chart-label">{{ channel.label }}</div>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>采集队列</h2>
        <div class="actions">
          <button class="secondary-btn" @click="openModal('progress')">预处理进度</button>
          <button class="primary-btn" @click="openModal('form')">配置规则</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>数据源</th>
              <th>去噪等级</th>
              <th>归一化</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.source }}</td>
              <td>{{ item.denoise }}</td>
              <td>{{ item.normalize }}</td>
              <td><span class="tag">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal === 'tip'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>采集提醒</h3>
        <p>当前语音通道噪声略高，建议调整麦克风增益。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'form'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>新增采集任务</h3>
        <p>填写采集任务参数，系统将自动执行预处理流程。</p>
        <div class="modal-form">
          <label>
            数据来源
            <select>
              <option>教师摄像头</option>
              <option>学生互动平板</option>
              <option>课堂麦克风阵列</option>
            </select>
          </label>
          <label>
            去噪级别
            <select>
              <option>标准去噪</option>
              <option>增强去噪</option>
              <option>极限去噪</option>
            </select>
          </label>
          <label>
            归一化策略
            <select>
              <option>Min-Max</option>
              <option>Z-Score</option>
              <option>时间窗平滑</option>
            </select>
          </label>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">取消</button>
          <button class="primary-btn" @click="closeModal">提交任务</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'progress'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>预处理进度</h3>
        <p>当前批次数据正在执行去噪与归一化。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: '65%' }"></div>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">暂停</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeModal = ref('');
const chartData = Array.from({ length: 20 }, (_, index) => ({
  label: `通道${index + 1}`,
  value: 35 + ((index * 9) % 60)
}));

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  source: index % 3 === 0 ? '视频流' : index % 3 === 1 ? '语音流' : '互动事件',
  denoise: index % 2 === 0 ? '标准' : '增强',
  normalize: index % 2 === 0 ? 'Z-Score' : 'Min-Max',
  status: index % 4 === 0 ? '处理中' : '待入库'
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
