<template>
  <div class="grid" style="gap: 16px;">
    <div class="flex-between" style="flex-wrap: wrap; gap: 12px;">
      <div>
        <h2 style="margin: 0;">系统管理与合规审计</h2>
        <p style="margin: 4px 0 0; color: #6b7280;">账户、资产、审计日志统一管理</p>
      </div>
      <div class="button-row">
        <button class="btn primary" @click="showUser = true">新增账号</button>
        <button class="btn success" @click="showAssetModal = true">资产登记</button>
        <button class="btn warning" @click="showAudit = true">审计导出</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">账号总数</div>
            <div style="font-size: 28px; font-weight: 800;">64</div>
          </div>
          <span class="badge success">合规</span>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">资产总量</div>
            <div style="font-size: 28px; font-weight: 800;">128</div>
          </div>
          <span class="badge warning">待盘点</span>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">审计记录</div>
            <div style="font-size: 28px; font-weight: 800;">1,042</div>
          </div>
          <span class="badge success">实时更新</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 12px;">
        <h3 style="margin: 0;">账号与权限</h3>
        <span class="badge" style="background: #eef2ff; color: #1d4ed8;">{{ users.length }} 条</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>账号</th>
            <th>角色</th>
            <th>邮箱</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.email }}</td>
            <td><span class="badge" :class="user.status === '启用' ? 'success' : 'warning'">{{ user.status }}</span></td>
            <td class="button-row">
              <button class="btn ghost" @click="openUser(user)">查看</button>
              <button class="btn success" @click="toggleUser(user)">{{ user.status === '启用' ? '停用' : '启用' }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <h3 style="margin: 0;">审计日志</h3>
        <small style="color: #6b7280;">近10条</small>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>动作</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in audits" :key="log.time + log.user">
            <td>{{ log.time }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.result }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showUser" title="新增账号">
      <form class="grid" style="gap: 10px;">
        <label>账号<input v-model="userForm.name" /></label>
        <label>邮箱<input v-model="userForm.email" /></label>
        <label>角色<select v-model="userForm.role"><option>管理员</option><option>分析员</option><option>审计员</option></select></label>
      </form>
      <template #footer>
        <button class="btn ghost" @click="showUser = false">取消</button>
        <button class="btn primary" @click="addUser">保存</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showAssetModal" title="资产登记">
      <form class="grid" style="gap: 10px;">
        <label>资产名称<input v-model="assetForm.name" /></label>
        <label>类型<select v-model="assetForm.type"><option>服务器</option><option>网络设备</option><option>终端</option></select></label>
        <label>责任人<input v-model="assetForm.owner" /></label>
      </form>
      <template #footer>
        <button class="btn ghost" @click="showAssetModal = false">取消</button>
        <button class="btn success" @click="addAsset">保存</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showAudit" title="审计导出">
      <p>选择导出范围</p>
      <div class="grid" style="gap: 8px;">
        <label><input type="radio" value="近24小时" v-model="exportRange" /> 近24小时</label>
        <label><input type="radio" value="近7天" v-model="exportRange" /> 近7天</label>
        <label><input type="radio" value="近30天" v-model="exportRange" /> 近30天</label>
      </div>
      <div class="progress-bar" style="margin-top: 10px;">
        <div class="inner" :style="{ width: exportProgress + '%' }"></div>
      </div>
      <template #footer>
        <button class="btn ghost" @click="showAudit = false">取消</button>
        <button class="btn primary" @click="exportAudit">导出</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showUserDetail" :title="activeUser?.name || '账号详情'">
      <p>角色：{{ activeUser?.role }}</p>
      <p>邮箱：{{ activeUser?.email }}</p>
      <template #footer>
        <button class="btn ghost" @click="showUserDetail = false">关闭</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showUser = ref(false);
const showAssetModal = ref(false);
const showAudit = ref(false);
const showUserDetail = ref(false);
const exportProgress = ref(40);
const exportRange = ref('近7天');
const activeUser = ref(null);

const userForm = reactive({ name: '', email: '', role: '管理员' });
const assetForm = reactive({ name: '', type: '服务器', owner: '' });

const users = reactive([
  { name: 'admin', role: '管理员', email: 'admin@example.com', status: '启用' },
  { name: 'soc', role: '分析员', email: 'soc@example.com', status: '启用' },
  { name: 'audit', role: '审计员', email: 'audit@example.com', status: '启用' },
  { name: 'ops', role: '运维', email: 'ops@example.com', status: '启用' },
  { name: 'risk', role: '风险官', email: 'risk@example.com', status: '启用' },
  { name: 'manager', role: '经理', email: 'manager@example.com', status: '停用' },
  { name: 'owner', role: '资产责任人', email: 'owner@example.com', status: '启用' },
  { name: 'guest', role: '访客', email: 'guest@example.com', status: '停用' },
  { name: 'ops2', role: '运维', email: 'ops2@example.com', status: '启用' },
  { name: 'edr', role: '分析员', email: 'edr@example.com', status: '启用' },
  { name: 'ndr', role: '分析员', email: 'ndr@example.com', status: '启用' }
]);

const audits = reactive([
  { time: '10:21', user: 'admin', action: '新增账户 soc', result: '成功' },
  { time: '10:18', user: 'soc', action: '查看威胁报告', result: '成功' },
  { time: '10:16', user: 'audit', action: '导出审计日志', result: '成功' },
  { time: '10:12', user: 'ops', action: '更新采集配置', result: '成功' },
  { time: '10:10', user: 'admin', action: '停用账号 guest', result: '成功' },
  { time: '10:05', user: 'risk', action: '修改风险策略', result: '成功' },
  { time: '10:00', user: 'manager', action: '审批剧本', result: '成功' },
  { time: '09:55', user: 'owner', action: '登记资产 VPN', result: '成功' },
  { time: '09:50', user: 'soc', action: '查看资产风险', result: '成功' },
  { time: '09:45', user: 'ops2', action: '更新证书', result: '成功' }
]);

const addUser = () => {
  if (userForm.name) {
    users.push({ ...userForm, status: '启用' });
    showUser.value = false;
  }
};

const addAsset = () => {
  if (assetForm.name) {
    audits.push({ time: '刚刚', user: 'admin', action: `登记资产 ${assetForm.name}`, result: '成功' });
    showAssetModal.value = false;
  }
};

const exportAudit = () => {
  exportProgress.value = 0;
  const timer = setInterval(() => {
    if (exportProgress.value >= 100) {
      clearInterval(timer);
    } else {
      exportProgress.value += 20;
    }
  }, 300);
};

const openUser = (user) => {
  activeUser.value = user;
  showUserDetail.value = true;
};

const toggleUser = (user) => {
  user.status = user.status === '启用' ? '停用' : '启用';
};
</script>
