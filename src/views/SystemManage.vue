<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>系统管理</h3>
        <p>管理账户权限、操作日志与配置同步，保障平台稳定运行。</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="openAdd">新增账号</button>
        <button class="secondary-btn" @click="openSync">同步配置</button>
        <button class="secondary-btn" @click="openAlert">安全提示</button>
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric-card" v-for="stat in stats" :key="stat.label">
        <div style="color:#5c6c80;font-size:13px;">{{ stat.label }}</div>
        <div style="font-size:22px;font-weight:800;">{{ stat.value }}</div>
        <div class="progress-bar" style="margin-top:6px;"><span :style="{ width: stat.progress + '%' }"></span></div>
      </div>
    </div>

    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4 style="margin:0;">账号与权限</h4>
        <span style="color:#5c6c80;">共 {{ accounts.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>角色</th>
            <th>所属单位</th>
            <th>手机号</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in accounts" :key="user.phone">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.org }}</td>
            <td>{{ user.phone }}</td>
            <td><span class="tag" :class="user.status === '启用' ? 'green' : 'orange'">{{ user.status }}</span></td>
            <td><button class="secondary-btn" @click="editUser(user)">编辑</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showAdd" title="新增/编辑账号" @close="showAdd = false">
      <form class="form-grid" @submit.prevent="saveUser">
        <label>姓名<input v-model="form.name" required /></label>
        <label>角色<select v-model="form.role"><option>运营</option><option>物流</option><option>供应链</option><option>系统</option></select></label>
        <label>所属单位<input v-model="form.org" required /></label>
        <label>手机号<input v-model="form.phone" required /></label>
        <label>状态<select v-model="form.status"><option>启用</option><option>停用</option></select></label>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button type="button" class="secondary-btn" @click="showAdd = false">取消</button>
          <button class="primary-btn">保存</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showSync" title="同步配置" @close="showSync = false">
      <p>正在同步菜单、权限与日志采集策略...</p>
      <div class="progress-bar" style="margin:12px 0;height:14px;"><span :style="{ width: syncProgress + '%' }"></span></div>
      <p style="margin:0;color:#6d7b8f;">{{ syncProgress }}% 完成</p>
      <div style="text-align:right;margin-top:10px;">
        <button class="secondary-btn" @click="showSync = false">关闭</button>
      </div>
    </BaseModal>

    <BaseModal :show="showAlert" title="安全提示" @close="showAlert = false">
      <p>请定期检查账号和操作日志，确保关键操作均需多因子验证。</p>
      <div style="text-align:right;margin-top:10px;">
        <button class="primary-btn" @click="showAlert = false">知道了</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = [
  { label: '启用账号', value: '86', progress: 86 },
  { label: '本周新增', value: '12', progress: 60 },
  { label: '角色模板', value: '6', progress: 45 }
];

const accounts = reactive([
  { name: '李晨', role: '运营', org: '县商务局', phone: '13900000001', status: '启用' },
  { name: '王涵', role: '物流', org: '冷链中心', phone: '13900000002', status: '启用' },
  { name: '赵伟', role: '供应链', org: '供销社', phone: '13900000003', status: '启用' },
  { name: '孙敏', role: '系统', org: '数智中心', phone: '13900000004', status: '启用' },
  { name: '周雪', role: '运营', org: '乡村振兴办', phone: '13900000005', status: '停用' },
  { name: '钱亮', role: '物流', org: '物流园', phone: '13900000006', status: '启用' },
  { name: '吴洋', role: '供应链', org: '批发市场', phone: '13900000007', status: '启用' },
  { name: '郑琪', role: '系统', org: '县大数据', phone: '13900000008', status: '启用' },
  { name: '冯涛', role: '运营', org: '县商务局', phone: '13900000009', status: '启用' },
  { name: '陈芳', role: '物流', org: '冷链中心', phone: '13900000010', status: '启用' },
  { name: '韩梅', role: '供应链', org: '农服中心', phone: '13900000011', status: '停用' },
  { name: '刘超', role: '系统', org: '数智中心', phone: '13900000012', status: '启用' },
  { name: '陶玲', role: '运营', org: '乡村振兴办', phone: '13900000013', status: '启用' },
  { name: '谢宁', role: '物流', org: '物流园', phone: '13900000014', status: '启用' },
  { name: '罗阳', role: '供应链', org: '供销社', phone: '13900000015', status: '启用' },
  { name: '宋哲', role: '系统', org: '县大数据', phone: '13900000016', status: '启用' },
  { name: '叶青', role: '运营', org: '县商务局', phone: '13900000017', status: '停用' },
  { name: '潘伟', role: '物流', org: '冷链中心', phone: '13900000018', status: '启用' },
  { name: '任倩', role: '供应链', org: '批发市场', phone: '13900000019', status: '启用' },
  { name: '戴磊', role: '系统', org: '数智中心', phone: '13900000020', status: '启用' }
]);

const showAdd = ref(false);
const showSync = ref(false);
const showAlert = ref(false);
const syncProgress = ref(0);
const form = reactive({ name: '', role: '运营', org: '', phone: '', status: '启用' });

const openAdd = () => {
  form.name = '';
  form.role = '运营';
  form.org = '';
  form.phone = '';
  form.status = '启用';
  showAdd.value = true;
};

const openSync = () => {
  showSync.value = true;
  syncProgress.value = 0;
  const timer = setInterval(() => {
    syncProgress.value += 20;
    if (syncProgress.value >= 100) {
      syncProgress.value = 100;
      clearInterval(timer);
    }
  }, 300);
};

const openAlert = () => {
  showAlert.value = true;
};

const saveUser = () => {
  accounts.unshift({ ...form });
  showAdd.value = false;
};

const editUser = (user) => {
  Object.assign(form, user);
  showAdd.value = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d8e4f4;
  background: #f9fbff;
}
</style>
