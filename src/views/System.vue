<template>
  <div class="container">
    <section class="hero">
      <div class="flex-between">
        <div>
          <h2 style="margin: 0;">系统管理与权限</h2>
          <p>配置用户角色、菜单权限与操作审计。</p>
        </div>
        <div class="action-bar">
          <button class="btn primary" @click="showUser = true">新增用户</button>
          <button class="btn" @click="showRole = true">配置角色</button>
          <button class="btn ghost" @click="showAudit = true">查看审计</button>
        </div>
      </div>
    </section>

    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">用户与角色</h3>
        <span class="badge info dot">RBAC 已启用</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>用户</th>
            <th>角色</th>
            <th>状态</th>
            <th>最近操作</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td><span :class="['badge', user.active ? 'success' : 'warning']">{{ user.active ? '启用' : '停用' }}</span></td>
            <td>{{ user.recent }}</td>
            <td>
              <div class="action-bar">
                <button class="btn primary" @click="openPerm(user)">权限</button>
                <button class="btn" @click="showReset = true">重置密码</button>
                <button class="btn ghost" @click="showNotify = true">通知</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid-2">
      <div class="card stat-card">
        <h3 class="section-title">安全策略</h3>
        <ul class="list">
          <li><span>两步验证</span><span class="badge success">已开启</span></li>
          <li><span>登录 IP 白名单</span><span class="badge info">8 条</span></li>
          <li><span>权限变更审批</span><span class="badge warning">待审批 2 条</span></li>
        </ul>
      </div>
      <div class="card stat-card">
        <h3 class="section-title">审计摘要</h3>
        <ul class="list">
          <li><span>最近 24h 变更</span><span class="badge info">18 条</span></li>
          <li><span>高危操作</span><span class="badge danger">1 条</span></li>
          <li><span>导出记录</span><span class="badge info">5 次</span></li>
        </ul>
      </div>
    </div>

    <ModalDialog v-model="showUser" title="新增用户" @confirm="showUser = false">
      <div class="form-grid">
        <label><div class="label">姓名</div><input class="input" placeholder="姓名" /></label>
        <label><div class="label">角色</div><select class="input"><option>管理员</option><option>运营</option><option>仓库</option></select></label>
        <label><div class="label">手机号</div><input class="input" placeholder="手机号" /></label>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showRole" title="配置角色" @confirm="showRole = false">
      <p>为“品类运营”分配商品与订单的读写权限。</p>
      <div class="progress-bar"><div class="fill" style="width: 50%"></div></div>
    </ModalDialog>

    <ModalDialog v-model="showAudit" title="操作审计" @confirm="showAudit = false">
      <ul class="list">
        <li><span>张运营 新增商品</span><span class="badge info dot">09:12</span></li>
        <li><span>仓储主管 调整库存</span><span class="badge info dot">09:05</span></li>
        <li><span>客服主管 导出订单</span><span class="badge info dot">08:55</span></li>
      </ul>
    </ModalDialog>

    <ModalDialog v-model="showPerm" title="权限配置" @confirm="showPerm = false">
      <p>为 {{ current?.name }} 配置菜单权限：商品、订单、库存模块。</p>
      <div class="form-grid">
        <label><div class="label">读写</div><select class="input"><option>读写</option><option>只读</option></select></label>
        <label><div class="label">模块</div><input class="input" value="商品/订单/库存" readonly /></label>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showReset" title="重置密码" @confirm="showReset = false">
      <p>确认后将向用户发送短信重置链接。</p>
    </ModalDialog>

    <ModalDialog v-model="showNotify" title="消息通知" @confirm="showNotify = false">
      <p>已向 {{ current?.name || '用户' }} 发送登录提醒与安全月报。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const users = [
  { name: '张运营', role: '管理员', active: true, recent: '上架新品' },
  { name: '李采购', role: '供应链', active: true, recent: '提交采购单' },
  { name: '王客服', role: '客服主管', active: true, recent: '处理售后' },
  { name: '陈仓库', role: '仓库主管', active: false, recent: '盘点库存' },
  { name: '周风控', role: '风控', active: true, recent: '标记高风险订单' }
];

const showUser = ref(false);
const showRole = ref(false);
const showAudit = ref(false);
const showPerm = ref(false);
const showReset = ref(false);
const showNotify = ref(false);
const current = ref(null);

const openPerm = (user) => {
  current.value = user;
  showPerm.value = true;
};
</script>
