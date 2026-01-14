<template>
  <div class="page-container">
    <div class="grid setting-grid">
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">角色权限配置</h2>
          <div class="actions">
            <button class="button" @click="openModal('role')">新增角色</button>
            <button class="button secondary" @click="openModal('permission')">分配权限</button>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>角色</th>
              <th>机构</th>
              <th>权限范围</th>
              <th>链上节点</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.name">
              <td>{{ role.name }}</td>
              <td>{{ role.org }}</td>
              <td>{{ role.scope }}</td>
              <td>{{ role.node }}</td>
              <td><span class="badge">{{ role.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">机构配置</h2>
          <button class="button ghost" @click="openModal('org')">新增机构</button>
        </div>
        <div class="org-list">
          <div v-for="org in orgs" :key="org.name" class="org-item">
            <div>
              <strong>{{ org.name }}</strong>
              <p>{{ org.desc }}</p>
            </div>
            <span class="tag">{{ org.level }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2 class="section-title">审计日志</h2>
        <div class="actions">
          <button class="button" @click="openModal('audit')">导出日志</button>
          <button class="button secondary" @click="openModal('progress')">同步存证</button>
          <button class="button ghost" @click="openModal('tips')">提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>操作</th>
            <th>对象</th>
            <th>结果</th>
            <th>链上凭证</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>{{ log.time }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.target }}</td>
            <td><span class="badge">{{ log.result }}</span></td>
            <td>{{ log.hash }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :show="modal.show" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'role'">
        <div class="modal-form">
          <label>角色名称
            <input class="input" v-model="form.roleName" placeholder="例如：监管审计" />
          </label>
          <label>所属机构
            <input class="input" v-model="form.roleOrg" placeholder="省级监管" />
          </label>
          <label>权限范围
            <input class="input" v-model="form.roleScope" placeholder="数据查看/穿透查询" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'permission'">
        <div class="modal-form">
          <label>角色选择
            <select class="input" v-model="form.permissionRole">
              <option>银行信贷</option>
              <option>担保机构</option>
              <option>村集体</option>
              <option>监管审计</option>
            </select>
          </label>
          <label>权限列表
            <input class="input" v-model="form.permissionList" placeholder="确权/审批/放款/审计" />
          </label>
          <label>链上节点
            <input class="input" v-model="form.permissionNode" placeholder="节点编号" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'org'">
        <div class="modal-form">
          <label>机构名称
            <input class="input" v-model="form.orgName" placeholder="请输入机构名称" />
          </label>
          <label>机构级别
            <select class="input" v-model="form.orgLevel">
              <option>省级</option>
              <option>市级</option>
              <option>县级</option>
            </select>
          </label>
          <label>链上节点配置
            <input class="input" v-model="form.orgNode" placeholder="节点地址/证书" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'audit'">
        <div class="modal-form">
          <label>导出范围
            <input class="input" v-model="form.auditScope" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" />
          </label>
          <label>导出格式
            <select class="input" v-model="form.auditFormat">
              <option>Excel</option>
              <option>CSV</option>
              <option>PDF</option>
            </select>
          </label>
          <label>是否脱敏
            <select class="input" v-model="form.auditMask">
              <option>是</option>
              <option>否</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <div class="progress">
          <div class="progress-bar" :style="{ width: '52%' }"></div>
        </div>
        <p class="progress-text">审计日志存证 12/23 条，预计 30 秒完成。</p>
      </template>
      <template v-else>
        <p>提示：所有权限调整将自动写入审计日志并上链。</p>
      </template>
      <template #footer>
        <button class="button secondary" type="button" @click="closeModal">取消</button>
        <button class="button" type="button" @click="confirmModal">提交</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const roles = [
  { name: '银行信贷', org: '省农信', scope: '放款/审批', node: 'Node-01', status: '启用' },
  { name: '担保机构', org: '担保公司', scope: '评估/核验', node: 'Node-03', status: '启用' },
  { name: '村集体', org: '村集体', scope: '确权/台账', node: 'Node-05', status: '启用' },
  { name: '监管审计', org: '省监管', scope: '穿透查询', node: 'Node-09', status: '启用' }
];

const orgs = [
  { name: '省农信总行', desc: '核心放款与审批节点', level: '省级' },
  { name: '市级农商行', desc: '贷前尽调与评估', level: '市级' },
  { name: '县域担保公司', desc: '担保与风险处置', level: '县级' },
  { name: '村集体经济组织', desc: '确权与台账核验', level: '基层' }
];

const logs = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  time: `2024-09-${String((index % 28) + 1).padStart(2, '0')} 10:${String(index + 10).padStart(2, '0')}`,
  user: ['operator', 'auditor', 'reviewer'][index % 3],
  action: ['修改权限', '导出报表', '写入存证'][index % 3],
  target: ['角色配置', '监管报表', '链上凭证'][index % 3],
  result: ['成功', '待复核'][index % 2],
  hash: `0x${(200000 + index).toString(16)}`
}));

const modal = reactive({
  show: false,
  type: 'tips',
  title: ''
});

const form = reactive({
  roleName: '',
  roleOrg: '',
  roleScope: '',
  permissionRole: '银行信贷',
  permissionList: '',
  permissionNode: '',
  orgName: '',
  orgLevel: '省级',
  orgNode: '',
  auditScope: '',
  auditFormat: 'Excel',
  auditMask: '是'
});

const openModal = (type) => {
  modal.show = true;
  modal.type = type;
  modal.title =
    type === 'role'
      ? '新增角色'
      : type === 'permission'
        ? '分配角色权限'
        : type === 'org'
          ? '新增机构节点'
          : type === 'audit'
            ? '导出审计日志'
            : type === 'progress'
              ? '审计日志存证'
              : '按钮提示';
};

const closeModal = () => {
  modal.show = false;
};

const confirmModal = () => {
  modal.show = false;
};
</script>

<style scoped>
.setting-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.org-list {
  display: grid;
  gap: 12px;
}

.org-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  gap: 12px;
}

.org-item p {
  color: #64748b;
  font-size: 12px;
}

.modal-form {
  display: grid;
  gap: 12px;
  font-size: 14px;
  color: #475569;
}

.modal-form label {
  display: grid;
  gap: 6px;
}

.progress {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
}

.progress-text {
  margin-top: 12px;
  color: #64748b;
  font-size: 13px;
}
</style>
