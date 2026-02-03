<template>
  <section class="grid-2">
    <div class="card">
      <div class="section-title">权限管理概览</div>
      <div class="grid-2">
        <div>
          <p>系统用户</p>
          <strong>46 人</strong>
        </div>
        <div>
          <p>角色数量</p>
          <strong>5 类</strong>
        </div>
        <div>
          <p>今日登录</p>
          <strong>18 人</strong>
        </div>
        <div>
          <p>审计告警</p>
          <strong>2 条</strong>
        </div>
      </div>
      <div class="button-row">
        <button class="btn" @click="openModal('role')">新增角色</button>
        <button class="btn secondary" @click="openModal('grant')">配置权限</button>
        <button class="btn secondary" @click="openModal('audit')">查看审计日志</button>
        <button class="btn secondary" @click="openModal('progress')">权限同步进度</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">角色使用分布</div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: `${item.value}%` }"
        ></div>
      </div>
      <p style="margin-top: 12px; color: #607088">运维类角色使用率最高，审计任务集中。</p>
    </div>
  </section>

  <section class="card" style="margin-top: 18px;">
    <div class="section-title">用户权限列表</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>用户</th>
          <th>角色</th>
          <th>部门</th>
          <th>最近登录</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.role }}</td>
          <td>{{ item.department }}</td>
          <td>{{ item.lastLogin }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal :show="modal.type === 'role'" title="新增角色" @close="closeModal">
    <div class="form-grid">
      <div>
        <label>角色名称</label>
        <input v-model="roleForm.name" placeholder="输入角色名称" />
      </div>
      <div>
        <label>角色类型</label>
        <select v-model="roleForm.type">
          <option>系统管理</option>
          <option>值班运行</option>
          <option>维保管理</option>
        </select>
      </div>
      <div>
        <label>描述</label>
        <textarea v-model="roleForm.note" rows="3" placeholder="填写角色职责"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn secondary" @click="closeModal">取消</button>
      <button class="btn" @click="submitRole">确认新增</button>
    </template>
  </BaseModal>

  <BaseModal :show="modal.type === 'grant'" title="配置权限" @close="closeModal">
    <div class="form-grid">
      <div>
        <label>选择角色</label>
        <select v-model="grantForm.role">
          <option>系统管理员</option>
          <option>维保主管</option>
          <option>值班员</option>
          <option>审计员</option>
        </select>
      </div>
      <div>
        <label>权限范围</label>
        <select v-model="grantForm.scope">
          <option>设备运行监控</option>
          <option>故障与报警管理</option>
          <option>维护保养管理</option>
          <option>历史数据分析</option>
          <option>全部权限</option>
        </select>
      </div>
      <div>
        <label>有效期</label>
        <input v-model="grantForm.expire" type="date" />
      </div>
    </div>
    <template #footer>
      <button class="btn secondary" @click="closeModal">取消</button>
      <button class="btn" @click="submitGrant">确认配置</button>
    </template>
  </BaseModal>

  <BaseModal :show="modal.type === 'audit'" title="操作审计日志" @close="closeModal">
    <ul style="line-height: 1.8; color: #51647a; padding-left: 18px;">
      <li>09:32 张磊 修改了消防泵报警规则。</li>
      <li>10:05 王琳 导出了历史运行报表。</li>
      <li>10:50 陈倩 新增角色：巡检值班员。</li>
      <li>11:20 刘洋 调整了设备维护计划。</li>
    </ul>
  </BaseModal>

  <BaseModal :show="modal.type === 'progress'" title="权限同步进度" @close="closeModal">
    <p>权限同步正在进行。</p>
    <div style="margin-top: 16px;">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <p style="margin-top: 8px;">完成度 {{ progress }}%</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, onUnmounted } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: ['张磊', '王琳', '陈倩', '刘洋', '孙勇'][index % 5],
  role: ['系统管理员', '维保主管', '值班员', '审计员', '访客'][index % 5],
  department: ['安防部', '运行部', '设备部'][index % 3],
  lastLogin: `2024-05-${String((index % 28) + 1).padStart(2, '0')} 09:${String(index % 60).padStart(2, '0')}`,
  status: index % 4 === 0 ? '停用' : '正常'
}));

const chartData = [
  { label: '系统管理员', value: 80 },
  { label: '维保主管', value: 65 },
  { label: '值班员', value: 75 },
  { label: '审计员', value: 50 },
  { label: '访客', value: 30 }
];

const modal = reactive({ type: '' });
const progress = ref(0);
let timer;

const roleForm = reactive({
  name: '',
  type: '系统管理',
  note: ''
});

const grantForm = reactive({
  role: '系统管理员',
  scope: '全部权限',
  expire: ''
});

const openModal = (type) => {
  modal.type = type;
  if (type === 'progress') {
    progress.value = 18;
    timer = setInterval(() => {
      progress.value = Math.min(100, progress.value + 12);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 400);
  }
};

const closeModal = () => {
  modal.type = '';
  if (timer) {
    clearInterval(timer);
  }
};

const submitRole = () => {
  modal.type = 'audit';
};

const submitGrant = () => {
  modal.type = 'audit';
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
