<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom: 12px;">
      <div>
        <h3 class="section-title">统计报表运维</h3>
        <p style="color:var(--muted);">运行状态统计、报表导出与运维闭环管理。</p>
      </div>
      <div class="toolbar">
        <button class="btn btn-primary" @click="exportModal = true">导出报表</button>
        <button class="btn btn-ghost" @click="ticketModal = true">创建运维单</button>
        <button class="btn btn-ghost" @click="feedbackModal = true">闭环反馈</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="card" style="box-shadow:none; border-style:dashed;">
        <p>在线设备</p>
        <h2>18 台</h2>
        <p style="color:var(--muted);">实时在线数量</p>
      </div>
      <div class="card" style="box-shadow:none; border-style:dashed;">
        <p>月度跌落</p>
        <h2>34 次</h2>
        <p style="color:var(--muted);">已记录跌落事件</p>
      </div>
      <div class="card" style="box-shadow:none; border-style:dashed;">
        <p>预警闭环</p>
        <h2>92%</h2>
        <p style="color:var(--muted);">关闭率</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>报告名称</th>
          <th>周期</th>
          <th>状态</th>
          <th>负责人</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reports" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.period }}</td>
          <td><span class="badge" :class="item.status === '已完成' ? 'good' : 'warn'">{{ item.status }}</span></td>
          <td>{{ item.owner }}</td>
          <td><button class="btn btn-ghost" @click="view(item)">详情</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="exportModal" title="导出报表" :withFooter="false">
    <p>正在导出至 Excel...</p>
    <div class="progress-track" style="margin-top:10px;">
      <div class="progress-bar" :style="{width: exportProgress + '%'}"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="ticketModal" title="创建运维单">
    <div class="form-row">
      <div>
        <label>标题</label>
        <input class="input" v-model="ticket.title" />
      </div>
      <div>
        <label>紧急程度</label>
        <select class="select" v-model="ticket.level">
          <option>低</option>
          <option>中</option>
          <option>高</option>
        </select>
      </div>
    </div>
    <div>
      <label>描述</label>
      <textarea class="input" rows="3" v-model="ticket.desc"></textarea>
    </div>
  </ModalDialog>

  <ModalDialog v-model="feedbackModal" title="闭环反馈" :withFooter="false">
    <p>最近闭环：BV-004 预警已完成巡检。</p>
  </ModalDialog>

  <ModalDialog v-model="detailModal" title="报表详情" :withFooter="false">
    <p>名称：{{ current?.name }}</p>
    <p>周期：{{ current?.period }}</p>
    <p>负责人：{{ current?.owner }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const reports = reactive([
  { name: '周度防摔巡检', period: '2024-W18', status: '已完成', owner: '王工' },
  { name: '月度电压稳定性', period: '2024-04', status: '生成中', owner: '刘工' },
  { name: '异常跌落统计', period: '2024-Q1', status: '已完成', owner: '赵工' },
  { name: '预警闭环率', period: '2024-YTD', status: '生成中', owner: '陈工' }
]);

const exportModal = ref(false);
const ticketModal = ref(false);
const feedbackModal = ref(false);
const detailModal = ref(false);
const exportProgress = ref(64);
const ticket = reactive({ title: '跌落风险复盘', level: '中', desc: '自动分析触发，请安排现场复盘。' });
const current = ref(null);

const view = (item) => {
  current.value = item;
  detailModal.value = true;
};
</script>
