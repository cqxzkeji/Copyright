<template>
  <div class="module">
    <header class="section-title"><span class="icon">📊</span>学员成绩与评估</header>

    <div class="responsive-grid">
      <div class="info-card" v-for="metric in metrics" :key="metric.label">
        <strong>{{ metric.label }}</strong>
        <p>{{ metric.desc }}</p>
        <div class="progress-track"><div class="progress-bar" :style="{ width: metric.value + '%' }"></div></div>
        <small>{{ metric.value }}%</small>
      </div>
    </div>

    <div class="table-card">
      <header class="table-header">
        <h3>成绩表</h3>
        <div class="actions">
          <button class="primary-button" @click="openModal('recalc')">重新评分</button>
          <button class="secondary-button" @click="openModal('feedback')">生成反馈</button>
          <button class="secondary-button" @click="openModal('export')">导出成绩</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>石材辨识</th>
            <th>操作规范</th>
            <th>安全意识</th>
            <th>综合</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in scores" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.identify }}</td>
            <td>{{ row.operation }}</td>
            <td>{{ row.safety }}</td>
            <td>{{ row.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'recalc'" title="重新评分" @close="closeModal" :showFooter="false">
      <p>系统将根据最新日志与操作轨迹重新计算成绩。</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: 60 + '%' }"></div></div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'feedback'" title="生成反馈" @close="closeModal" @confirm="generateFeedback">
      <div class="form-grid">
        <label>学员<select v-model="feedback.student">
          <option v-for="row in scores" :key="row.name">{{ row.name }}</option>
        </select></label>
        <label>改进要点<textarea v-model="feedback.notes" rows="3"></textarea></label>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'export'" title="导出成绩" @close="closeModal" :showFooter="false">
      <p>成绩表导出中……</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: 100 + '%' }"></div></div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metrics = [
  { label: '实践完成率', desc: '完成 12 个实训步骤', value: 86 },
  { label: '知识掌握度', desc: '理论答题正确率', value: 78 },
  { label: '安全达标率', desc: '符合安全规范操作', value: 92 },
  { label: '协作评分', desc: '小组合作互评', value: 80 }
];

const scores = [
  { name: '林一', identify: 90, operation: 88, safety: 92, total: 90 },
  { name: '周可', identify: 86, operation: 84, safety: 90, total: 87 },
  { name: '陈默', identify: 88, operation: 82, safety: 88, total: 86 },
  { name: '郭新', identify: 78, operation: 76, safety: 84, total: 80 },
  { name: '王芯', identify: 92, operation: 90, safety: 94, total: 92 },
  { name: '赵杭', identify: 80, operation: 82, safety: 86, total: 83 },
  { name: '钱龙', identify: 75, operation: 78, safety: 82, total: 78 },
  { name: '孙晓', identify: 84, operation: 86, safety: 88, total: 86 },
  { name: '吴越', identify: 89, operation: 85, safety: 90, total: 88 },
  { name: '冯恺', identify: 82, operation: 80, safety: 85, total: 82 }
];

const activeModal = ref('');
const feedback = ref({ student: scores[0].name, notes: '' });

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const generateFeedback = () => {
  alert(`反馈生成：${feedback.value.student}`);
  closeModal();
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.form-grid select,
.form-grid textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
</style>
