<template>
  <section>
    <div class="card-grid">
      <div class="card" v-for="item in stats" :key="item.label">
        <h3>{{ item.label }}</h3>
        <div class="value">{{ item.value }}</div>
        <p>{{ item.note }}</p>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>用户信息与权限配置</h2>
        <div class="button-group">
          <button class="btn" type="button" @click="openFormModal('新增用户')">新增用户</button>
          <button class="btn secondary" type="button" @click="openProgressModal('同步权限')">同步权限</button>
          <button class="btn ghost" type="button" @click="openNoticeModal('行为画像提示')">行为画像提示</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>角色</th>
              <th>手机号</th>
              <th>最近登录</th>
              <th>活跃度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.lastLogin }}</td>
              <td>
                <span :class="['status', user.statusClass]">{{ user.activity }}</span>
              </td>
              <td>
                <div class="button-group">
                  <button class="btn secondary" type="button" @click="openFormModal('编辑用户')">编辑</button>
                  <button class="btn" type="button" @click="openNoticeModal('查看详情')">详情</button>
                  <button class="btn ghost" type="button" @click="openProgressModal('冻结账号')">冻结</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Modal :show="modal.show" :title="modal.title" @close="closeModal">
      <p>{{ modal.message }}</p>
      <div v-if="modal.formType" class="form-grid">
        <div>
          <label>用户姓名</label>
          <input type="text" placeholder="输入姓名" />
        </div>
        <div>
          <label>角色权限</label>
          <select>
            <option>运营主管</option>
            <option>销售顾问</option>
            <option>仓储管理员</option>
            <option>财务审核</option>
          </select>
        </div>
        <div>
          <label>手机号</label>
          <input type="text" placeholder="输入手机号" />
        </div>
      </div>
      <div v-if="modal.showProgress" class="progress-bar">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <template #footer>
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import Modal from '../components/Modal.vue';

const stats = [
  { label: '总用户数', value: '1,268', note: '月活 82%' },
  { label: '管理员', value: '38', note: '权限已复核' },
  { label: '新增注册', value: '112', note: '近七天' },
  { label: '高活跃用户', value: '426', note: '重点维护' }
];

const users = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `顾问${index + 1}`,
  role: ['运营主管', '销售顾问', '仓储管理员', '财务审核'][index % 4],
  phone: `138****${String(1200 + index).slice(-4)}`,
  lastLogin: `2024-09-${String((index % 28) + 1).padStart(2, '0')} 10:${String(index % 60).padStart(2, '0')}`,
  activity: ['高活跃', '正常', '低活跃'][index % 3],
  statusClass: ['','', 'warning'][index % 3]
}));

const modal = reactive({
  show: false,
  title: '',
  message: '',
  formType: false,
  showProgress: false,
  progress: 70
});

const openFormModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `请填写${action}所需信息，并确认权限范围。`;
  modal.formType = true;
  modal.showProgress = false;
};

const openProgressModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `正在执行${action}，请留意系统权限调整结果。`;
  modal.formType = false;
  modal.showProgress = true;
  modal.progress = action === '冻结账号' ? 55 : 82;
};

const openNoticeModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `提示：${action}将展示用户行为轨迹与审批记录。`;
  modal.formType = false;
  modal.showProgress = false;
};

const closeModal = () => {
  modal.show = false;
};
</script>
