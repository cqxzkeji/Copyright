<template>
  <div class="layout">
    <aside>
      <div class="brand">渐变家居</div>
      <nav>
        <router-link v-for="item in menu" :key="item.path" :to="item.path" class="nav-item" active-class="active">
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>
    <main>
      <header class="top-bar">
        <div>
          <p class="eyebrow">智能主界面</p>
          <h2>选择任意模块开始设计</h2>
        </div>
        <div class="actions">
          <button class="btn btn-secondary" @click="showHint = true">操作说明</button>
          <button class="btn btn-primary" @click="showProgressModal = true">加载模块</button>
        </div>
      </header>
      <section class="content">
        <router-view />
      </section>
    </main>
  </div>
  <div v-if="showHint" class="modal-backdrop" @click.self="showHint = false">
    <div class="modal">
      <header>
        <span>快速提示</span>
        <button class="btn btn-secondary" @click="showHint = false">关闭</button>
      </header>
      <div class="body">
        <ul>
          <li>左侧为模块列表，点击即可加载到内容窗口。</li>
          <li>模块独立运行，互不影响，可反复切换。</li>
          <li>所有按钮提供模态弹窗反馈，确保信息明确。</li>
        </ul>
      </div>
      <footer>
        <button class="btn btn-primary" @click="showHint = false">知道了</button>
      </footer>
    </div>
  </div>
  <div v-if="showProgressModal" class="modal-backdrop" @click.self="showProgressModal = false">
    <div class="modal">
      <header>
        <span>模块加载</span>
        <button class="btn btn-secondary" @click="showProgressModal = false">取消</button>
      </header>
      <div class="body">
        <p>当前模块资源预加载中...</p>
        <div class="progress-bar"><span :style="{ width: progress + '%' }"></span></div>
      </div>
      <footer>
        <button class="btn btn-primary" @click="showProgressModal = false">完成</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const menu = [
  { label: '渐变色选择', path: '/app/gradients' },
  { label: '布局展示', path: '/app/layouts' },
  { label: '设计定制', path: '/app/customization' },
  { label: '报告生成', path: '/app/reports' },
  { label: '系统设置', path: '/app/settings' }
];

const showHint = ref(false);
const showProgressModal = ref(false);
const progress = ref(10);
let timer;

onMounted(() => {
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 10);
  }, 600);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

aside {
  background: linear-gradient(180deg, #eef2ff, #e0f2fe);
  border-right: 1px solid #e5e7eb;
  padding: 20px;
  display: grid;
  gap: 16px;
}

.brand {
  font-weight: 800;
  font-size: 20px;
  padding: 12px;
  border-radius: 14px;
  background: white;
  box-shadow: 0 12px 30px rgba(79, 70, 229, 0.15);
}

nav {
  display: grid;
  gap: 8px;
}

.nav-item {
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  border: 1px solid transparent;
}

.nav-item.active,
.nav-item:hover {
  background: white;
  border-color: #e5e7eb;
}

main {
  padding: 20px 24px 36px;
  display: grid;
  gap: 16px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.eyebrow {
  margin: 0;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h2 {
  margin: 4px 0 0;
}

.actions {
  display: flex;
  gap: 10px;
}

.content {
  background: #ffffffdd;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.08);
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  aside {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .actions {
    width: 100%;
    flex-wrap: wrap;
  }
  .actions .btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
