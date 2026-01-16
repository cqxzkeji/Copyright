<template>
  <section>
    <div class="section-title">用户权限与计费核算</div>
    <div class="card-grid">
      <div class="card">
        <h3>活跃租户</h3>
        <div class="metric">18</div>
        <div class="badge">项目组 54 个</div>
      </div>
      <div class="card">
        <h3>本月用量</h3>
        <div class="metric">3,420 节点时</div>
        <div class="badge">较上月 +8%</div>
      </div>
      <div class="card">
        <h3>配额使用</h3>
        <div class="metric">73%</div>
        <div class="badge">超额 2 项</div>
      </div>
      <div class="card">
        <h3>计费账户</h3>
        <div class="metric">26</div>
        <div class="badge">成本分摊已启用</div>
      </div>
    </div>

    <div class="actions">
      <button class="action-button" @click="modals.project = true">创建项目</button>
      <button class="action-button secondary" @click="modals.role = true">分配角色</button>
      <button class="action-button secondary" @click="modals.quota = true">调整配额</button>
      <button class="action-button secondary" @click="modals.report = true">生成报表</button>
      <button class="action-button secondary" @click="modals.info = true">按钮提示</button>
    </div>

    <div class="chart">
      <div class="section-title">成本分摊比例</div>
      <div v-for="cost in costShare" :key="cost.name" class="bar-row">
        <div class="bar-label">{{ cost.name }}</div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: cost.value + '%' }"></div>
        </div>
        <div>{{ cost.value }}%</div>
      </div>
    </div>

    <div class="table-wrap">
      <div class="section-title">项目用量统计</div>
      <table>
        <thead>
          <tr>
            <th>项目组</th>
            <th>负责人</th>
            <th>当月用量</th>
            <th>配额</th>
            <th>成本中心</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usage in usages" :key="usage.name">
            <td>{{ usage.name }}</td>
            <td>{{ usage.owner }}</td>
            <td>{{ usage.used }}</td>
            <td>{{ usage.quota }}</td>
            <td>{{ usage.center }}</td>
            <td>{{ usage.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal :show="modals.project" title="创建项目组" @close="modals.project = false">
    <div class="form-grid">
      <label>
        项目名称
        <input v-model="forms.project.name" placeholder="例如: 智能制造" />
      </label>
      <label>
        负责人
        <input v-model="forms.project.owner" placeholder="负责人" />
      </label>
      <label>
        计费中心
        <input v-model="forms.project.center" placeholder="例如: COST-108" />
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.role" title="分配角色权限" @close="modals.role = false">
    <div class="form-grid">
      <label>
        用户账号
        <input v-model="forms.role.user" placeholder="用户名" />
      </label>
      <label>
        角色
        <select v-model="forms.role.role">
          <option>项目管理员</option>
          <option>只读审计</option>
          <option>作业提交者</option>
        </select>
      </label>
      <label>
        生效范围
        <input v-model="forms.role.scope" placeholder="例如: AI 项目组" />
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.quota" title="配额调整" @close="modals.quota = false">
    <div class="form-grid">
      <label>
        项目组
        <input v-model="forms.quota.project" placeholder="项目名称" />
      </label>
      <label>
        新配额
        <input v-model="forms.quota.amount" placeholder="例如: 5000 节点时" />
      </label>
      <label>
        调整原因
        <textarea v-model="forms.quota.reason" rows="2" placeholder="说明原因"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.report" title="报表生成进度" @close="modals.report = false">
    <p>正在生成多租户计费报表并汇总成本。</p>
    <div class="progress">
      <span :style="{ width: '61%' }"></span>
    </div>
    <p>预计 1 分钟完成。</p>
  </BaseModal>

  <BaseModal :show="modals.info" title="提示信息" @close="modals.info = false">
    <p>计费报表支持 CSV/Excel 导出，并可同步到财务系统。</p>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modals = reactive({
  project: false,
  role: false,
  quota: false,
  report: false,
  info: false
});

const forms = reactive({
  project: {
    name: '',
    owner: '',
    center: ''
  },
  role: {
    user: '',
    role: '项目管理员',
    scope: ''
  },
  quota: {
    project: '',
    amount: '',
    reason: ''
  }
});

const costShare = [
  { name: '材料仿真', value: 38 },
  { name: '药物计算', value: 26 },
  { name: 'AI 训练', value: 21 },
  { name: '流体力学', value: 15 }
];

const usages = Array.from({ length: 24 }, (_, index) => {
  return {
    name: `项目组-${index + 1}`,
    owner: index % 2 === 0 ? '张工' : '李工',
    used: `${120 + index * 12} 节点时`,
    quota: `${200 + index * 15} 节点时`,
    center: `COST-${100 + index}`,
    status: index % 5 === 0 ? '超额预警' : '正常'
  };
});
</script>
