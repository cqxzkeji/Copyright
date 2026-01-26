<template>
  <section class="page">
    <div class="card">
      <div class="card-header">
        <h2>报表生成与导出</h2>
        <div class="button-group">
          <button class="primary" type="button" @click="openGenerate">生成报表</button>
          <button class="secondary" type="button" @click="openExcel">导出 Excel</button>
          <button class="secondary" type="button" @click="openPdf">导出 PDF</button>
          <button class="secondary" type="button" @click="openSchedule">设置定时任务</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>报表名称</th>
            <th>维度</th>
            <th>更新时间</th>
            <th>负责人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.id">
            <td>{{ report.name }}</td>
            <td>{{ report.dimension }}</td>
            <td>{{ report.updated }}</td>
            <td>{{ report.owner }}</td>
            <td><span class="badge">{{ report.status }}</span></td>
            <td>
              <button class="text" type="button" @click="openDetail(report)">详情</button>
              <button class="text" type="button" @click="openShare(report)">分享</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>报表配置中心</h2>
        <button class="secondary" type="button" @click="openTemplate">更新模板</button>
      </div>
      <div class="form-grid">
        <div class="card">
          <h3>维度库</h3>
          <p>支持 12 个客户维度组合分析。</p>
        </div>
        <div class="card">
          <h3>导出渠道</h3>
          <p>Excel、PDF、邮件、企业网盘。</p>
        </div>
        <div class="card">
          <h3>共享权限</h3>
          <p>报表可授权 3 级权限分享。</p>
        </div>
      </div>
    </div>

    <BaseModal :open="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'progress'">
        <p>{{ modalMessage }}</p>
        <div class="progress-bar">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <p style="text-align: right;">{{ progress }}%</p>
      </template>
      <template v-else>
        <p>{{ modalMessage }}</p>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="primary" type="button" @click="closeModal">完成</button>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const reports = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `客户增长报表-${index + 1}`,
    dimension: ['区域', '行业', '活跃度'][index % 3],
    updated: `2024-0${(index % 9) + 1}-1${index % 9}`,
    owner: ['黄婷', '刘浩', '陈薇'][index % 3],
    status: ['已生成', '待更新', '审批中'][index % 3]
  }))
);

const modalOpen = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalType = ref('');
const progress = ref(0);
let timer = null;

const startProgress = (title, message) => {
  modalTitle.value = title;
  modalMessage.value = message;
  modalType.value = 'progress';
  progress.value = 0;
  modalOpen.value = true;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      modalType.value = '';
      modalMessage.value = '报表生成完成，并已自动同步到共享中心。';
      return;
    }
    progress.value += 20;
  }, 300);
};

const openGenerate = () => {
  startProgress('生成报表', '系统正在汇总最新数据...');
};

const openExcel = () => {
  modalTitle.value = '导出 Excel';
  modalMessage.value = 'Excel 报表已生成，包含客户、交易、活跃度维度。';
  modalType.value = '';
  modalOpen.value = true;
};

const openPdf = () => {
  modalTitle.value = '导出 PDF';
  modalMessage.value = 'PDF 报表已生成，将发送至报表中心。';
  modalType.value = '';
  modalOpen.value = true;
};

const openSchedule = () => {
  modalTitle.value = '定时任务';
  modalMessage.value = '已设置每周一 09:00 自动生成报表并邮件推送。';
  modalType.value = '';
  modalOpen.value = true;
};

const openDetail = (report) => {
  modalTitle.value = '报表详情';
  modalMessage.value = `${report.name} 覆盖 ${report.dimension} 维度，最后更新时间 ${report.updated}。`;
  modalType.value = '';
  modalOpen.value = true;
};

const openShare = (report) => {
  modalTitle.value = '分享报表';
  modalMessage.value = `已将 ${report.name} 分享给管理层群组。`;
  modalType.value = '';
  modalOpen.value = true;
};

const openTemplate = () => {
  modalTitle.value = '模板更新';
  modalMessage.value = '模板已升级为 2024Q2 版本，新增客户留存分析。';
  modalType.value = '';
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  if (timer) {
    clearInterval(timer);
  }
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
