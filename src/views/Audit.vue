<template>
  <div class="panel">
    <div class="toolbar">
      <button @click="openUserForm">新增角色权限</button>
      <button @click="openProgress">审计追踪进度</button>
      <button @click="openTip('今日检测到 1 次越权访问尝试，已自动阻断。')">安全告警</button>
    </div>

    <div class="card chart">
      <div v-for="i in perms" :key="i.name" class="bar-item">
        <span>{{ i.name }}</span>
        <div class="bar-bg"><div class="bar" :style="{width: i.val + '%'}"></div></div>
        <b>{{ i.val }}%</b>
      </div>
    </div>

    <div class="card table">
      <table>
        <thead><tr><th>日志ID</th><th>用户</th><th>动作</th><th>时间</th><th>结果</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>{{ r.id }}</td><td>{{ r.user }}</td><td>{{ r.action }}</td><td>{{ r.time }}</td><td>{{ r.result }}</td>
            <td><button class="small" @click="openTip(`${r.id} ${r.action}：${r.result}`)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :visible="modal.visible" :title="modal.title" @close="modal.visible=false" @confirm="modal.visible=false">
      <form v-if="modal.type==='form'" class="form-grid">
        <label>角色名称<input v-model="form.role" /></label>
        <label>访问范围<select v-model="form.scope"><option>只读</option><option>读写</option><option>管理员</option></select></label>
      </form>
      <div v-else-if="modal.type==='progress'">
        <p>审计日志归档处理中...</p>
        <div class="progress-bg"><div class="progress" style="width:58%"></div></div>
      </div>
      <p v-else>{{ modal.message }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const form = reactive({ role: '审计员', scope: '只读' });
const perms = [
  { name: '数据访问控制完整度', val: 96 },
  { name: '账号权限合规度', val: 86 },
  { name: '操作留痕覆盖率', val: 92 },
  { name: '高危行为拦截率', val: 77 },
];

const rows = Array.from({ length: 20 }, (_, i) => ({
  id: `LOG-${(1000 + i)}`,
  user: ['admin', 'checker', 'operator', 'auditor'][i % 4],
  action: ['登录', '导出报表', '修改权限', '查看日志'][i % 4],
  time: `2026-01-${((i % 28) + 1).toString().padStart(2, '0')} 10:${(10 + i).toString().padStart(2, '0')}`,
  result: i % 5 ? '成功' : '已拦截',
}));

const modal = reactive({ visible: false, type: 'tip', title: '', message: '' });
const openUserForm = () => Object.assign(modal, { visible: true, type: 'form', title: '角色权限配置' });
const openProgress = () => Object.assign(modal, { visible: true, type: 'progress', title: '进度状态' });
const openTip = (message) => Object.assign(modal, { visible: true, type: 'tip', title: '审计提示', message });
</script>

<style scoped>
@import './module.css';
</style>
