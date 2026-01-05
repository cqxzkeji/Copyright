<template>
  <section>
    <div class="card-grid">
      <div class="card">
        <div class="label">评估指标</div>
        <h3>进度、质量、资源、满意度</h3>
        <p class="label">形成可量化的综合评估体系</p>
      </div>
      <div class="card">
        <div class="label">当前批次</div>
        <h3>2024Q2 评估</h3>
        <p class="label">包含12个重点片区</p>
      </div>
      <div class="card">
        <div class="label">已完成</div>
        <h3>8 个片区</h3>
        <p class="label">提交佐证材料与评分表</p>
      </div>
    </div>

    <div class="button-row">
      <button class="primary-btn" @click="activeModal = 'start'">发起评估</button>
      <button class="ghost-btn" @click="activeModal = 'adjust'">调整指标</button>
      <button class="ghost-btn" @click="activeModal = 'evidence'">上传佐证</button>
      <button class="ghost-btn" @click="activeModal = 'report'">生成报告</button>
    </div>

    <div class="card-grid" style="margin-bottom:16px;">
      <div class="chart-card">
        <div class="label">综合评分雷达图</div>
        <canvas ref="chartRef" height="200"></canvas>
      </div>
      <div class="chart-card">
        <div class="label">研判摘要</div>
        <p>资源利用效率高的片区表现为滨水带与产业园区，满意度提升明显。</p>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>片区</th>
            <th>进度</th>
            <th>质量</th>
            <th>资源利用</th>
            <th>满意度</th>
            <th>综合得分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in scores" :key="item.region">
            <td>{{ item.region }}</td>
            <td>{{ item.progress }}</td>
            <td>{{ item.quality }}</td>
            <td>{{ item.resource }}</td>
            <td>{{ item.satisfaction }}</td>
            <td>{{ item.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="activeModal" title="发起评估" sub-title="新建批次" v-if="activeModal === 'start'">
      <form class="flex" style="flex-direction:column; gap:10px;">
        <input placeholder="批次名称" />
        <input placeholder="覆盖片区" />
        <textarea rows="3" placeholder="评估说明"></textarea>
      </form>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="调整指标" sub-title="指标权重" v-else-if="activeModal === 'adjust'">
      <p>设置各指标权重，确保与实际目标一致。</p>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="上传佐证" sub-title="材料清单" v-else-if="activeModal === 'evidence'">
      <p>上传现场照片、监理报告、验收记录等，支持多文件上传。</p>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="生成报告" sub-title="输出格式" v-else-if="activeModal === 'report'">
      <p>选择报告格式（PDF/Word）并附带评分表与建议。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Chart } from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';

const activeModal = ref('');
const chartRef = ref(null);
let chartInstance = null;

const regions = ['老城区', '滨水带', '产业园区', '交通枢纽', '城郊结合', '核心商圈', '生态绿道'];
const scores = ref(
  regions.map((region, i) => {
    const progress = 70 + (i * 3) % 25;
    const quality = 75 + (i * 4) % 20;
    const resource = 68 + (i * 5) % 25;
    const satisfaction = 72 + (i * 2) % 20;
    return {
      region,
      progress,
      quality,
      resource,
      satisfaction,
      total: Math.round((progress + quality + resource + satisfaction) / 4)
    };
  })
);

onMounted(() => {
  const ctx = chartRef.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['进度', '质量', '资源', '满意度'],
      datasets: regions.map((region, idx) => ({
        label: region,
        data: [scores.value[idx].progress, scores.value[idx].quality, scores.value[idx].resource, scores.value[idx].satisfaction],
        fill: false,
        borderWidth: 2,
        borderColor: `hsl(${idx * 40}, 75%, 55%)`
      }))
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
});

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy();
});
</script>
