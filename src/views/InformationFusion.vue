<template>
  <div class="container">
    <div class="flex-between">
      <div>
        <h2>信息融合分析</h2>
        <p class="muted">融合多模态与多源数据，生成统一洞察</p>
      </div>
      <button class="secondary" @click="showFusion = true">运行融合</button>
    </div>

    <div class="card" style="margin-top: 16px;">
      <div class="flex-between">
        <h3>融合任务</h3>
        <button class="ghost" @click="showLog = true">查看日志</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>输入</th>
            <th>算法</th>
            <th>状态</th>
            <th>产出</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.name">
            <td>{{ task.name }}</td>
            <td>{{ task.inputs }}</td>
            <td>{{ task.algo }}</td>
            <td><span class="badge" :class="task.badge">{{ task.status }}</span></td>
            <td>{{ task.output }}</td>
            <td><button class="ghost" @click="inspect(task)">查看</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showFusion" class="modal-overlay" @click.self="showFusion = false">
      <div class="modal">
        <div class="modal-header">
          <h3>融合执行</h3>
          <button class="ghost" @click="showFusion = false">关闭</button>
        </div>
        <p>正在执行融合管道：特征对齐 → 时序对齐 → 规则推理。</p>
        <div class="progress">
          <div class="progress-bar" style="width: 70%; background: var(--primary);"></div>
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="showFusion = false">暂停</button>
          <button @click="showFusion = false">完成</button>
        </div>
      </div>
    </div>

    <div v-if="showLog" class="modal-overlay" @click.self="showLog = false">
      <div class="modal">
        <div class="modal-header">
          <h3>融合日志</h3>
          <button class="ghost" @click="showLog = false">关闭</button>
        </div>
        <ul>
          <li v-for="line in logs" :key="line" class="muted">{{ line }}</li>
        </ul>
        <div class="modal-actions">
          <button class="ghost" @click="showLog = false">清空</button>
          <button @click="showLog = false">导出</button>
        </div>
      </div>
    </div>

    <div v-if="detail" class="modal-overlay" @click.self="detail = null">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ detail?.name }} - 详情</h3>
          <button class="ghost" @click="detail = null">关闭</button>
        </div>
        <p>输入：{{ detail?.inputs }}</p>
        <p>算法：{{ detail?.algo }}</p>
        <p class="muted">产出：{{ detail?.output }}</p>
        <div class="modal-actions">
          <button class="ghost" @click="detail = null">取消</button>
          <button @click="detail = null">重新执行</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tasks = [
  { name: '设备状态融合', inputs: '传感器+日志', algo: '多模态注意力', status: '运行中', badge: 'success', output: '综合评分表' },
  { name: '产线节拍预测', inputs: 'API+传感器', algo: '时序预测', status: '运行中', badge: 'info', output: '预测序列' },
  { name: '风险告警合并', inputs: '日志+规则', algo: '规则推理', status: '延迟', badge: 'warning', output: '告警列表' },
  { name: '质检缺陷识别', inputs: '图像+文本', algo: '对比学习', status: '运行中', badge: 'success', output: '缺陷标签' }
];

const logs = [
  '10:20 触发融合任务：设备状态融合',
  '10:22 对齐 2 个传感器来源',
  '10:24 应用规则推理完成',
  '10:25 输出综合评分表',
  '10:26 启动产线节拍预测',
  '10:27 追加日志流数据',
  '10:29 生成预测序列'
];

const showFusion = ref(false);
const showLog = ref(false);
const detail = ref(null);

const inspect = (task) => {
  detail.value = task;
};
</script>

<style scoped>
.muted { color: var(--muted); }
</style>
