<template>
  <div class="grid two">
    <div class="card">
      <div class="section-title">权限概览</div>
      <div class="grid two">
        <div>
          <div style="font-size: 26px; font-weight: 700;">132</div>
          <div style="font-size: 12px; color: #6b7a99;">在册用户</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 700;">6</div>
          <div style="font-size: 12px; color: #6b7a99;">权限角色</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 700;">18</div>
          <div style="font-size: 12px; color: #6b7a99;">待授权用户</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 700;">4</div>
          <div style="font-size: 12px; color: #6b7a99;">风险提示</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">权限分布</div>
      <div class="chart">
        <div v-for="item in roleChart" :key="item.label" class="chart-row">
          <span>{{ item.label }}</span>
          <div class="chart-bar">
            <span :style="{ width: item.value + '%' }"></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">权限操作</div>
    <div class="actions">
      <button class="btn" type="button" @click="openModal('create')">新增用户</button>
      <button class="btn secondary" type="button" @click="openModal('role')">分配角色</button>
      <button class="btn outline" type="button" @click="openModal('audit')">权限审计</button>
      <button class="btn secondary" type="button" @click="openModal('progress')">审计进度</button>
      <button class="btn outline" type="button" @click="openModal('tip')">操作提示</button>
    </div>
  </div>

  <div class="card">
    <div class="section-title">用户权限列表</div>
    <table class="table">
      <thead>
        <tr>
          <th>姓名</th>
          <th>账号</th>
          <th>部门</th>
          <th>角色</th>
          <th>最近登录</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.account">
          <td>{{ user.name }}</td>
          <td>{{ user.account }}</td>
          <td>{{ user.dept }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.lastLogin }}</td>
          <td><span class="badge" :class="user.badge">{{ user.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal">
    <template v-if="activeModal === 'create'">
      <div class="form-grid">
        <div>
          <label>姓名</label>
          <input v-model="form.name" placeholder="输入姓名" />
        </div>
        <div>
          <label>账号</label>
          <input v-model="form.account" placeholder="输入账号" />
        </div>
        <div>
          <label>部门</label>
          <select v-model="form.dept">
            <option value="运营中心">运营中心</option>
            <option value="数据中台">数据中台</option>
            <option value="研发部">研发部</option>
          </select>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'role'">
      <div class="form-grid">
        <div>
          <label>角色</label>
          <select v-model="form.role">
            <option value="管理员">管理员</option>
            <option value="审核员">审核员</option>
            <option value="数据分析">数据分析</option>
          </select>
        </div>
        <div>
          <label>授权说明</label>
          <textarea v-model="form.roleNote" rows="3" placeholder="填写授权说明"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'audit'">
      <p>请选择审计范围与重点，系统将生成权限风险报告。</p>
      <div class="form-grid" style="margin-top: 10px;">
        <div>
          <label>审计范围</label>
          <select v-model="form.auditRange">
            <option value="全部用户">全部用户</option>
            <option value="高权限用户">高权限用户</option>
            <option value="临时账号">临时账号</option>
          </select>
        </div>
        <div>
          <label>审计说明</label>
          <textarea v-model="form.auditNote" rows="3" placeholder="填写审计说明"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>审计执行进度</p>
      <div style="display: grid; gap: 8px; margin-top: 12px;">
        <div>
          <div style="font-size: 12px; color: #6b7a99;">账号核对</div>
          <div class="progress"><span style="width: 66%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">权限校验</div>
          <div class="progress"><span style="width: 48%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">风险报告</div>
          <div class="progress"><span style="width: 30%"></span></div>
        </div>
      </div>
    </template>
    <template v-else>
      <p>建议定期复核高权限角色，确保关键数据访问合规。</p>
    </template>
    <template #actions>
      <button class="btn" type="button" @click="closeModal">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const form = ref({
  name: '',
  account: '',
  dept: '运营中心',
  role: '管理员',
  roleNote: '',
  auditRange: '全部用户',
  auditNote: ''
});

const roleChart = [
  { label: '管理员', value: 60 },
  { label: '审批人员', value: 50 },
  { label: '数据分析', value: 72 },
  { label: '普通用户', value: 84 },
  { label: '访客', value: 32 }
];

const users = Array.from({ length: 23 }, (_, index) => {
  const status = [
    { text: '正常', badge: 'success' },
    { text: '待复核', badge: 'warning' },
    { text: '冻结', badge: 'info' }
  ][index % 3];
  return {
    name: ['许宁', '王波', '郑悦', '赵凯'][index % 4],
    account: `user${100 + index}`,
    dept: ['运营中心', '数据中台', '研发部'][index % 3],
    role: ['管理员', '审核员', '数据分析'][index % 3],
    lastLogin: `2024-07-${(index % 28 + 1).toString().padStart(2, '0')} 09:${(index % 6) * 10}`,
    status: status.text,
    badge: status.badge
  };
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const modalTitleMap = {
  create: '新增用户',
  role: '分配角色',
  audit: '权限审计',
  progress: '审计进度',
  tip: '操作提示'
};

const modalTitle = computed(() => modalTitleMap[activeModal.value] || '提示');
</script>
