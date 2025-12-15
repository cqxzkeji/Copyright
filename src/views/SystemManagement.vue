<template>
  <div class="container">
    <div class="flex-between">
      <div>
        <h2>系统管理</h2>
        <p class="muted">账号、审计、资源与安全策略统一维护</p>
      </div>
      <button class="secondary" @click="showOps = true">执行维护</button>
    </div>

    <div class="grid two" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); margin-top: 16px;">
      <div class="card">
        <div class="flex-between">
          <h3>用户与角色</h3>
          <button class="ghost" @click="showUser = true">新增账号</button>
        </div>
        <ul>
          <li class="muted">管理员 · 全量模块访问</li>
          <li class="muted">运维 · 采集与系统管理</li>
          <li class="muted">分析师 · 预处理、融合、可视化</li>
        </ul>
      </div>
      <div class="card">
        <div class="flex-between">
          <h3>系统审计</h3>
          <button class="ghost" @click="showAudit = true">审计详情</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>时间</th>
              <th>操作</th>
              <th>用户</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in audits" :key="item.time">
              <td>{{ item.time }}</td>
              <td>{{ item.action }}</td>
              <td>{{ item.user }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showUser" class="modal-overlay" @click.self="showUser = false">
      <div class="modal">
        <div class="modal-header">
          <h3>新增账号</h3>
          <button class="ghost" @click="showUser = false">关闭</button>
        </div>
        <form class="grid" style="gap: 10px;">
          <div>
            <label>用户名</label>
            <input placeholder="输入用户名" />
          </div>
          <div>
            <label>角色</label>
            <select>
              <option>管理员</option>
              <option>运维</option>
              <option>分析师</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="ghost" @click.prevent="showUser = false">取消</button>
            <button @click.prevent="showUser = false">创建</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showOps" class="modal-overlay" @click.self="showOps = false">
      <div class="modal">
        <div class="modal-header">
          <h3>系统维护</h3>
          <button class="ghost" @click="showOps = false">关闭</button>
        </div>
        <p>执行缓存清理、日志归档与节点扩容。</p>
        <div class="progress">
          <div class="progress-bar" style="width: 35%; background: var(--primary);"></div>
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="showOps = false">稍后</button>
          <button @click="showOps = false">立即完成</button>
        </div>
      </div>
    </div>

    <div v-if="showAudit" class="modal-overlay" @click.self="showAudit = false">
      <div class="modal">
        <div class="modal-header">
          <h3>审计详情</h3>
          <button class="ghost" @click="showAudit = false">关闭</button>
        </div>
        <ul>
          <li v-for="item in audits" :key="item.time" class="muted">{{ item.time }} - {{ item.action }}（{{ item.user }}）</li>
        </ul>
        <div class="modal-actions">
          <button @click="showAudit = false">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const audits = [
  { time: '10:10', action: '更新融合规则', user: 'admin' },
  { time: '10:18', action: '新增采集源', user: 'ops' },
  { time: '10:26', action: '导出可视化报表', user: 'analyst' },
  { time: '10:35', action: '清理缓存', user: 'ops' }
];

const showUser = ref(false);
const showOps = ref(false);
const showAudit = ref(false);
</script>

<style scoped>
.muted { color: var(--muted); }
</style>
