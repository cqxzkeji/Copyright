<template>
  <div class="grid" style="gap: 14px;">
    <div class="card">
      <div class="section-header">
        <div>
          <p class="eyebrow">系统安全与权限管理</p>
          <h3>账号与操作审计</h3>
        </div>
        <div class="action-row">
          <button class="btn secondary" @click="toggleUser">新增账号</button>
          <button class="btn" @click="toggleProgress">同步策略</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>账号</th>
            <th>角色</th>
            <th>状态</th>
            <th>最近登陆</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name" style="cursor:pointer;" @click="selectUser(user)">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td><span class="badge" :class="user.class">{{ user.status }}</span></td>
            <td>{{ user.lastLogin }}</td>
            <td><button class="btn secondary" @click.stop="selectUser(user)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-header">
        <h3>操作审计日志</h3>
        <button class="btn secondary" @click="toggleLog">筛选日志</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>事件</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.time">
            <td>{{ log.time }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.result }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showUser" class="modal-backdrop" @click.self="showUser = false">
      <div class="modal">
        <h3>新增账号</h3>
        <div class="form-row">
          <label>用户名</label>
          <input placeholder="如 ops-admin" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>角色</label>
          <select>
            <option>安全管理员</option>
            <option>维修主管</option>
            <option>巡检组长</option>
          </select>
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>临时密码</label>
          <input type="password" />
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:12px;">
          <button class="btn secondary" @click="showUser = false">取消</button>
          <button class="btn success" @click="confirmUser">创建</button>
        </div>
      </div>
    </div>

    <div v-if="showDetail" class="modal-backdrop" @click.self="showDetail = false">
      <div class="modal">
        <h3>{{ active.name }} 账号详情</h3>
        <p class="muted">角色 {{ active.role }}，状态 {{ active.status }}，最近登录 {{ active.lastLogin }}。</p>
        <div class="progress-bar" style="margin:10px 0;">
          <span :style="{ width: active.risk + '%' }"></span>
        </div>
        <p>风险评分 {{ active.risk }}%</p>
        <div style="text-align:right;">
          <button class="btn secondary" @click="showDetail = false">关闭</button>
          <button class="btn danger" @click="lockUser">锁定账号</button>
        </div>
      </div>
    </div>

    <div v-if="showLog" class="modal-backdrop" @click.self="showLog = false">
      <div class="modal">
        <h3>筛选日志</h3>
        <div class="form-row">
          <label>关键字</label>
          <input placeholder="如 登陆、删除" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>结果</label>
          <select>
            <option>全部</option>
            <option>成功</option>
            <option>失败</option>
          </select>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
          <button class="btn secondary" @click="showLog = false">取消</button>
          <button class="btn" @click="confirmLog">筛选</button>
        </div>
      </div>
    </div>

    <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
      <div class="modal">
        <h3>策略同步</h3>
        <div class="progress-bar" style="margin: 10px 0;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <p>同步进度 {{ progress }}%</p>
        <div style="text-align:right;">
          <button class="btn" @click="showProgress = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const users = reactive([
  { name: 'ops-admin', role: '安全管理员', status: '启用', class: 'success', lastLogin: '09:12', risk: 18 },
  { name: 'maint-lead', role: '维修主管', status: '启用', class: 'success', lastLogin: '08:55', risk: 22 },
  { name: 'inspect-chief', role: '巡检组长', status: '启用', class: 'success', lastLogin: '昨日', risk: 24 },
  { name: 'night-guard', role: '夜班员', status: '锁定', class: 'danger', lastLogin: '3 天前', risk: 68 },
  { name: 'auditor', role: '审计员', status: '启用', class: 'success', lastLogin: '周一', risk: 16 }
]);

const logs = reactive([
  { time: '09:10', user: 'ops-admin', action: '新增账号 maint-01', result: '成功' },
  { time: '09:05', user: 'auditor', action: '导出巡检报表', result: '成功' },
  { time: '08:58', user: 'night-guard', action: '尝试登陆失败', result: '失败' },
  { time: '08:50', user: 'maint-lead', action: '修改巡检计划', result: '成功' },
  { time: '08:35', user: 'ops-admin', action: '下发安全策略', result: '成功' }
]);

const showUser = ref(false);
const showDetail = ref(false);
const showLog = ref(false);
const showProgress = ref(false);
const progress = ref(35);
const active = ref({});

function toggleUser() { showUser.value = true; }
function toggleProgress() {
  showProgress.value = true;
  progress.value = (progress.value + 30) % 100;
}

function confirmUser() {
  alert('账号已创建并发送初始密码');
  showUser.value = false;
}

function lockUser() {
  alert('账号已锁定并通知管理员');
  showDetail.value = false;
}

function selectUser(user) {
  active.value = user;
  showDetail.value = true;
}

function toggleLog() { showLog.value = true; }
function confirmLog() {
  alert('已应用日志筛选');
  showLog.value = false;
}
</script>

<style scoped>
.section-header { display:flex; justify-content: space-between; align-items:center; gap: 10px; flex-wrap: wrap; }
.action-row { display:flex; gap: 10px; flex-wrap: wrap; }
</style>
