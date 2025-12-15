<template>
  <div class="grid" style="gap: 16px;">
    <div class="card">
      <div class="flex-between" style="margin-bottom: 8px;">
        <div>
          <p class="section-title" style="margin: 0;">系统配置与权限管理</p>
          <p class="subtext">统一配置中心、角色权限与访问审计</p>
        </div>
        <div class="toolbar">
          <button class="primary-btn" @click="showRoleForm = true">新增角色</button>
          <button class="secondary-btn" @click="startSync">同步配置</button>
          <button class="ghost-btn" @click="showSettingTip = true">查看说明</button>
        </div>
      </div>
      <SimpleBarChart
        title="配置同步频次"
        subtitle="单位：次/小时"
        :data="chartData"
      />
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <p class="section-title" style="margin: 0;">角色与权限</p>
        <span class="tag">{{ roles.length }} 个角色</span>
      </div>
      <div class="table-wrapper" style="overflow: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>角色</th>
              <th>描述</th>
              <th>成员数</th>
              <th>权限级别</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.name">
              <td>{{ role.name }}</td>
              <td>{{ role.desc }}</td>
              <td>{{ role.members }}</td>
              <td>{{ role.level }}</td>
              <td><span :class="['status-chip', role.statusClass]">{{ role.status }}</span></td>
              <td><button class="secondary-btn" @click="openRole(role)">配置</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showRoleForm" title="新增角色" description="配置角色权限范围">
    <form class="grid" style="gap: 12px;">
      <div>
        <label class="label">角色名称</label>
        <input class="input" v-model="roleForm.name" placeholder="如：数据管理员" />
      </div>
      <div class="grid grid-2">
        <div>
          <label class="label">权限级别</label>
          <select class="input" v-model="roleForm.level">
            <option>只读</option>
            <option>读写</option>
            <option>管理员</option>
          </select>
        </div>
        <div>
          <label class="label">成员数</label>
          <input class="input" v-model="roleForm.members" placeholder="5" />
        </div>
      </div>
      <div>
        <label class="label">描述</label>
        <textarea class="input" rows="3" v-model="roleForm.desc" placeholder="角色的职责、范围与限制"></textarea>
      </div>
      <div class="flex-between" style="gap: 10px;">
        <span class="subtext">保存后需要管理员确认</span>
        <div class="toolbar">
          <button class="ghost-btn" type="button" @click="showRoleForm = false">取消</button>
          <button class="primary-btn" type="button" @click="saveRole">保存</button>
        </div>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showSettingTip" title="配置说明" description="配置中心与权限同步说明">
    <p class="subtext" style="margin: 0 0 8px 0;">同步时会自动生成审计记录，并推送到安全团队。</p>
    <div class="grid grid-2">
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">配置中心</p>
        <p class="subtext">支持灰度、版本回滚与全量生效。</p>
      </div>
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">权限矩阵</p>
        <p class="subtext">按模块、动作、数据域划分，可导出审计。</p>
      </div>
    </div>
    <div style="text-align: right; margin-top: 12px;">
      <button class="primary-btn" @click="showSettingTip = false">关闭</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showSyncProgress" title="同步配置" description="同步期间请勿进行高危操作">
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${syncProgress}%` }"></div>
    </div>
    <p class="subtext" style="margin-top: 10px;">同步进度 {{ syncProgress }}%</p>
    <div style="text-align: right;">
      <button class="primary-btn" :disabled="syncProgress < 100" @click="showSyncProgress = false">完成</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showRoleModal" :title="activeRole?.name || '角色详情'" description="调整角色状态">
    <p class="subtext">权限级别：{{ activeRole?.level }} · 成员数：{{ activeRole?.members }}</p>
    <div class="grid grid-2" style="margin: 10px 0;">
      <button class="secondary-btn" @click="activateRole">启用</button>
      <button class="ghost-btn" @click="deactivateRole">停用</button>
    </div>
    <p class="subtext">{{ activeRole?.desc }}</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import SimpleBarChart from '../components/SimpleBarChart.vue';
import ModalDialog from '../components/ModalDialog.vue';

const chartData = [
  { label: '配置同步', value: 16 },
  { label: '权限变更', value: 8 },
  { label: '策略下发', value: 11 },
  { label: '审计记录', value: 14 },
  { label: '密钥轮转', value: 9 },
  { label: '接口授权', value: 12 }
];

const roles = ref([
  { name: '系统管理员', desc: '全局配置管理', members: 5, level: '管理员', status: '运行中', statusClass: 'status-active' },
  { name: '数据管理员', desc: '数据域管理与授权', members: 12, level: '读写', status: '运行中', statusClass: 'status-active' },
  { name: '安全审计员', desc: '审计与合规检查', members: 4, level: '只读', status: '运行中', statusClass: 'status-active' },
  { name: '接口负责人', desc: '接口调用管理', members: 9, level: '读写', status: '运行中', statusClass: 'status-active' },
  { name: 'AI 能力管理员', desc: '模型与知识库管理', members: 3, level: '读写', status: '待确认', statusClass: 'status-warning' },
  { name: '财务审核', desc: '费用中心与预算审批', members: 6, level: '读写', status: '运行中', statusClass: 'status-active' },
  { name: '运营督导', desc: '运营流程监督', members: 8, level: '读写', status: '运行中', statusClass: 'status-active' },
  { name: '外部合作', desc: '合作接口权限', members: 10, level: '只读', status: '待确认', statusClass: 'status-warning' },
  { name: '知识库访客', desc: '只读访问', members: 21, level: '只读', status: '运行中', statusClass: 'status-active' },
  { name: '告警响应', desc: '告警处置与升级', members: 7, level: '读写', status: '运行中', statusClass: 'status-active' },
  { name: '巡检值班', desc: '夜间巡检与值班', members: 6, level: '只读', status: '异常', statusClass: 'status-danger' }
]);

const showRoleForm = ref(false);
const showSettingTip = ref(false);
const showSyncProgress = ref(false);
const showRoleModal = ref(false);
const syncProgress = ref(0);
const activeRole = ref(null);
const roleForm = ref({ name: '', level: '只读', members: '5', desc: '' });
let syncTimer;

function startSync() {
  syncProgress.value = 0;
  showSyncProgress.value = true;
  clearInterval(syncTimer);
  syncTimer = setInterval(() => {
    if (syncProgress.value < 100) {
      syncProgress.value += 18;
    } else {
      clearInterval(syncTimer);
    }
  }, 260);
}

function saveRole() {
  roles.value = [
    {
      name: roleForm.value.name || '新角色',
      desc: roleForm.value.desc || '未填写',
      members: roleForm.value.members || 0,
      level: roleForm.value.level,
      status: '待确认',
      statusClass: 'status-warning'
    },
    ...roles.value
  ];
  showRoleForm.value = false;
  roleForm.value = { name: '', level: '只读', members: '5', desc: '' };
}

function openRole(role) {
  activeRole.value = role;
  showRoleModal.value = true;
}

function activateRole() {
  if (activeRole.value) {
    activeRole.value.status = '运行中';
    activeRole.value.statusClass = 'status-active';
  }
  showRoleModal.value = false;
}

function deactivateRole() {
  if (activeRole.value) {
    activeRole.value.status = '暂停';
    activeRole.value.statusClass = 'status-warning';
  }
  showRoleModal.value = false;
}
</script>
