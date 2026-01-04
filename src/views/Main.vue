<template>
  <div class="layout">
    <header class="header">
      <div class="actions">
        <div class="pill">CKD风险评估与分级管理</div>
        <div class="chip-row">
          <span class="tag">实时数据采集</span>
          <span class="tag">随访提醒</span>
          <span class="tag">安全审计</span>
        </div>
      </div>
      <div class="actions">
        <button class="secondary" @click="openAnnouncement">平台公告</button>
        <button class="accent" @click="showSupport = true">联系运维</button>
      </div>
    </header>
    <div class="content">
      <nav class="sidebar">
        <router-link to="/main/patient-data" active-class="active">数据采集</router-link>
        <router-link to="/main/risk-assessment" active-class="active">风险评估</router-link>
        <router-link to="/main/follow-up" active-class="active">分级随访</router-link>
        <router-link to="/main/statistics" active-class="active">统计可视化</router-link>
        <router-link to="/main/system" active-class="active">系统安全</router-link>
      </nav>
      <main class="main-area">
        <router-view />
      </main>
    </div>
    <div v-if="announcement" class="overlay" @click.self="announcement = ''">
      <div class="modal">
        <h3>系统公告</h3>
        <p>{{ announcement }}</p>
        <div class="actions" style="justify-content: flex-end; margin-top: 12px;">
          <button @click="announcement = ''">已知晓</button>
        </div>
      </div>
    </div>

    <div v-if="showSupport" class="overlay" @click.self="showSupport = false">
      <div class="modal">
        <h3>运维支持</h3>
        <p>7x24小时热线：400-CKD-HELP，平均响应时间 5 分钟。</p>
        <div class="form-grid">
          <label>问题分类<select><option>接口异常</option><option>权限申请</option><option>性能优化</option></select></label>
          <label>描述<textarea rows="3" placeholder="请简要描述问题..." /></label>
        </div>
        <div class="actions" style="justify-content: flex-end;">
          <button class="secondary" @click="showSupport = false">提交工单</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const announcement = ref('平台新增肾病风险量化模型，优化随访提醒逻辑，所有用户需在本周内完成数据质控复核。');
const showSupport = ref(false);

const openAnnouncement = () => {
  announcement.value = '近期完成了最新一批质控校验，数据回填功能升级中，预计本周五完成。请提前安排好门诊随访。';
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  display: grid;
  grid-template-columns: 240px 1fr;
  flex: 1;
  min-height: calc(100vh - 70px);
}

.main-area {
  padding: 18px;
}

@media (max-width: 960px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>
