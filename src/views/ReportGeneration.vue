<template>
  <div class="page">
    <section class="section-card header-card">
      <div>
        <h2>数据可视化与报告生成</h2>
        <p>生成课堂质量诊断报告，用于后期分析与改进。</p>
      </div>
      <div class="actions">
        <button class="secondary-btn" @click="openModal('tip')">报告提示</button>
        <button class="primary-btn" @click="openModal('form')">生成报告</button>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>报告关键指标</h2>
        <span class="badge">20 条指标</span>
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
        <h2>报告生成记录</h2>
        <div class="actions">
          <button class="secondary-btn" @click="openModal('progress')">生成进度</button>
          <button class="primary-btn" @click="openModal('form')">新建报告</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>报告编号</th>
              <th>覆盖范围</th>
              <th>核心亮点</th>
              <th>评分</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.code }}</td>
              <td>{{ item.scope }}</td>
              <td>{{ item.highlight }}</td>
              <td>{{ item.score }}</td>
              <td><span class="tag">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal === 'tip'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>报告提示</h3>
        <p>建议附带关键互动片段截图，方便后期教学复盘。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'form'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>生成诊断报告</h3>
        <p>选择报告范围与输出格式。</p>
        <div class="modal-form">
          <label>
            报告周期
            <select>
              <option>本节课</option>
              <option>本周课堂</option>
              <option>本学期</option>
            </select>
          </label>
          <label>
            报告格式
            <select>
              <option>PDF + 图表</option>
              <option>Word + 文字分析</option>
              <option>综合报告</option>
            </select>
          </label>
          <label>
            附加说明
            <textarea rows="3" placeholder="请输入附加说明"></textarea>
          </label>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">取消</button>
          <button class="primary-btn" @click="closeModal">生成报告</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'progress'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>报告生成进度</h3>
        <p>报告正在汇总课堂质量数据与关键事件。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: '79%' }"></div>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">后台生成</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeModal = ref('');
const chartData = Array.from({ length: 20 }, (_, index) => ({
  label: `Q${index + 1}`,
  value: 50 + ((index * 6) % 45)
}));

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `RPT-${100 + index}`,
  scope: index % 2 === 0 ? '单节课' : '周度',
  highlight: index % 2 === 0 ? '互动提升' : '节奏优化',
  score: 84 + ((index * 3) % 12),
  status: index % 3 === 0 ? '已生成' : '待审核'
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
