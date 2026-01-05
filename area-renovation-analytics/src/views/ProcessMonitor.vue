<template>
  <section>
    <div class="card-grid">
      <div class="card">
        <div class="label">实时监测</div>
        <h3>{{ tasks.filter(t => t.progress >= 80).length }} 个任务超过80%</h3>
        <p class="label">动态掌握关键节点完成度</p>
      </div>
      <div class="card">
        <div class="label">预警任务</div>
        <h3>{{ delayed.length }} 个</h3>
        <p class="label">进度偏差与质量风险即时推送</p>
      </div>
      <div class="card">
        <div class="label">抽检覆盖率</div>
        <h3>72%</h3>
        <p class="label">现场抽检与影像核验</p>
      </div>
    </div>

    <div class="button-row">
      <button class="primary-btn" @click="openProgress(tasks[0])">实时监测</button>
      <button class="ghost-btn" @click="activeModal = 'alert'">进度预警</button>
      <button class="ghost-btn" @click="activeModal = 'quality'">质量抽检</button>
      <button class="ghost-btn" @click="activeModal = 'sync'">同步计划</button>
    </div>

    <div class="card-grid" style="margin-bottom:16px;">
      <div class="chart-card">
        <div class="label">阶段完成度分布</div>
        <canvas ref="chartRef" height="160"></canvas>
      </div>
      <div class="chart-card">
        <div class="label">偏差说明</div>
        <p>偏差原因以材料到货、天气影响、现场协调为主，已制定调度计划。</p>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>整治任务</th>
            <th>负责人</th>
            <th>计划完成</th>
            <th>实际完成</th>
            <th>进度</th>
            <th>风险</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.owner }}</td>
            <td>{{ task.plan }}</td>
            <td>{{ task.actual }}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-bar-inner" :style="{ width: task.progress + '%' }"></div>
              </div>
              <div class="label">{{ task.progress }}%</div>
            </td>
            <td>{{ task.risk }}</td>
            <td>
              <button class="ghost-btn" @click="openProgress(task)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="activeModal" title="进度详情" sub-title="实时监测" v-if="activeModal === 'progress'">
      <p class="label">{{ currentTask.name }}</p>
      <div class="progress-bar">
        <div class="progress-bar-inner" :style="{ width: currentTask.progress + '%' }"></div>
      </div>
      <p>计划：{{ currentTask.plan }}，实际：{{ currentTask.actual }}，当前偏差：{{ currentTask.progress - 100 }}%</p>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="预警清单" sub-title="进度偏差" v-else-if="activeModal === 'alert'">
      <ul>
        <li v-for="item in delayed" :key="item.id">{{ item.name }} - 偏差 {{ 100 - item.progress }}%，原因：{{ item.risk }}</li>
      </ul>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="抽检计划" sub-title="质量管理" v-else-if="activeModal === 'quality'">
      <p>选择抽检批次与覆盖片区，提交后自动生成巡检路线与检查表。</p>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="同步计划" sub-title="任务交互" v-else-if="activeModal === 'sync'">
      <p>将进度数据同步到施工单位与监理端，保持节点计划一致。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Chart } from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';

const activeModal = ref('');
const currentTask = ref({});
const chartRef = ref(null);
let chartInstance = null;

const tasks = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: `TSK-${(i + 1).toString().padStart(3, '0')}`,
    name: `整治节点 ${i + 1}`,
    owner: ['王磊', '李欣', '陈锋', '赵云'][i % 4],
    plan: `2024-0${(i % 6) + 1}-30`,
    actual: `2024-0${(i % 6) + 1}-${10 + (i % 15)}`,
    progress: 50 + (i * 3) % 50,
    risk: ['正常', '材料延误', '天气影响', '协调中'][i % 4]
  }))
);

const delayed = tasks.value.filter((t) => t.progress < 80);

const openProgress = (task) => {
  currentTask.value = task;
  activeModal.value = 'progress';
};

onMounted(() => {
  const ctx = chartRef.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: tasks.value.map((t) => t.name),
      datasets: [
        {
          label: '完成度 %',
          data: tasks.value.map((t) => t.progress),
          backgroundColor: '#2f80ed'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { max: 100, beginAtZero: true } }
    }
  });
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>
