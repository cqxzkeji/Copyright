<template>
  <div class="card">
    <div class="flex-between" style="gap: 12px; flex-wrap: wrap;">
      <h3 style="margin: 0;">作品共享与管理</h3>
      <div class="chip-row">
        <button @click="showNewShare = true">新增共享</button>
        <button style="background: var(--accent);" @click="showReminder = true">批量提醒</button>
        <button style="background: #3ac48b;" @click="showLog = true">下载日志</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>作品</th>
          <th>共享对象</th>
          <th>权限</th>
          <th>到期</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in shares" :key="row.title + row.target">
          <td>{{ row.title }}</td>
          <td>{{ row.target }}</td>
          <td>{{ row.permission }}</td>
          <td>{{ row.expire }}</td>
          <td><span class="tag">{{ row.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showNewShare" title="新增共享">
    <div class="form-field">
      <label>作品</label>
      <select>
        <option v-for="row in shares" :key="row.title">{{ row.title }}</option>
      </select>
    </div>
    <div class="form-field">
      <label>共享对象</label>
      <input placeholder="输入邮箱或团队" />
    </div>
    <div class="form-field">
      <label>权限</label>
      <select>
        <option>仅预览</option>
        <option>可下载</option>
        <option>可编辑</option>
      </select>
    </div>
    <div class="progress-track" style="margin-top: 10px;">
      <div class="progress-bar" style="width: 60%;"></div>
    </div>
    <p style="color: var(--muted);">提交后将自动发送邀请，弹窗需手动关闭。</p>
  </ModalDialog>

  <ModalDialog v-model="showReminder" title="批量提醒发送中">
    <p style="color: var(--muted);">正在为所有即将到期的共享关系发送提醒邮件。</p>
    <div class="progress-track">
      <div class="progress-bar" style="width: 80%;"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showLog" title="导出访问日志">
    <p>包含近期操作记录与下载行为，点击确认即可生成 CSV。</p>
    <ul>
      <li>近 7 天访问：326</li>
      <li>下载次数：58</li>
      <li>外部访问：22</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const shares = [
  { title: '晨光云阶', target: '策展组', permission: '可下载', expire: '6 天后', status: '活跃' },
  { title: '荧火之森', target: '客户 A', permission: '仅预览', expire: '3 天后', status: '提醒中' },
  { title: '海上霓虹', target: '媒体库', permission: '可下载', expire: '12 天后', status: '活跃' },
  { title: '流光之翼', target: '技术评审', permission: '可编辑', expire: '1 天后', status: '即将到期' },
  { title: '浮岛花园', target: '合作方', permission: '仅预览', expire: '9 天后', status: '活跃' }
];

const showNewShare = ref(false);
const showReminder = ref(false);
const showLog = ref(false);
</script>
