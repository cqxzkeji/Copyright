<template>
  <div class="panel">
    <div class="toolbar">
      <button @click="openForm">发起自动审单</button>
      <button @click="showProgress">审核进度</button>
      <button @click="showTip('发现 2 条单证字段缺失，请补录后重审。')">审核建议</button>
    </div>

    <div class="card chart">
      <div v-for="item in checks" :key="item.name" class="bar-item">
        <span>{{ item.name }}</span>
        <div class="bar-bg"><div class="bar" :style="{ width: item.rate + '%' }"></div></div>
        <b>{{ item.rate }}%</b>
      </div>
    </div>

    <div class="card table">
      <table>
        <thead><tr><th>单证号</th><th>企业</th><th>申报要素</th><th>校验结果</th><th>建议</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>{{ r.doc }}</td><td>{{ r.company }}</td><td>{{ r.field }}</td><td>{{ r.result }}</td><td>{{ r.advice }}</td>
            <td><button class="small" @click="showTip(`${r.doc}：${r.advice}`)">复核</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :visible="modal.visible" :title="modal.title" @close="modal.visible=false" @confirm="modal.visible=false">
      <form v-if="modal.type==='form'" class="form-grid">
        <label>批次编号<input v-model="batch" placeholder="CHK-2026" /></label>
        <label>审核范围<select><option>全部报关单</option><option>高风险清单</option></select></label>
      </form>
      <div v-else-if="modal.type==='progress'">
        <p>自动审核任务已执行</p>
        <div class="progress-bg"><div class="progress" style="width:65%"></div></div>
      </div>
      <p v-else>{{ modal.message }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const batch = ref('');
const checks = [
  { name: 'HS编码一致性', rate: 91 },
  { name: '许可证有效性', rate: 75 },
  { name: '税则匹配', rate: 80 },
  { name: '原产地声明', rate: 68 },
];

const rows = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  doc: `DOC-86${(i + 1).toString().padStart(3, '0')}`,
  company: `企业${i + 1}`,
  field: ['价格条款', '原产地', '规格型号', '品牌'][i % 4],
  result: i % 3 ? '通过' : '异常',
  advice: i % 3 ? '建议归档' : '补充附件并复审',
}));

const modal = reactive({ visible: false, type: 'tip', title: '提示信息', message: '' });
const openForm = () => Object.assign(modal, { visible: true, type: 'form', title: '自动审单配置' });
const showProgress = () => Object.assign(modal, { visible: true, type: 'progress', title: '审核进度' });
const showTip = (message) => Object.assign(modal, { visible: true, type: 'tip', title: '审核提示', message });
</script>

<style scoped>
@import './module.css';
</style>
