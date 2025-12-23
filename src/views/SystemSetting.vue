<template>
  <div class="page">
    <div class="section-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 700;">系统配置与服务管理</div>
        <div class="action-row">
          <button class="btn" @click="openRole">新增角色</button>
          <button class="btn secondary" @click="openService">服务工单</button>
          <button class="btn warning" @click="openNotice">配置提示</button>
        </div>
      </div>
      <div class="card-grid" style="margin-top: 16px;">
        <div class="section-card" v-for="item in configs" :key="item.label">
          <div style="font-size: 12px; color: #64748b;">{{ item.label }}</div>
          <div style="font-size: 22px; font-weight: 700; margin-top: 8px;">{{ item.value }}</div>
          <div class="badge" style="margin-top: 10px;">{{ item.tag }}</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">服务工单概览</div>
      <table class="table">
        <thead>
          <tr>
            <th>工单号</th>
            <th>服务类型</th>
            <th>责任人</th>
            <th>处理时效</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id">
            <td>{{ ticket.id }}</td>
            <td>{{ ticket.type }}</td>
            <td>{{ ticket.owner }}</td>
            <td>{{ ticket.time }}</td>
            <td><span class="badge">{{ ticket.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="roleOpen" title="新增系统角色" :on-close="closeRole">
      <form class="modal-form" @submit.prevent="submitRole">
        <div>
          <label>角色名称</label>
          <input v-model="roleForm.name" type="text" placeholder="如：物流主管" required />
        </div>
        <div>
          <label>权限范围</label>
          <select v-model="roleForm.scope">
            <option>订单与物流</option>
            <option>营销与推广</option>
            <option>全域管理</option>
          </select>
        </div>
        <div>
          <label>备注</label>
          <input v-model="roleForm.note" type="text" placeholder="请输入备注" />
        </div>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeRole">取消</button>
        <button class="btn" @click="submitRole">保存</button>
      </template>
    </BaseModal>

    <BaseModal :open="serviceOpen" title="服务工单进度" :on-close="closeService">
      <p>正在派发系统升级服务工单。</p>
      <div class="progress" style="margin-top: 16px;">
        <span :style="{ width: '88%' }"></span>
      </div>
      <template #footer>
        <button class="btn" @click="closeService">完成</button>
      </template>
    </BaseModal>

    <BaseModal :open="noticeOpen" title="配置提示" :on-close="closeNotice">
      <p>建议每周检查角色权限与站点设备在线状态。</p>
      <p>关键数据建议开启自动备份。</p>
      <template #footer>
        <button class="btn" @click="closeNotice">知道了</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const configs = [
  { label: '运行版本', value: 'v2.4.1', tag: '稳定版' },
  { label: '在线用户', value: '128 人', tag: '高峰期' },
  { label: '安全巡检', value: '96%', tag: '已执行' },
  { label: '服务站点', value: '18 个', tag: '全量上线' }
];

const tickets = ref([
  { id: 'SV-2024-001', type: '冷链设备巡检', owner: '李晓', time: '2 小时内', status: '处理中' },
  { id: 'SV-2024-002', type: '站点网络保障', owner: '周蕾', time: '今日完成', status: '已派发' },
  { id: 'SV-2024-003', type: '订单系统升级', owner: '郑凯', time: '3 小时内', status: '处理中' },
  { id: 'SV-2024-004', type: '营销系统排查', owner: '张敏', time: '今日完成', status: '已派发' },
  { id: 'SV-2024-005', type: '客服培训', owner: '陈娜', time: '48 小时内', status: '等待中' },
  { id: 'SV-2024-006', type: '数据备份核查', owner: '刘峰', time: '今日完成', status: '已派发' },
  { id: 'SV-2024-007', type: '权限审计', owner: '王涛', time: '24 小时内', status: '处理中' },
  { id: 'SV-2024-008', type: '物流接口联调', owner: '孙丽', time: '今日完成', status: '处理中' },
  { id: 'SV-2024-009', type: '设备维护', owner: '赵云', time: '12 小时内', status: '已派发' },
  { id: 'SV-2024-010', type: '客户反馈处理', owner: '韩梅', time: '今日完成', status: '处理中' }
]);

const roleOpen = ref(false);
const serviceOpen = ref(false);
const noticeOpen = ref(false);

const roleForm = reactive({
  name: '',
  scope: '订单与物流',
  note: ''
});

const openRole = () => {
  roleOpen.value = true;
};
const closeRole = () => {
  roleOpen.value = false;
};
const submitRole = () => {
  tickets.value.unshift({
    id: `SV-2024-${String(tickets.value.length + 1).padStart(3, '0')}`,
    type: `角色配置: ${roleForm.name}`,
    owner: '系统管理员',
    time: '24 小时内',
    status: '已派发'
  });
  roleForm.name = '';
  roleForm.scope = '订单与物流';
  roleForm.note = '';
  roleOpen.value = false;
};

const openService = () => {
  serviceOpen.value = true;
};
const closeService = () => {
  serviceOpen.value = false;
};

const openNotice = () => {
  noticeOpen.value = true;
};
const closeNotice = () => {
  noticeOpen.value = false;
};
</script>
