<template>
  <section class="module">
    <div class="section-header">
      <div>
        <h3>供应链主体协同</h3>
        <p class="muted">聚焦合作社、产地基地与加工中心的协同执行力。</p>
      </div>
      <div class="section-actions">
        <button class="btn" @click="showCreate = true">新增合作主体</button>
        <button class="btn secondary" @click="showProgress = true">信用评估同步</button>
        <button class="btn outline" @click="showTip = true">操作提示</button>
      </div>
    </div>

    <div class="grid two">
      <div class="table-card">
        <div class="table-head">
          <h4>合作主体清单</h4>
          <small class="muted">已对接 10 家核心主体</small>
        </div>
        <table>
          <thead>
            <tr>
              <th>主体</th>
              <th>类型</th>
              <th>地区</th>
              <th>等级</th>
              <th>协同状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="partner in partners" :key="partner.name">
              <td>{{ partner.name }}</td>
              <td>{{ partner.type }}</td>
              <td>{{ partner.region }}</td>
              <td><span class="badge" :style="{ background: partner.color }">{{ partner.level }}</span></td>
              <td :class="partner.statusColor">{{ partner.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <div class="table-head">
          <h4>供应稳定性评分</h4>
          <small class="muted">评分越高表示交付可预测性越强</small>
        </div>
        <Bar :options="chartOptions" :data="chartData" />
      </div>
    </div>
  </section>

  <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
    <div class="modal">
      <h3>新增合作主体</h3>
      <form @submit.prevent="submitCreate">
        <label>主体名称<input v-model="form.name" required /></label>
        <label>主体类型<select v-model="form.type"><option>合作社</option><option>基地</option><option>加工中心</option></select></label>
        <label>所属地区<input v-model="form.region" required /></label>
        <label>信用等级<select v-model="form.level"><option>A</option><option>B</option><option>C</option></select></label>
        <div class="actions">
          <button class="btn outline" type="button" @click="showCreate = false">取消</button>
          <button class="btn" type="submit">提交</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showProgress" class="modal-overlay" @click.self="showProgress = false">
    <div class="modal">
      <h3>信用评估同步中</h3>
      <p>正在从信任库拉取最新分数。</p>
      <div class="progress">
        <div class="bar" style="width: 78%"></div>
      </div>
      <div class="actions">
        <button class="btn" @click="showProgress = false">知道了</button>
      </div>
    </div>
  </div>

  <div v-if="showTip" class="modal-overlay" @click.self="showTip = false">
    <div class="modal">
      <h3>操作提示</h3>
      <p>保持产地到仓的发货间隔小于 48 小时，可获得更高协同评分。</p>
      <div class="actions">
        <button class="btn" @click="showTip = false">好的</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const partners = ref([
  { name: '江南果蔬合作社', type: '合作社', region: '浙江嘉兴', level: 'A', color: '#d9f99d', status: '对齐产销计划', statusColor: 'status-green' },
  { name: '渝东柑橘基地', type: '基地', region: '重庆涪陵', level: 'A', color: '#d9f99d', status: '提升库存周转', statusColor: 'status-blue' },
  { name: '鲁北面粉加工', type: '加工中心', region: '山东德州', level: 'B', color: '#fef08a', status: '加工节奏稳定', statusColor: 'status-green' },
  { name: '赣南脐橙联盟', type: '合作社', region: '江西赣州', level: 'A', color: '#d9f99d', status: '冷链联合配送', statusColor: 'status-purple' },
  { name: '川西高原马铃薯', type: '基地', region: '四川阿坝', level: 'B', color: '#fef08a', status: '收获窗口锁定', statusColor: 'status-green' },
  { name: '黔东南辣椒产业带', type: '基地', region: '贵州凯里', level: 'B', color: '#fef08a', status: '需补充包材', statusColor: 'status-orange' },
  { name: '松嫩平原玉米', type: '基地', region: '黑龙江齐齐哈尔', level: 'A', color: '#d9f99d', status: '产地监测在线', statusColor: 'status-green' },
  { name: '胶东海产品加工', type: '加工中心', region: '山东威海', level: 'A', color: '#d9f99d', status: '海运冷链追踪', statusColor: 'status-purple' },
  { name: '两湖小龙虾联盟', type: '合作社', region: '湖北潜江', level: 'B', color: '#fef08a', status: '夜间分拣保障', statusColor: 'status-blue' },
  { name: '岭南鲜花基地', type: '基地', region: '广东清远', level: 'A', color: '#d9f99d', status: '花期提醒下发', statusColor: 'status-green' },
]);

const chartData = ref({
  labels: partners.value.map((p) => p.name.split('')[0] + p.name.split('')[1]),
  datasets: [
    {
      label: '稳定性评分',
      backgroundColor: '#3a86ff',
      data: [92, 88, 81, 85, 80, 76, 89, 87, 78, 90],
      borderRadius: 8,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: { ticks: { color: '#6b7280' }, grid: { color: '#e5e7eb' } },
    x: { ticks: { color: '#6b7280' }, grid: { display: false } },
  },
});

const showCreate = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const form = ref({ name: '', type: '合作社', region: '', level: 'A' });

const submitCreate = () => {
  showCreate.value = false;
  alert('已登记新的合作主体：' + form.value.name);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.muted {
  color: var(--muted);
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.progress {
  background: #f3f4f6;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(135deg, #3a86ff, #8338ec);
}
</style>
