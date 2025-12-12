<template>
  <div class="layout">
    <nav class="nav-container">
      <div class="section-title">
        <h2>智能工作台</h2>
        <span class="badge">亮色主题</span>
      </div>
      <div class="toolbar" style="margin: 12px 0">
        <button @click="showProfile = true">账号</button>
        <button @click="showNotifications = true">消息</button>
      </div>
      <router-link class="nav-link" active-class="active" to="/main/content">内容生成</router-link>
      <router-link class="nav-link" active-class="active" to="/main/analysis">数据分析</router-link>
      <router-link class="nav-link" active-class="active" to="/main/training">模型训练</router-link>
      <router-link class="nav-link" active-class="active" to="/main/ui">交互式UI</router-link>
      <router-link class="nav-link" active-class="active" to="/main/management">管理后台</router-link>
    </nav>
    <main>
      <router-view />
    </main>
    <ModalDialog :open="showProfile" title="账号信息" :on-close="() => (showProfile = false)">
      <p>当前为演示账号，拥有全部模块的浏览权限。</p>
      <div class="modal-actions">
        <button @click="showProfile = false">关闭</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showNotifications" title="通知" :on-close="() => (showNotifications = false)">
      <p>最新系统公告：已启用全局GPU加速和敏感词检测。</p>
      <div class="modal-actions">
        <button @click="showNotifications = false">好的</button>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const showProfile = ref(false)
const showNotifications = ref(false)
</script>
