<template>
  <div class="panel">
    <div class="toolbar">
      <button @click="openForm('新增风险规则')">新增风险规则</button>
      <button @click="openProgress('实时扫描中', 78)">启动扫描</button>
      <button @click="openTip('当前高风险预警 4 条，建议立即复核。')">预警提示</button>
    </div>

    <div class="chart card">
      <div v-for="item in chartData" :key="item.label" class="bar-item">
        <span>{{ item.label }}</span>
        <div class="bar-bg"><div class="bar" :style="{ width: item.value + '%' }"></div></div>
        <b>{{ item.value }}%</b>
      </div>
    </div>

    <div class="table card">
      <table>
        <thead>
          <tr><th>单号</th><th>贸易类型</th><th>风险等级</th><th>税率变化</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.code }}</td><td>{{ row.trade }}</td><td>{{ row.level }}</td><td>{{ row.tariff }}</td><td>{{ row.status }}</td>
            <td><button @click="openTip(`已查看 ${row.code} 风险详情`)" class="small">查看</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :visible="modal.visible" :title="modal.title" @close="modal.visible=false" @confirm="submit">
      <form v-if="modal.type==='form'" class="form-grid" @submit.prevent>
        <label>规则名称<input v-model="form.name" /></label>
        <label>触发阈值<input v-model="form.threshold" type="number" /></label>
        <label>通知方式<select v-model="form.notify"><option>邮件</option><option>短信</option></select></label>
      </form>
      <div v-else-if="modal.type==='progress'">
        <p>{{ modal.message }}</p>
        <div class="progress-bg"><div class="progress" :style="{width: modal.progress + '%'}"></div></div>
      </div>
      <p v-else>{{ modal.message }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { label: '进口申报异常', value: 82 },
  { label: '出口许可超期', value: 63 },
  { label: '归类争议', value: 48 },
  { label: '关税波动', value: 71 },
];

const rows = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  code: `IM20250${(i + 1).toString().padStart(3, '0')}`,
  trade: i % 2 ? '出口' : '进口',
  level: ['低', '中', '高'][i % 3],
  tariff: `${(i % 5) + 1}%`,
  status: i % 4 ? '已预警' : '复核中',
}));

const form = reactive({ name: '', threshold: 70, notify: '邮件' });
const modal = reactive({ visible: false, title: '', type: 'tip', message: '', progress: 0 });

const openForm = (title) => Object.assign(modal, { visible: true, title, type: 'form' });
const openProgress = (message, progress) => Object.assign(modal, { visible: true, title: '处理进度', type: 'progress', message, progress });
const openTip = (message) => Object.assign(modal, { visible: true, title: '提示信息', type: 'tip', message });
const submit = () => {
  modal.visible = false;
};
</script>

<style scoped>
@import './module.css';
</style>
