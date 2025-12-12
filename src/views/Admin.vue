<template>
  <div class="card">
    <div class="flex-between" style="flex-wrap: wrap; gap: 10px;">
      <h3 style="margin: 0;">权限管理与设置</h3>
      <div class="chip-row">
        <button @click="showRole = true">新增角色</button>
        <button style="background: var(--accent);" @click="showSync = true">同步策略</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>角色</th>
          <th>可见范围</th>
          <th>下载</th>
          <th>编辑</th>
          <th>审批</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="role in roles" :key="role.name">
          <td>{{ role.name }}</td>
          <td>{{ role.scope }}</td>
          <td>{{ role.download }}</td>
          <td>{{ role.edit }}</td>
          <td>{{ role.approval }}</td>
        </tr>
      </tbody>
    </table>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: 12px;">
      <div class="card" v-for="item in safety" :key="item.title">
        <div class="flex-between">
          <div>
            <div style="font-weight: 700;">{{ item.title }}</div>
            <p style="color: var(--muted);">{{ item.desc }}</p>
          </div>
          <button style="padding: 6px 10px;" @click="showTip = true">提示</button>
        </div>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showRole" title="新增角色">
    <div class="form-field">
      <label>角色名称</label>
      <input placeholder="如：外部审阅者" />
    </div>
    <div class="form-field">
      <label>权限模板</label>
      <select>
        <option>仅预览</option>
        <option>可下载</option>
        <option>可编辑</option>
      </select>
    </div>
    <div class="progress-track">
      <div class="progress-bar" style="width: 35%;"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showSync" title="同步策略">
    <p>正在同步到身份中心与访问控制列表。</p>
    <div class="progress-track">
      <div class="progress-bar" style="width: 75%;"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showTip" title="安全提示">
    <p>所有操作均以 modal 提示，避免误操作并提供即时反馈。</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const roles = [
  { name: '管理员', scope: '全局', download: '允许', edit: '允许', approval: '允许' },
  { name: '策展人', scope: '专题与展厅', download: '允许', edit: '允许', approval: '部分' },
  { name: '访客', scope: '公开作品', download: '禁止', edit: '禁止', approval: '禁止' },
  { name: '合作方', scope: '协作项目', download: '允许', edit: '部分', approval: '禁止' }
];

const safety = [
  { title: '水印防护', desc: '开启叠加水印，防止截屏外泄。' },
  { title: '敏感词审查', desc: '上传时自动检测违规内容。' },
  { title: '操作日志', desc: '完整记录下载、分享、评论行为。' }
];

const showRole = ref(false);
const showSync = ref(false);
const showTip = ref(false);
</script>
