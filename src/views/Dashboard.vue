<template>
  <div class="page">
    <section class="section-card overview">
      <div>
        <h2>课堂质量概览</h2>
        <p>实时汇总课堂互动、注意力与教学节奏指标。</p>
      </div>
      <div class="overview-actions">
        <button class="secondary-btn" @click="openModal('tip')">查看提醒</button>
        <button class="primary-btn" @click="openModal('form')">生成诊断</button>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>关键指标分布</h2>
        <span class="badge">20 个数据点</span>
      </div>
      <div class="chart">
        <div v-for="point in chartData" :key="point.label">
          <div class="chart-bar" :style="{ height: point.value + '%' }"></div>
          <div class="chart-label">{{ point.label }}</div>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>课堂诊断列表</h2>
        <div class="overview-actions">
          <button class="secondary-btn" @click="openModal('progress')">实时同步</button>
          <button class="primary-btn" @click="openModal('form')">更新评分</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>节次</th>
              <th>平均专注度</th>
              <th>互动次数</th>
              <th>教学节奏</th>
              <th>综合评分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.period }}</td>
              <td>{{ item.focus }}%</td>
              <td>{{ item.interactions }}</td>
              <td>{{ item.pace }}</td>
              <td>
                <span class="tag">{{ item.score }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal === 'tip'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>课堂提醒</h3>
        <p>最近 10 分钟学生提问频率下降，建议加入互动问答提升参与度。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'form'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>生成诊断任务</h3>
        <p>配置课堂诊断条件，生成阶段性分析。</p>
        <div class="modal-form">
          <label>
            分析时间段
            <select>
              <option>本节课</option>
              <option>最近 30 分钟</option>
              <option>最近 10 分钟</option>
            </select>
          </label>
          <label>
            输出格式
            <select>
              <option>综合评分 + 建议</option>
              <option>只输出评分</option>
              <option>教学建议报告</option>
            </select>
          </label>
          <label>
            备注
            <textarea rows="3" placeholder="补充说明"></textarea>
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
        <h3>同步课堂数据</h3>
        <p>正在对接课堂边缘设备与云端模型。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: '78%' }"></div>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">停止同步</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeModal = ref('');
const chartData = Array.from({ length: 20 }, (_, index) => ({
  label: `${index + 1}`,
  value: 40 + ((index * 7) % 55)
}));

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  period: `第 ${index + 1} 节`,
  focus: 70 + ((index * 3) % 25),
  interactions: 12 + index,
  pace: index % 2 === 0 ? '平稳' : '偏快',
  score: 80 + ((index * 4) % 18)
}));

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.overview-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 800px) {
  .overview {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
