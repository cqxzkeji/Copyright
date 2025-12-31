<template>
  <div style="display: grid; grid-template-columns: 240px 1fr; min-height: 100vh;">
    <aside style="background: #fff; padding: 18px; box-shadow: 4px 0 25px rgba(15, 77, 145, 0.08);">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
        <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #22d3ee, #2563eb); border-radius: 12px; display: grid; place-items: center; color: #fff; font-weight: 700;">WF</div>
        <div>
          <strong>风机布局优化</strong>
          <div style="font-size: 12px; color: #2563eb;">GA驱动</div>
        </div>
      </div>
      <nav style="display: grid; gap: 10px;">
        <RouterLink v-for="item in menus" :key="item.path" :to="item.path" class="card" style="padding: 12px; display: block; border: 1px solid #e4eef5;" active-class="active-link">
          <div class="flex-between">
            <span style="font-weight: 700; color: #0f172a;">{{ item.label }}</span>
            <span class="badge">{{ item.tag }}</span>
          </div>
          <p style="margin: 6px 0 0 0; color: #4b5563; font-size: 13px;">{{ item.desc }}</p>
        </RouterLink>
      </nav>
    </aside>
    <section style="padding: 20px 24px 30px 24px;">
      <div class="flex-between" style="margin-bottom: 14px; gap: 16px; flex-wrap: wrap;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <div class="pill">自适应布局</div>
          <div class="pill" style="background:#e0f2fe; color:#1d4ed8">尾流建模</div>
          <div class="pill" style="background:#ecfdf3; color:#16a34a">约束全覆盖</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="button-secondary" @click="showHint('系统提示', '主界面已加载所有模块，可在左侧切换。')">提示</button>
          <button class="button-primary" @click="logout">退出</button>
        </div>
      </div>
      <div class="card" style="margin-bottom: 14px;">
        <div class="flex-between">
          <div>
            <h3 style="margin: 0 0 4px 0">风电场优化驾驶舱</h3>
            <p style="margin: 0; color: #4b5563;">统一入口，模块将在下方内容区加载，不单独显示模块描述</p>
          </div>
          <div style="text-align: right;">
            <div class="badge">运行就绪</div>
            <div style="font-size: 12px; color: #475569;">{{ new Date().toLocaleString('zh-CN') }}</div>
          </div>
        </div>
      </div>
      <RouterView />
    </section>
  </div>
  <ModalDialog v-if="hint.visible" :title="hint.title" @close="hint.visible=false" :showFooter="false">
    <p style="margin:0">{{ hint.content }}</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const menus = [
  { label: '项目与场址数据', path: '/main/site', desc: '场址边界与机型版本管理', tag: '数据' },
  { label: '约束与规则配置', path: '/main/constraint', desc: '机间距与红线等约束', tag: '规则' },
  { label: '遗传算法优化', path: '/main/ga', desc: '编码与参数设置', tag: '优化' },
  { label: '仿真评估与对比', path: '/main/simulation', desc: '尾流与敏感性分析', tag: '评估' },
  { label: '可视化与报告', path: '/main/report', desc: '报告导出与日志', tag: '报告' }
]

const hint = ref({ visible: false, title: '提示', content: '' })

const showHint = (title, content) => {
  hint.value = { visible: true, title, content }
}

const logout = () => {
  localStorage.removeItem('wf-token')
  router.push('/')
}
</script>

<style scoped>
.active-link {
  border-color: #60a5fa !important;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
}
</style>
