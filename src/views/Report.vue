<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const reports = reactive([
  { name: '周度经营简报', type: 'PDF', author: '运营', time: '09:00' },
  { name: '渠道投放明细', type: 'Excel', author: '市场', time: '09:20' },
  { name: '库存与供应商', type: 'PDF', author: '供应链', time: '08:45' },
  { name: '客服满意度', type: 'HTML', author: '客服', time: '09:30' },
  { name: '财务收支', type: 'PDF', author: '财务', time: '08:50' },
  { name: '用户增长漏斗', type: 'PPT', author: '增长', time: '08:40' },
  { name: '产品交付质量', type: 'PDF', author: '质检', time: '09:10' },
  { name: '区域销售排行', type: 'Excel', author: '大区', time: '09:25' },
  { name: '会员标签洞察', type: 'PDF', author: '数据', time: '09:05' },
  { name: '运营日报', type: 'HTML', author: '运营', time: '09:35' }
]);

const generateModal = ref(false);
const exportModal = ref(false);
const detailModal = ref(false);
const progress = ref(0);
const selected = ref(null);

const openGenerate = () => {
  progress.value = 0;
  generateModal.value = true;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 400);
};

const openDetail = (row) => {
  selected.value = row;
  detailModal.value = true;
};
</script>

<template>
  <div>
    <div class="section-header">
      <h2>报表生成与导出</h2>
      <div class="button-row">
        <button @click="openGenerate">生成报表</button>
        <button class="secondary" @click="exportModal = true">导出PDF</button>
      </div>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>报表</th>
            <th>格式</th>
            <th>负责人</th>
            <th>生成时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in reports" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.author }}</td>
            <td>{{ row.time }}</td>
            <td>
              <button class="ghost" @click="openDetail(row)">查看详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog title="报表生成" :show="generateModal" @close="generateModal = false">
      <p>正在编译并生成报表...</p>
      <div class="progress" style="margin: 12px 0">
        <div class="progress-inner" :style="{ width: progress + '%' }"></div>
      </div>
      <p>当前进度：{{ progress }}%</p>
    </ModalDialog>

    <ModalDialog title="导出PDF" :show="exportModal" @close="exportModal = false">
      <p>将以PDF格式导出所有报表列表，是否继续？</p>
      <div class="button-row" style="margin-top: 12px">
        <button @click="exportModal = false">立即导出</button>
        <button class="ghost" @click="exportModal = false">取消</button>
      </div>
    </ModalDialog>

    <ModalDialog v-if="selected" title="报表详情" :show="detailModal" @close="detailModal = false">
      <p><strong>名称：</strong>{{ selected.name }}</p>
      <p><strong>格式：</strong>{{ selected.type }}</p>
      <p><strong>负责人：</strong>{{ selected.author }}</p>
      <p><strong>生成时间：</strong>{{ selected.time }}</p>
      <p>报表摘要：覆盖趋势图、数据表格、风险提示和改进建议等内容。</p>
    </ModalDialog>
  </div>
</template>
