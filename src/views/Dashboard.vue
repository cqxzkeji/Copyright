<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <h2>安全管理菜单</h2>
      <div class="nav-list">
        <router-link class="nav-item" to="/dashboard/training">培训管理</router-link>
        <router-link class="nav-item" to="/dashboard/drill">应急演练</router-link>
        <router-link class="nav-item" to="/dashboard/knowledge">消防知识库</router-link>
        <router-link class="nav-item" to="/dashboard/inspection">隐患排查</router-link>
        <router-link class="nav-item" to="/dashboard/reports">报告统计</router-link>
      </div>
    </aside>
    <div>
      <div class="topbar">
        <div>
          <strong>消防安全培训与应急演练管理系统</strong>
        </div>
        <div class="user">
          <span class="tag">今日演练 3 场</span>
          <span>欢迎，李安全</span>
          <button class="btn" @click="showNotice = true">消息中心</button>
        </div>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
  <BaseModal v-model="showNotice" title="今日提醒">
    <div class="card">
      <p>09:00 消防疏散演练确认参与人员。</p>
      <p>14:00 培训课程《初期火灾处置》需要签到。</p>
      <p>本周隐患整改完成率 82%，建议加快跟踪。</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showNotice = ref(false);
</script>
