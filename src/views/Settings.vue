<template>
  <div class="page">
    <div class="card">
      <div class="section-title">系统配置与管理概览</div>
      <div class="grid grid-3">
        <div class="card">
          <div class="section-title">用户管理</div>
          <p>在线用户：{{ summary.online }}</p>
          <p>用户总数：{{ summary.total }}</p>
        </div>
        <div class="card">
          <div class="section-title">权限控制</div>
          <p>角色数量：{{ summary.roles }}</p>
          <p>权限策略：{{ summary.policies }}</p>
        </div>
        <div class="card">
          <div class="section-title">系统维护</div>
          <p>运行时长：{{ summary.uptime }}</p>
          <p>维护窗口：{{ summary.window }}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">系统健康指标</div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: item.value + '%' }"
          :title="item.value + '%'"
        ></div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));">
        <div v-for="item in chartData" :key="item.label" class="chart-label">{{ item.label }}</div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">管理操作</div>
      <div class="actions">
        <button class="btn" type="button" @click="openModal('user')">新增用户</button>
        <button class="btn btn-secondary" type="button" @click="openModal('role')">配置权限</button>
        <button class="btn" type="button" @click="openModal('setting')">系统设置</button>
        <button class="btn btn-secondary" type="button" @click="openModal('maintenance')">维护计划</button>
        <button class="btn" type="button" @click="openModal('tip')">管理提示</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">用户列表（20条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>用户ID</th>
            <th>姓名</th>
            <th>角色</th>
            <th>部门</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.department }}</td>
            <td>{{ user.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'user'" class="form-grid">
        <label class="form-field">
          用户姓名
          <input v-model="form.username" type="text" placeholder="请输入姓名" />
        </label>
        <label class="form-field">
          所属角色
          <select v-model="form.userRole">
            <option>管理员</option>
            <option>分析师</option>
            <option>审计员</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'role'" class="form-grid">
        <label class="form-field">
          权限策略名称
          <input v-model="form.policy" type="text" placeholder="例如：全局运维" />
        </label>
        <label class="form-field">
          访问级别
          <select v-model="form.level">
            <option>高级</option>
            <option>中级</option>
            <option>基础</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'setting'" class="form-grid">
        <label class="form-field">
          系统名称
          <input v-model="form.systemName" type="text" placeholder="智链信息服务与管理系统" />
        </label>
        <label class="form-field">
          日志级别
          <select v-model="form.logLevel">
            <option>INFO</option>
            <option>WARN</option>
            <option>ERROR</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'maintenance'">
        <p>下一次维护窗口：{{ summary.window }}</p>
        <div class="progress" style="margin-top: 12px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
      <div v-else>
        <p>提示：建议每月检查权限策略与账号状态。</p>
      </div>
      <template #actions>
        <button class="btn btn-secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="button" @click="submitModal">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const summary = reactive({
  online: 32,
  total: 128,
  roles: 6,
  policies: 14,
  uptime: "34天",
  window: "每周日 02:00"
});

const chartData = [
  { label: "CPU", value: 70 },
  { label: "内存", value: 64 },
  { label: "存储", value: 55 },
  { label: "网络", value: 82 },
  { label: "服务", value: 76 }
];

const users = Array.from({ length: 20 }, (_, index) => ({
  id: `USR-${String(index + 1).padStart(3, "0")}`,
  name: ["何敏", "田浩", "姜琪", "许彤"][index % 4],
  role: ["管理员", "分析师", "审计员"][index % 3],
  department: index % 2 === 0 ? "数据中心" : "安全运营",
  status: index % 3 === 0 ? "启用" : "审核中"
}));

const modal = reactive({
  open: false,
  type: "",
  title: ""
});

const progress = ref(43);

const form = reactive({
  username: "",
  userRole: "管理员",
  policy: "",
  level: "高级",
  systemName: "",
  logLevel: "INFO"
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  modal.title =
    type === "user"
      ? "新增用户"
      : type === "role"
      ? "配置权限"
      : type === "setting"
      ? "系统设置"
      : type === "maintenance"
      ? "维护计划"
      : "管理提示";
};

const closeModal = () => {
  modal.open = false;
};

const submitModal = () => {
  progress.value = Math.min(100, progress.value + 12);
  closeModal();
};
</script>
