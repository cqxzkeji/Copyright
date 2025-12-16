<template>
  <section>
    <div class="topbar" style="padding: 14px 16px;">
      <div class="title">系统管理与权限配置</div>
      <div class="actions">
        <button class="btn" @click="showUser = true">创建用户</button>
        <button class="btn primary" @click="showReset = true">重置密码</button>
        <button class="btn" @click="showPolicy = true">权限策略提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>角色概览</h3>
        <div class="tag-grid">
          <div class="tag" v-for="role in roles" :key="role">{{ role }}</div>
        </div>
        <p class="hint">角色划分覆盖管理员、运营、分析师与审计等关键岗位。</p>
      </div>
      <div class="card">
        <h3>访问审计概览</h3>
        <div class="small-chart">
          <span v-for="item in auditBars" :key="item" :style="{ height: `${item}px` }"></span>
        </div>
        <p class="hint">近 12 日访问记录保持正常，未发现异常登录。</p>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>用户与权限</h3>
        <button class="btn primary" @click="showUser = true">新增账号</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>部门</th>
            <th>角色</th>
            <th>最近登录</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name">
            <td>{{ user.name }}</td>
            <td>{{ user.team }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.last }}</td>
            <td><span class="badge">{{ user.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="showUser" title="创建用户" @confirm="showUser = false">
      <div class="form-grid">
        <label>
          姓名
          <input placeholder="输入姓名" />
        </label>
        <label>
          邮箱
          <input type="email" placeholder="example@corp.com" />
        </label>
        <label>
          角色
          <select>
            <option>管理员</option>
            <option>韧性分析师</option>
            <option>运维专员</option>
            <option>审计</option>
          </select>
        </label>
      </div>
    </BaseModal>

    <BaseModal v-model="showReset" title="密码重置" @confirm="runReset">
      <p>确认后将向选定用户发送密码重置邮件并记录操作日志。</p>
      <div class="progress">
        <div class="bar" :style="{ width: `${resetProgress}%` }"></div>
      </div>
      <p style="text-align: right; margin: 6px 0 0;">当前进度：{{ resetProgress }}%</p>
    </BaseModal>

    <BaseModal v-model="showPolicy" title="权限策略提示" @confirm="showPolicy = false">
      <p>建议遵循最小权限原则，定期审计高危操作。</p>
      <ul>
        <li>管理员操作需双人复核，敏感操作记录审计日志。</li>
        <li>分析师仅可访问数据分析与导出权限，禁止变更配置。</li>
        <li>外部合作账号设置有效期，超期自动禁用。</li>
      </ul>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showUser = ref(false);
const showReset = ref(false);
const showPolicy = ref(false);
const resetProgress = ref(50);

const roles = reactive(['管理员', '韧性分析师', '运营经理', '仓储主管', '供应链专家', '审计']);
const auditBars = reactive([32, 28, 30, 34, 33, 29, 31, 26, 24, 22, 25, 27]);

const users = reactive([
  { name: '刘洋', team: '供应链', role: '管理员', last: '今天 09:20', status: '启用' },
  { name: '王娜', team: '运营', role: '韧性分析师', last: '今天 09:10', status: '启用' },
  { name: '陈宇', team: 'IT', role: '运维专员', last: '今天 08:55', status: '启用' },
  { name: '赵鑫', team: '仓储', role: '运营经理', last: '今天 08:48', status: '启用' },
  { name: '孙丽', team: '质检', role: '韧性分析师', last: '今天 08:40', status: '启用' },
  { name: '周鹏', team: '采购', role: '审计', last: '昨天 18:10', status: '启用' },
  { name: '张琦', team: '物流', role: '运维专员', last: '昨天 17:35', status: '启用' },
  { name: '李敏', team: '需求', role: '运营经理', last: '昨天 17:00', status: '启用' },
  { name: '郭强', team: '财务', role: '审计', last: '昨天 16:25', status: '启用' },
  { name: '何静', team: '售后', role: '韧性分析师', last: '昨天 15:40', status: '启用' }
]);

const runReset = () => {
  resetProgress.value = 0;
  const timer = setInterval(() => {
    resetProgress.value += 20;
    if (resetProgress.value >= 100) {
      resetProgress.value = 100;
      clearInterval(timer);
    }
  }, 220);
};
</script>
