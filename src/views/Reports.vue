<template>
  <div class="panel">
    <div class="toolbar">
      <button @click="showForm">生成综合报告</button>
      <button @click="showTip('自定义分析已应用：按口岸 + 商品维度。')">定制分析</button>
      <button @click="showProgress">导出进度</button>
    </div>

    <div class="card chart">
      <div v-for="i in reportStats" :key="i.k" class="bar-item">
        <span>{{ i.k }}</span>
        <div class="bar-bg"><div class="bar" :style="{width: i.v + '%'}"></div></div>
        <b>{{ i.v }}</b>
      </div>
    </div>

    <div class="card table">
      <table>
        <thead><tr><th>月份</th><th>进口票数</th><th>出口票数</th><th>异常数</th><th>整改完成率</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>{{ r.month }}</td><td>{{ r.im }}</td><td>{{ r.ex }}</td><td>{{ r.err }}</td><td>{{ r.fix }}</td>
            <td><button class="small" @click="showTip(`${r.month}报告已打开`)">查看</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :visible="modal.visible" :title="modal.title" @close="modal.visible=false" @confirm="modal.visible=false">
      <form v-if="modal.type==='form'" class="form-grid">
        <label>报告周期<select><option>月报</option><option>季报</option><option>年报</option></select></label>
        <label>分析口径<select><option>风险类型</option><option>部门维度</option></select></label>
      </form>
      <div v-else-if="modal.type==='progress'">
        <p>报告正在导出，请稍候...</p>
        <div class="progress-bg"><div class="progress" style="width:84%"></div></div>
      </div>
      <p v-else>{{ modal.message }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const reportStats = [
  { k: '综合风险指数', v: 72 },
  { k: '审核通过率', v: 88 },
  { k: '整改闭环率', v: 81 },
  { k: '政策响应率', v: 93 },
];

const rows = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  month: `2025-${((i % 12) + 1).toString().padStart(2, '0')}`,
  im: 240 + i,
  ex: 210 + i,
  err: (i % 6) + 2,
  fix: `${80 + (i % 10)}%`,
}));

const modal = reactive({ visible: false, title: '', type: 'tip', message: '' });
const showForm = () => Object.assign(modal, { visible: true, title: '报告参数', type: 'form' });
const showProgress = () => Object.assign(modal, { visible: true, title: '导出进度', type: 'progress' });
const showTip = (message) => Object.assign(modal, { visible: true, title: '提示信息', type: 'tip', message });
</script>

<style scoped>
@import './module.css';
</style>
