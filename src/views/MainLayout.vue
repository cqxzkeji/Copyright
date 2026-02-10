<template>
  <div class="layout">
    <aside class="sidebar">
      <h3>学业规划系统</h3>
      <nav>
        <RouterLink v-for="item in menus" :key="item.path" :to="item.path" class="menu" active-class="active">{{ item.label }}</RouterLink>
      </nav>
      <button class="btn secondary" @click="showHelp = true">按钮提示</button>
      <button class="btn" style="margin-top:10px" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <router-view />
    </main>
    <BaseModal v-model="showHelp" title="按钮说明">
      <ul>
        <li>新增、编辑按钮会打开表单弹窗，提交后更新列表。</li>
        <li>进度相关按钮会显示动态进度条弹窗。</li>
        <li>推荐和分析按钮会展示策略建议与可视化分析结果。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import BaseModal from '../components/BaseModal.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showHelp = ref(false)
const menus = [
  { label: '数据采集与处理', path: '/dashboard/data-collection' },
  { label: '学业规划生成', path: '/dashboard/academic-planning' },
  { label: '学业进度跟踪', path: '/dashboard/progress-tracking' },
  { label: '智能推荐系统', path: '/dashboard/recommendations' },
  { label: '数据可视化与分析', path: '/dashboard/data-analysis' }
]

const logout = () => {
  localStorage.removeItem('academic-token')
  router.push('/login')
}
</script>

<style scoped>
.layout { min-height:100vh; display:grid; grid-template-columns: 250px 1fr; }
.sidebar { background:#fff; border-right:1px solid #e6edfd; padding:18px; display:flex; flex-direction:column; gap:10px; }
.sidebar h3 { color:#2a4d9e; margin:0 0 8px; font-size:18px; }
nav { display:flex; flex-direction:column; gap:8px; flex:1; }
.menu { text-decoration:none; color:#344562; padding:10px; border-radius:8px; background:#f4f8ff; }
.active { background:#4d80ff; color:#fff; }
.content { padding:16px; overflow:auto; }
@media (max-width: 860px){ .layout{ grid-template-columns:1fr; } .sidebar{ position:sticky; top:0; z-index:5; border-right:none; border-bottom:1px solid #e6edfd;} nav{flex-direction:row; overflow:auto;} .menu{white-space:nowrap;} }
</style>
