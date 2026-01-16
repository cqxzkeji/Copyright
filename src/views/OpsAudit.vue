<template>
  <section>
    <div class="section-title">运维工单与安全审计</div>
    <div class="card-grid">
      <div class="card">
        <h3>待处理工单</h3>
        <div class="metric">19</div>
        <div class="badge">超时 3 条</div>
      </div>
      <div class="card">
        <h3>巡检计划</h3>
        <div class="metric">6</div>
        <div class="badge">今日执行 2 次</div>
      </div>
      <div class="card">
        <h3>变更发布</h3>
        <div class="metric">4</div>
        <div class="badge">待审批 1 项</div>
      </div>
      <div class="card">
        <h3>审计记录</h3>
        <div class="metric">1,238</div>
        <div class="badge">合规通过</div>
      </div>
    </div>

    <div class="actions">
      <button class="action-button" @click="modals.ticket = true">创建工单</button>
      <button class="action-button secondary" @click="modals.change = true">发起变更</button>
      <button class="action-button secondary" @click="modals.inspect = true">巡检计划</button>
      <button class="action-button secondary" @click="modals.remote = true">远程运维</button>
      <button class="action-button secondary" @click="modals.info = true">按钮提示</button>
    </div>

    <div class="chart">
      <div class="section-title">审计风险分布</div>
      <div v-for="risk in risks" :key="risk.name" class="bar-row">
        <div class="bar-label">{{ risk.name }}</div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: risk.value + '%' }"></div>
        </div>
        <div>{{ risk.value }}%</div>
      </div>
    </div>

    <div class="table-wrap">
      <div class="section-title">运维工单列表</div>
      <table>
        <thead>
          <tr>
            <th>工单编号</th>
            <th>类型</th>
            <th>责任人</th>
            <th>影响范围</th>
            <th>提交时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id">
            <td>{{ ticket.id }}</td>
            <td>{{ ticket.type }}</td>
            <td>{{ ticket.owner }}</td>
            <td>{{ ticket.scope }}</td>
            <td>{{ ticket.time }}</td>
            <td>{{ ticket.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal :show="modals.ticket" title="创建故障工单" @close="modals.ticket = false">
    <div class="form-grid">
      <label>
        工单标题
        <input v-model="forms.ticket.title" placeholder="例如: GPU 节点掉线" />
      </label>
      <label>
        影响范围
        <input v-model="forms.ticket.scope" placeholder="例如: AI 训练池" />
      </label>
      <label>
        紧急程度
        <select v-model="forms.ticket.level">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </label>
      <label>
        描述
        <textarea v-model="forms.ticket.desc" rows="2" placeholder="问题描述"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.change" title="变更发布申请" @close="modals.change = false">
    <div class="form-grid">
      <label>
        变更内容
        <input v-model="forms.change.content" placeholder="例如: 升级调度节点" />
      </label>
      <label>
        计划窗口
        <input v-model="forms.change.window" placeholder="例如: 23:00 - 01:00" />
      </label>
      <label>
        回滚方案
        <textarea v-model="forms.change.rollback" rows="2" placeholder="回滚步骤"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.inspect" title="巡检计划进度" @close="modals.inspect = false">
    <p>正在执行夜间巡检计划，检查设备运行状态。</p>
    <div class="progress">
      <span :style="{ width: '47%' }"></span>
    </div>
    <p>预计 2 分钟完成。</p>
  </BaseModal>

  <BaseModal :show="modals.remote" title="远程运维" @close="modals.remote = false">
    <div class="form-grid">
      <label>
        跳板机
        <select v-model="forms.remote.host">
          <option>jump-01</option>
          <option>jump-02</option>
        </select>
      </label>
      <label>
        操作命令
        <input v-model="forms.remote.command" placeholder="例如: scontrol show nodes" />
      </label>
      <label>
        审计说明
        <textarea v-model="forms.remote.note" rows="2" placeholder="运维说明"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.info" title="提示信息" @close="modals.info = false">
    <p>远程运维命令将通过跳板机执行，并自动记录操作审计。</p>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modals = reactive({
  ticket: false,
  change: false,
  inspect: false,
  remote: false,
  info: false
});

const forms = reactive({
  ticket: {
    title: '',
    scope: '',
    level: '高',
    desc: ''
  },
  change: {
    content: '',
    window: '',
    rollback: ''
  },
  remote: {
    host: 'jump-01',
    command: '',
    note: ''
  }
});

const risks = [
  { name: '高危操作', value: 18 },
  { name: '配置漂移', value: 32 },
  { name: '权限异常', value: 27 },
  { name: '合规风险', value: 23 }
];

const tickets = Array.from({ length: 22 }, (_, index) => {
  const id = index + 5001;
  return {
    id: `TK-${id}`,
    type: index % 3 === 0 ? '故障' : index % 3 === 1 ? '变更' : '巡检',
    owner: index % 2 === 0 ? '刘工' : '赵工',
    scope: index % 4 === 0 ? '核心交换区' : '计算节点区',
    time: `2024-05-${String((index % 28) + 1).padStart(2, '0')}`,
    status: index % 5 === 0 ? '待审批' : index % 4 === 0 ? '处理中' : '已派单'
  };
});
</script>
