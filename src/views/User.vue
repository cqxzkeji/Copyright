<template>
  <div class="card">
    <div class="section-header">
      <div>
        <p class="badge">角色与商户</p>
        <h3 style="margin:6px 0 0;">用户与商户管理</h3>
      </div>
      <div class="tag-row">
        <button class="primary-btn" @click="showCreate = true">新增用户/商户</button>
        <button class="secondary-btn" @click="showProgress('批量导入用户')">批量导入</button>
      </div>
    </div>

    <div class="card-grid" style="margin-top: 12px;">
      <div class="card" v-for="snapshot in snapshots" :key="snapshot.label">
        <div class="section-header">
          <div>
            <p class="badge" :style="snapshot.badgeStyle">{{ snapshot.label }}</p>
            <h4 style="margin:4px 0 0;">{{ snapshot.value }}</h4>
          </div>
          <span style="color:#16a34a;font-weight:700;">{{ snapshot.trend }}</span>
        </div>
        <div class="chart-bar" style="margin-top:10px;">
          <span :style="{ width: snapshot.percent + '%', background: snapshot.color }"></span>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>名称</th>
          <th>类型</th>
          <th>信用分</th>
          <th>近30天成交</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.name">
          <td>{{ user.name }}</td>
          <td>{{ user.type }}</td>
          <td>{{ user.credit }}</td>
          <td>¥{{ user.volume }}</td>
          <td>
            <span class="status-pill" :class="user.status === '正常' ? 'status-success' : 'status-warning'">{{ user.status }}</span>
          </td>
          <td class="tag-row">
            <button class="secondary-btn" @click="openEdit(user)">编辑</button>
            <button class="secondary-btn" @click="openReset(user)">重置密码</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showCreate" title="新增用户/商户">
    <form class="form-grid" @submit.prevent="submitCreate">
      <label>名称<input v-model="createForm.name" required /></label>
      <label>类型<select v-model="createForm.type"><option>商户</option><option>内部员工</option><option>仓储合作方</option></select></label>
      <label>信用分<input v-model.number="createForm.credit" type="number" min="0" max="100" /></label>
      <label>联系方式<input v-model="createForm.contact" required /></label>
      <label>角色<select v-model="createForm.role"><option>运营</option><option>仓储</option><option>财务</option></select></label>
      <label style="grid-column:1/-1;">备注<textarea v-model="createForm.remark" rows="2"></textarea></label>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;">
        <button class="secondary-btn" type="button" @click="showCreate=false">取消</button>
        <button class="primary-btn" type="submit">保存</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showEdit" title="编辑用户">
    <form class="form-grid" @submit.prevent="submitEdit">
      <label>名称<input v-model="selected.name" required /></label>
      <label>信用分<input v-model.number="selected.credit" type="number" min="0" max="100" /></label>
      <label>状态<select v-model="selected.status"><option>正常</option><option>冻结</option></select></label>
      <label style="grid-column:1/-1;">标签<textarea v-model="selected.tags" rows="2" placeholder="核心供货、优质履约"></textarea></label>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;">
        <button class="secondary-btn" type="button" @click="showEdit=false">取消</button>
        <button class="primary-btn" type="submit">保存修改</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showReset" title="重置密码">
    <p style="margin:0 0 12px;color:#475569;">为 {{ selected.name }} 发送一次性密码链接。</p>
    <div class="progress-track">
      <div class="progress-thumb" style="width:58%;"></div>
    </div>
    <div class="tag-row" style="margin-top:12px;">
      <button class="secondary-btn" @click="showReset=false">取消</button>
      <button class="primary-btn" @click="showReset=false">立即发送</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showProgressModal" :title="progressTitle">
    <p style="color:#475569;margin-top:0;">导入文件校验中...</p>
    <div class="progress-track" style="margin:10px 0 12px;">
      <div class="progress-thumb" :style="{ width: progress + '%' }"></div>
    </div>
    <p style="margin:0;color:#16a34a;">当前进度：{{ progress }}%</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const users = reactive([
  { name: '阳光农庄旗舰店', type: '商户', credit: 96, volume: 183200, status: '正常' },
  { name: '田野供销合作社', type: '商户', credit: 92, volume: 142300, status: '正常' },
  { name: '有机田园自营', type: '商户', credit: 89, volume: 165430, status: '正常' },
  { name: '乡味庄园', type: '商户', credit: 85, volume: 87460, status: '正常' },
  { name: '华东仓管', type: '内部员工', credit: 90, volume: 0, status: '正常' },
  { name: '西南原产仓管', type: '内部员工', credit: 88, volume: 0, status: '正常' },
  { name: '财务小组', type: '内部员工', credit: 95, volume: 0, status: '正常' },
  { name: '冷链运输合作商', type: '仓储合作方', credit: 80, volume: 21000, status: '正常' },
  { name: '华北分销商', type: '商户', credit: 78, volume: 53400, status: '正常' },
  { name: '南宁团购团长', type: '商户', credit: 84, volume: 41200, status: '冻结' }
]);

const snapshots = [
  { label: '活跃商户', value: '126', trend: '+6%', percent: 68, color: '#22c55e', badgeStyle: { background: '#dcfce7', color: '#166534' } },
  { label: '内部账号', value: '42', trend: '+2%', percent: 48, color: '#38bdf8', badgeStyle: { background: '#e0f2fe', color: '#0369a1' } },
  { label: '异常冻结', value: '3', trend: '-1%', percent: 18, color: '#f97316', badgeStyle: { background: '#fff7ed', color: '#c2410c' } }
];

const showCreate = ref(false);
const showEdit = ref(false);
const showReset = ref(false);
const showProgressModal = ref(false);
const progressTitle = ref('');
const progress = ref(25);
const selected = reactive({});

const createForm = reactive({ name: '', type: '商户', credit: 90, contact: '', role: '运营', remark: '' });

const showProgress = (title) => {
  progressTitle.value = title;
  showProgressModal.value = true;
  progress.value = 20;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value >= 100) clearInterval(timer);
  }, 500);
};

const submitCreate = () => {
  users.push({ name: createForm.name, type: createForm.type, credit: createForm.credit, volume: 0, status: '正常' });
  showCreate.value = false;
  showProgress('创建新账号');
};

const openEdit = (user) => {
  Object.assign(selected, user);
  showEdit.value = true;
};

const submitEdit = () => {
  showEdit.value = false;
  showProgress('更新账号信息');
};

const openReset = (user) => {
  Object.assign(selected, user);
  showReset.value = true;
};
</script>
