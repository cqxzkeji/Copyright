<template>
  <div class="layout">
    <div class="sidebar">
      <div style="font-weight:800; font-size:18px; display:flex; gap:8px; align-items:center;">
        <span style="width:12px; height:12px; background:var(--primary); border-radius:50%; display:inline-block;"></span>
        双码现场数据
      </div>
      <router-link
        v-for="item in menus"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: $route.path === item.path }"
      >
        <span>{{ item.label }}</span>
      </router-link>
      <button class="secondary" @click="openHelp = true">系统提示</button>
    </div>
    <div class="main-area">
      <div class="topbar">
        <div>
          <div class="badge">工程现场 · 精细化</div>
          <h3 style="margin:6px 0 0;">主控台</h3>
        </div>
        <div class="actions">
          <button class="secondary" @click="openNotice = true">公告</button>
          <button @click="logout">退出</button>
        </div>
      </div>
      <router-view />
    </div>
  </div>
  <ModalDialog v-model="openNotice">
    <template #title>作业提醒</template>
    <p>请确保RFID与二维码同步入库，现场采集需绑定班组责任人。</p>
    <div class="actions" style="justify-content:flex-end; margin-top:10px;">
      <button class="secondary" @click="openNotice=false">知道了</button>
    </div>
  </ModalDialog>
  <ModalDialog v-model="openHelp">
    <template #title>操作指引</template>
    <ul style="padding-left:18px; color:var(--muted);">
      <li>左侧选择模块，右侧为内容窗口。</li>
      <li>模块界面按钮均为可操作，含表单、进度与提示。</li>
      <li>保持网络连接以保障数据同步。</li>
    </ul>
    <div class="actions" style="justify-content:flex-end; margin-top:10px;">
      <button @click="openHelp=false">完成</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const openNotice = ref(false)
const openHelp = ref(false)

const menus = [
  { path: '/dashboard/code', label: '双码标识管理' },
  { path: '/dashboard/collect', label: '现场数据采集' },
  { path: '/dashboard/analysis', label: '数据统计分析' },
  { path: '/dashboard/system', label: '系统管理追溯' },
]

const logout = () => {
  router.push('/login')
}
</script>
