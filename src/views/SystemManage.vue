<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const users = reactive([
  { name: '王可', role: '管理员', dept: '平台组', status: '启用' },
  { name: '李华', role: '运营', dept: '运营部', status: '启用' },
  { name: '陈晓', role: '市场', dept: '市场部', status: '启用' },
  { name: '赵敏', role: '财务', dept: '财务部', status: '禁用' },
  { name: '刘杰', role: '数据', dept: '数据组', status: '启用' },
  { name: '何欣', role: '客服', dept: '客服组', status: '启用' },
  { name: '周亮', role: '产品', dept: '产品部', status: '启用' },
  { name: '张楠', role: '研发', dept: '研发部', status: '禁用' },
  { name: '王静', role: '质检', dept: '质检组', status: '启用' },
  { name: '刘凯', role: '供应链', dept: '供应链', status: '启用' }
]);

const auditModal = ref(false);
const userModal = ref(false);
const resetModal = ref(false);
const auditLogs = reactive([
  '09:10 管理员更新了权限模板「运营观察员」',
  '09:12 财务角色新增了导出权限',
  '09:15 数据角色移除删除任务权限',
  '09:18 研发角色新增调度审批权限',
  '09:20 系统发起安全基线自检',
  '09:21 自检通过，生成审计记录',
  '09:25 市场角色新增查看投放成本权限',
  '09:26 质检角色新增推送提醒权限',
  '09:28 运营角色禁用导入权限',
  '09:30 完成审计备份'
]);

const form = reactive({ name: '', role: '运营', dept: '', status: '启用' });

const addUser = () => {
  users.unshift({ ...form });
  form.name = '';
  form.dept = '';
  form.role = '运营';
  form.status = '启用';
  userModal.value = false;
};
</script>

<template>
  <div>
    <div class="section-header">
      <h2>系统管理与权限控制</h2>
      <div class="button-row">
        <button @click="userModal = true">新增用户</button>
        <button class="secondary" @click="resetModal = true">重置权限</button>
        <button class="ghost" @click="auditModal = true">查看审计</button>
      </div>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>角色</th>
            <th>部门</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.dept }}</td>
            <td>
              <span class="status" :class="{ success: user.status === '启用', danger: user.status === '禁用' }">{{ user.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog title="新增用户" :show="userModal" @close="userModal = false">
      <div class="form-grid">
        <label>
          姓名
          <input v-model="form.name" placeholder="请输入姓名" />
        </label>
        <label>
          角色
          <select v-model="form.role">
            <option>管理员</option>
            <option>运营</option>
            <option>市场</option>
            <option>财务</option>
            <option>数据</option>
            <option>客服</option>
          </select>
        </label>
        <label>
          部门
          <input v-model="form.dept" placeholder="所属部门" />
        </label>
        <label>
          状态
          <select v-model="form.status">
            <option>启用</option>
            <option>禁用</option>
          </select>
        </label>
      </div>
      <div class="button-row" style="margin-top: 12px">
        <button @click="addUser">提交</button>
        <button class="ghost" @click="userModal = false">取消</button>
      </div>
    </ModalDialog>

    <ModalDialog title="重置权限" :show="resetModal" @close="resetModal = false">
      <p>确认将所有角色权限恢复为默认模板？</p>
      <div class="button-row" style="margin-top: 12px">
        <button @click="resetModal = false">确认重置</button>
        <button class="ghost" @click="resetModal = false">取消</button>
      </div>
    </ModalDialog>

    <ModalDialog title="审计记录" :show="auditModal" @close="auditModal = false">
      <ul style="padding-left: 18px; margin: 0">
        <li v-for="item in auditLogs" :key="item" style="margin: 6px 0">{{ item }}</li>
      </ul>
    </ModalDialog>
  </div>
</template>
