<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div class="card">
      <div class="badge">预警概览</div>
      <h3>今日预警 14 项</h3>
      <p>环境阈值 6 项，模型预测 4 项。</p>
    </div>
    <div class="card">
      <div class="badge">任务闭环</div>
      <h3>待处理工单 5 项</h3>
      <p>已归档 42 项，复核通过率 95%。</p>
    </div>
    <div class="card">
      <div class="badge">通知渠道</div>
      <h3>站内/短信/邮件</h3>
      <p>企业微信已启用，触达率 98%。</p>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-header">
      <div>
        <h3>预警策略库</h3>
        <span>阈值、设备离线、模型预测</span>
      </div>
      <div class="actions">
        <button class="btn" @click="openModal('新增预警策略', 'strategy')">新增策略</button>
        <button class="btn secondary" @click="openModal('通知渠道配置', 'channel')">通知渠道</button>
        <button class="btn ghost" @click="openModal('派单处理', 'dispatch')">派单处理</button>
        <button class="btn ghost" @click="openModal('预警提示信息', 'info')">按钮提示信息</button>
      </div>
    </div>
    <div class="alert-flow">
      <div class="flow-step" v-for="step in steps" :key="step.title">
        <strong>{{ step.title }}</strong>
        <span>{{ step.desc }}</span>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-header">
      <div>
        <h3>预警工单列表</h3>
        <span>派单 — 处理 — 复核 — 归档</span>
      </div>
    </div>
    <div class="table-scroll">
      <table class="table">
        <thead>
          <tr>
            <th>工单编号</th>
            <th>预警类型</th>
            <th>触发条件</th>
            <th>责任人</th>
            <th>进度</th>
            <th>通知渠道</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.code }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.rule }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.progress }}</td>
            <td>{{ row.channel }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" @close="modal.open = false">
    <div v-if="modal.type === 'strategy'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">策略名称</label>
        <input class="input" placeholder="设备离线预警" />
      </div>
      <div>
        <label class="label">触发条件</label>
        <input class="input" placeholder="离线 > 20 分钟" />
      </div>
      <button class="btn">保存策略</button>
    </div>
    <div v-else-if="modal.type === 'channel'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">通知渠道</label>
        <input class="input" placeholder="站内 / 短信 / 邮件 / 企业微信" />
      </div>
      <div>
        <label class="label">接收人群</label>
        <input class="input" placeholder="运维组 / 种植负责人" />
      </div>
      <button class="btn">更新配置</button>
    </div>
    <div v-else-if="modal.type === 'dispatch'" class="grid" style="gap: 12px;">
      <p>派单后将自动发送通知，并进入处理流程。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: '46%' }"></div>
      </div>
      <button class="btn">创建派单</button>
    </div>
    <div v-else>
      <p>预警策略支持多通道通知，确保设备或模型异常快速响应。</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const steps = [
  { title: '预警触发', desc: '环境阈值/模型预测/设备离线触发。' },
  { title: '自动派单', desc: '系统派单给责任人并推送通知。' },
  { title: '处置执行', desc: '处理过程填写措施与现场反馈。' },
  { title: '复核归档', desc: '审核通过后归档留痕。' }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `AL-${300 + index}`,
  type: ['环境阈值', '模型预测', '设备离线'][index % 3],
  rule: ['温度>32℃', '病害概率>8%', '离线>30分钟'][index % 3],
  owner: ['李强', '周敏', '王婷'][index % 3],
  progress: `${40 + index * 2}%`,
  channel: ['站内+短信', '邮件+企微', '短信+企微'][index % 3],
  status: index % 2 === 0 ? '处理中' : '待复核'
}));

const modal = reactive({
  open: false,
  title: '',
  type: ''
});

const openModal = (title, type) => {
  modal.open = true;
  modal.title = title;
  modal.type = type;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.section-header span {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.alert-flow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.flow-step {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.flow-step span {
  color: #64748b;
}
</style>
