<template>
  <div class="page">
    <section class="section-card header-card">
      <div>
        <h2>实时诊断与反馈</h2>
        <p>根据实时数据流生成教学质量诊断，并推送优化建议。</p>
      </div>
      <div class="actions">
        <button class="secondary-btn" @click="openModal('tip')">反馈提示</button>
        <button class="primary-btn" @click="openModal('form')">发布反馈</button>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>诊断评分趋势</h2>
        <span class="badge">20 个时间片</span>
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
        <h2>实时反馈记录</h2>
        <div class="actions">
          <button class="secondary-btn" @click="openModal('progress')">推送进度</button>
          <button class="primary-btn" @click="openModal('form')">生成反馈</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>时间片</th>
              <th>诊断结论</th>
              <th>建议类型</th>
              <th>推送对象</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.time }}</td>
              <td>{{ item.result }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.target }}</td>
              <td><span class="tag">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal === 'tip'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>反馈提示</h3>
        <p>建议针对学生专注度下降发出课堂活动调整提醒。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'form'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>发布反馈</h3>
        <p>选择反馈内容并推送给相应对象。</p>
        <div class="modal-form">
          <label>
            反馈类型
            <select>
              <option>课堂节奏调整</option>
              <option>互动提升建议</option>
              <option>教学节奏优化</option>
            </select>
          </label>
          <label>
            推送对象
            <select>
              <option>教师端</option>
              <option>教务管理者</option>
              <option>课堂助教</option>
            </select>
          </label>
          <label>
            反馈内容
            <textarea rows="3" placeholder="请输入反馈描述"></textarea>
          </label>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">取消</button>
          <button class="primary-btn" @click="closeModal">推送反馈</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'progress'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>推送进度</h3>
        <p>正在将课堂诊断反馈推送至教师与管理者终端。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: '61%' }"></div>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">停止推送</button>
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
  value: 55 + ((index * 4) % 40)
}));

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  time: `第 ${index + 1} 分钟`,
  result: index % 2 === 0 ? '互动良好' : '注意力下降',
  type: index % 2 === 0 ? '保持节奏' : '互动激励',
  target: index % 3 === 0 ? '教师端' : '管理端',
  status: index % 4 === 0 ? '已推送' : '待确认'
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
