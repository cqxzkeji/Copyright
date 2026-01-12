<template>
  <div class="page-shell">
    <aside class="sidebar">
      <h1>灰斑识别优化系统</h1>
      <nav class="menu">
        <router-link to="/app/data-collection">数据采集与预处理</router-link>
        <router-link to="/app/feature-extraction">特征提取与分析</router-link>
        <router-link to="/app/model-optimization">智能算法与模型优化</router-link>
        <router-link to="/app/anomaly-detection">异常检测与预警</router-link>
        <router-link to="/app/result-visualization">结果展示与决策支持</router-link>
      </nav>
      <div class="card">
        <h3>系统概况</h3>
        <p>采集通道：6 路</p>
        <p>在线模型：CNN-V3</p>
        <p>稳定性：98.7%</p>
      </div>
    </aside>
    <main class="content">
      <div class="top-bar">
        <div>
          <strong>运行状态：</strong>在线
        </div>
        <div class="status">
          <span>监控设备 18 台</span>
          <span>今日报警 2 次</span>
          <span>分析报告 6 份</span>
        </div>
      </div>
      <router-view />
    </main>
  </div>
</template>

<script setup></script>
