<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h3 class="section-title">用户与权限管理</h3>
        <p style="color: var(--muted);">管理平台账号、角色、权限策略</p>
      </div>
      <div class="chip-row">
        <button class="btn" @click="modals.create=true">创建用户</button>
        <button class="btn secondary" @click="modals.reset=true">重置密码</button>
        <button class="btn light" @click="modals.sync=true">同步权限</button>
      </div>
    </div>

    <div class="summary-grid" style="margin-top: 12px;">
      <div class="summary-card" v-for="item in roles" :key="item.title">
        <h4>{{ item.title }}</h4>
        <div class="flex-between">
          <strong>{{ item.count }}</strong>
          <span class="status" :class="item.level">{{ item.state }}</span>
        </div>
        <p style="margin: 6px 0 0; color: var(--muted);">{{ item.desc }}</p>
      </div>
    </div>

    <div class="card" style="margin-top: 16px;">
      <div class="flex-between">
        <p class="section-title">用户列表</p>
        <span class="badge">10+ 人员</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>账号</th>
            <th>姓名</th>
            <th>角色</th>
            <th>负责区域</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.username">
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.area }}</td>
            <td><span class="status" :class="user.level">{{ user.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid" style="margin-top: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card" v-for="policy in policies" :key="policy.title" style="padding: 12px;">
        <div class="flex-between">
          <div>
            <h4 style="margin: 0;">{{ policy.title }}</h4>
            <p style="margin: 4px 0 0; color: var(--muted);">{{ policy.desc }}</p>
          </div>
          <span class="tag">{{ policy.scope }}</span>
        </div>
        <p style="margin: 10px 0 4px; font-weight: 700;">执行度</p>
        <div class="progress"><span :style="{ width: policy.progress }"></span></div>
      </div>
    </div>
  </div>

  <ModalDialog :visible="modals.create" title="创建用户" helper="填写账号信息" @close="modals.create=false" @confirm="modals.create=false">
    <div class="form-grid">
      <div class="form-group">
        <label>账号</label>
        <input placeholder="dispatcher01" />
      </div>
      <div class="form-group">
        <label>姓名</label>
        <input placeholder="王小明" />
      </div>
      <div class="form-group">
        <label>角色</label>
        <select>
          <option>管理员</option>
          <option>调度员</option>
          <option>监控员</option>
        </select>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog :visible="modals.reset" title="重置密码" helper="发送重置链接" @close="modals.reset=false" @confirm="modals.reset=false">
    <p>将通过短信与邮件同步密码重置链接。</p>
    <div class="progress" style="margin-top: 8px;"><span style="width: 49%"></span></div>
  </ModalDialog>

  <ModalDialog :visible="modals.sync" title="同步权限" helper="应用到全部模块" @close="modals.sync=false" @confirm="modals.sync=false">
    <p>将最新的角色策略同步到监控、调度、分析、设备等模块。</p>
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const modals = reactive({ create: false, reset: false, sync: false });

const roles = [
  { title: '管理员', count: '6 人', state: '安全', desc: '拥有全局管理权限', level: 'safe' },
  { title: '调度员', count: '18 人', state: '高效', desc: '可操作调度与监控', level: 'safe' },
  { title: '监控员', count: '12 人', state: '稳定', desc: '查看监控与告警', level: 'safe' }
];

const users = [
  { username: 'admin', name: '张伟', role: '管理员', area: '全国', status: '正常', level: 'safe' },
  { username: 'scheduler01', name: '李雷', role: '调度员', area: '华南', status: '正常', level: 'safe' },
  { username: 'scheduler02', name: '韩梅', role: '调度员', area: '华东', status: '正常', level: 'safe' },
  { username: 'monitor01', name: '周洋', role: '监控员', area: '华东', status: '正常', level: 'safe' },
  { username: 'monitor02', name: '陈芳', role: '监控员', area: '华中', status: '正常', level: 'safe' },
  { username: 'monitor03', name: '赵亮', role: '监控员', area: '华南', status: '正常', level: 'safe' },
  { username: 'quality01', name: '孙琪', role: '管理员', area: '安全合规', status: '正常', level: 'safe' },
  { username: 'ops01', name: '刘晨', role: '管理员', area: '运维', status: '正常', level: 'safe' },
  { username: 'ops02', name: '吴刚', role: '管理员', area: '运维', status: '正常', level: 'safe' },
  { username: 'dispatch03', name: '蒋宁', role: '调度员', area: '西南', status: '正常', level: 'safe' },
  { username: 'dispatch04', name: '魏莹', role: '调度员', area: '华北', status: '正常', level: 'safe' }
];

const policies = [
  { title: '温控数据只读', desc: '保障监控数据不被篡改', scope: '监控', progress: '88%' },
  { title: '调度发布审批', desc: '发布任务需双人复核', scope: '调度', progress: '72%' },
  { title: '设备远程控制', desc: '限定管理员操作', scope: '设备', progress: '66%' }
];
</script>
