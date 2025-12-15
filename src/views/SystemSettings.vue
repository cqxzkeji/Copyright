<template>
  <div class="grid" style="gap: 16px;">
    <div class="header-actions" style="justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 10px; align-items: center;">
        <h2 style="margin: 0;">系统配置与权限管理</h2>
        <span class="tag">配置中心</span>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openUser">添加用户</button>
        <button class="secondary-btn" @click="showProgress = true">同步配置</button>
        <button class="secondary-btn" @click="showHint = true">操作提示</button>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>权限角色</strong>
        <button class="secondary-btn" @click="showRoleInfo = true">角色说明</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>角色</th>
            <th>用户数</th>
            <th>描述</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.name">
            <td>{{ role.name }}</td>
            <td>{{ role.count }}</td>
            <td>{{ role.desc }}</td>
            <td><span class="status-chip" :style="role.status === '启用' ? goodChip : warnChip">{{ role.status }}</span></td>
            <td><button class="secondary-btn" @click="openDetail(role)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>配置变更记录</strong>
        <button class="secondary-btn" @click="showTableInfo = true">表格提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>模块</th>
            <th>操作人</th>
            <th>动作</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.time">
            <td>{{ log.time }}</td>
            <td>{{ log.module }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.action }}</td>
            <td><span class="status-chip" :style="log.result === '成功' ? goodChip : warnChip">{{ log.result }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showUserModal" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">添加用户</div>
      <div class="modal-body">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="userForm.name" placeholder="输入用户名" />
        </div>
        <div class="form-group">
          <label>角色</label>
          <select v-model="userForm.role">
            <option value="管理员">管理员</option>
            <option value="审计员">审计员</option>
            <option value="运维">运维</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="secondary-btn" @click="showUserModal = false">取消</button>
        <button class="primary-btn" @click="saveUser">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">同步配置</div>
      <div class="modal-body">
        <div class="progress-bar">
          <div class="progress-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="margin-top: 8px;">同步到各业务节点中...</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showProgress = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showHint" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">操作提示</div>
      <div class="modal-body">
        <p>新增用户默认启用，角色说明用于快速了解权限粒度。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showHint = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showRoleInfo" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">角色说明</div>
      <div class="modal-body">
        <p>管理员具备全局权限，审计员负责查看日志，运维负责变更。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showRoleInfo = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showTableInfo" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">表格提示</div>
      <div class="modal-body">
        <p>近期变更记录便于审计追溯，异常结果需及时复核。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showTableInfo = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="detail" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">角色详情 - {{ detail.name }}</div>
      <div class="modal-body">
        <p>用户数：{{ detail.count }}</p>
        <p>描述：{{ detail.desc }}</p>
        <p>状态：{{ detail.status }}</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="detail = null">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

const goodChip = { background: '#dcfce7', color: '#166534' };
const warnChip = { background: '#fff7ed', color: '#ea580c' };

const roles = ref([
  { name: '管理员', count: 4, desc: '拥有全部管理权限', status: '启用' },
  { name: '审计员', count: 3, desc: '可查看日志和报表', status: '启用' },
  { name: '运维', count: 6, desc: '可执行网络与配置变更', status: '启用' },
  { name: '访客', count: 8, desc: '只读访问', status: '禁用' },
  { name: '安全', count: 2, desc: '管理安全策略与证书', status: '启用' },
  { name: '开发', count: 5, desc: '查看接口与发布状态', status: '启用' }
]);

const logs = ref([
  { time: '09:05', module: '网络监测', user: 'Admin', action: '更新探测频率', result: '成功' },
  { time: '09:10', module: '告警管理', user: 'Auditor', action: '导出告警列表', result: '成功' },
  { time: '09:15', module: '性能分析', user: 'Ops', action: '调整阈值', result: '成功' },
  { time: '09:18', module: '配置中心', user: 'Admin', action: '新增用户', result: '成功' },
  { time: '09:20', module: '报表中心', user: 'Ops', action: '修改订阅', result: '成功' },
  { time: '09:24', module: '权限管理', user: 'Admin', action: '禁用访客', result: '成功' },
  { time: '09:28', module: '安全策略', user: 'Sec', action: '更新证书', result: '成功' },
  { time: '09:32', module: '网络监测', user: 'Ops', action: '新增探测', result: '成功' },
  { time: '09:36', module: '配置中心', user: 'Admin', action: '调整配置项', result: '成功' },
  { time: '09:40', module: '权限管理', user: 'Auditor', action: '查看角色', result: '成功' }
]);

const userForm = reactive({ name: '', role: '管理员' });
const showUserModal = ref(false);
const showProgress = ref(false);
const showHint = ref(false);
const showRoleInfo = ref(false);
const showTableInfo = ref(false);
const detail = ref(null);
const progress = ref(15);

const openUser = () => (showUserModal.value = true);

const saveUser = () => {
  roles.value.push({ name: userForm.name || '新用户', count: 1, desc: `${userForm.role} 成员`, status: '启用' });
  showUserModal.value = false;
  showHint.value = true;
};

const openDetail = (role) => {
  detail.value = role;
};

onMounted(() => {
  const timer = setInterval(() => {
    if (!showProgress.value) return;
    progress.value = Math.min(100, progress.value + 25);
    if (progress.value >= 100) {
      showProgress.value = false;
      progress.value = 15;
    }
  }, 400);
  return () => clearInterval(timer);
});
</script>
