<template>
  <div class="nav">
    <div class="header">
      <div>
        <div class="badge">CNM Lab</div>
        <h1>甘蔗纤维素纳米膜结构优化工作台</h1>
        <p class="helper-text">登陆成功，选择功能模块进入具体操作。</p>
      </div>
      <div class="flex" style="align-items: center;">
        <span class="helper-text">项目：{{ projectName }}</span>
        <button @click="showNotice = true">操作提示</button>
      </div>
    </div>
    <div class="nav-links">
      <RouterLink to="/app/modeling">建模与分析</RouterLink>
      <RouterLink to="/app/optimization">参数调控与优化</RouterLink>
      <RouterLink to="/app/testing">性能测试与评估</RouterLink>
      <RouterLink to="/app/simulation">应用场景模拟</RouterLink>
      <RouterLink to="/app/report">报告生成与可视化</RouterLink>
    </div>
  </div>
  <div class="container">
    <router-view />
  </div>
  <div v-if="showNotice" class="modal-mask">
    <div class="modal-container">
      <h3>使用提示</h3>
      <ul>
        <li>点击导航切换模块，所有模块内容均在下方窗口显示。</li>
        <li>每个模块内的按钮均有弹窗交互，包含表单、进度条与提示信息。</li>
        <li>建议按照建模→优化→测试→模拟→报告的顺序完成工作流。</li>
      </ul>
      <div class="flex" style="justify-content: flex-end; margin-top: 12px;">
        <button @click="showNotice = false">我已知晓</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showNotice = ref(false);
const projectName = 'CNM-2024';
</script>
