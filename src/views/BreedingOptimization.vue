<template>
  <div class="page">
    <div class="flex-between">
      <div>
        <p class="muted">跨代组合设计与评分</p>
        <h2 class="section-title">繁育优化</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="showPlan = true">创建繁育计划</button>
        <button class="success" @click="triggerOptimization">运行优化</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="data-card" v-for="item in metrics" :key="item.label">
        <p class="muted">{{ item.label }}</p>
        <h3>{{ item.value }}</h3>
        <p class="muted">{{ item.desc }}</p>
      </div>
    </div>

    <h3 class="section-title">繁育组合评分</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>组合</th>
            <th>亲本A</th>
            <th>亲本B</th>
            <th>优势性状</th>
            <th>产量指数</th>
            <th>环境适应</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in plans" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.parentA }}</td>
            <td>{{ row.parentB }}</td>
            <td>{{ row.trait }}</td>
            <td>{{ row.yield }}</td>
            <td>{{ row.env }}</td>
            <td class="actions">
              <button class="secondary" @click="showPlanDetail(row)">查看</button>
              <button class="primary" @click="schedule(row)">安排试验</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showPlan" title="创建繁育计划">
      <form class="modal-form" @submit.prevent="savePlan">
        <label>计划名称<input v-model="planForm.name" required /></label>
        <label>目标性状<select v-model="planForm.trait"><option>抗病</option><option>高产</option><option>早熟</option></select></label>
        <label>优选亲本<input v-model="planForm.parents" placeholder="如：高产1号 x 抗病5号" /></label>
        <label>预计代次<select v-model="planForm.generation"><option>F1</option><option>F2</option><option>回交</option></select></label>
        <div class="actions">
          <button class="primary" type="submit">保存</button>
          <button class="secondary" type="button" @click="showPlan = false">取消</button>
        </div>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showProgress" :title="progressTitle">
      <p>{{ progressMessage }}</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showDetail" title="组合详情">
      <p>组合：{{ activePlan?.name }}</p>
      <p>亲本：{{ activePlan?.parentA }} × {{ activePlan?.parentB }}</p>
      <p>重点指标：{{ activePlan?.trait }}，环境适应：{{ activePlan?.env }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = [
  { label: '候选组合', value: '28', desc: '筛选自 140 个性状矩阵' },
  { label: '模拟成功率', value: '92.4%', desc: '基于近五年田间验证' },
  { label: '已安排试验', value: '12', desc: '覆盖六个气候区' },
  { label: '可复用亲本', value: '34', desc: '高亲和力且稳定' }
];

const plans = ref([
  { name: '方案A', parentA: '高产1号', parentB: '抗病5号', trait: '高产+抗病', yield: '91', env: '东北平原' },
  { name: '方案B', parentA: '抗旱7号', parentB: '丰优9号', trait: '抗旱+稳产', yield: '87', env: '华北旱作' },
  { name: '方案C', parentA: '东风5号', parentB: '早熟8号', trait: '早熟+抗病', yield: '84', env: '南方水稻区' },
  { name: '方案D', parentA: '北斗6号', parentB: '星河7号', trait: '抗寒+耐盐', yield: '89', env: '盐碱滩涂' },
  { name: '方案E', parentA: '金谷3号', parentB: '皓穗10号', trait: '高产+强秆', yield: '90', env: '黄淮海' },
  { name: '方案F', parentA: '晨露8号', parentB: '润田2号', trait: '高含油+抗病', yield: '83', env: '长江流域' },
  { name: '方案G', parentA: '江南11号', parentB: '丰禾4号', trait: '早熟+抗旱', yield: '86', env: '西南山地' },
  { name: '方案H', parentA: '丰优9号', parentB: '高产1号', trait: '高产+耐肥', yield: '88', env: '华南平原' },
  { name: '方案I', parentA: '高产1号', parentB: '晨露8号', trait: '高产+直链淀粉', yield: '90', env: '东北寒地' },
  { name: '方案J', parentA: '北斗6号', parentB: '抗旱7号', trait: '抗寒+抗旱', yield: '85', env: '河西走廊' }
]);

const showPlan = ref(false);
const showProgress = ref(false);
const showDetail = ref(false);
const progress = ref(0);
const progressMessage = ref('');
const progressTitle = ref('进度');
const activePlan = ref(null);
const planForm = reactive({ name: '', trait: '抗病', parents: '', generation: 'F1' });

const triggerOptimization = () => {
  progressTitle.value = '优化计算中';
  progressMessage.value = '正在调用多目标遗传算法并评估环境适配度。';
  showProgress.value = true;
  progress.value = 10;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      clearInterval(timer);
      progressMessage.value = '完成！新组合已加入候选集。';
    }
  }, 400);
};

const showPlanDetail = (row) => {
  activePlan.value = row;
  showDetail.value = true;
};

const schedule = (row) => {
  progressTitle.value = '试验安排';
  progressMessage.value = `${row.name} 已锁定田间试验地块，正在分配小区。`;
  progress.value = 35;
  showProgress.value = true;
};

const savePlan = () => {
  plans.value.push({
    name: planForm.name,
    parentA: planForm.parents.split('x')[0]?.trim() || '未命名A',
    parentB: planForm.parents.split('x')[1]?.trim() || '未命名B',
    trait: planForm.trait,
    yield: '82',
    env: '待评估'
  });
  showPlan.value = false;
  progressTitle.value = '计划保存';
  progressMessage.value = '已保存并进入模拟队列。';
  progress.value = 60;
  showProgress.value = true;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form input, .modal-form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.progress {
  background: #e5e7eb;
  border-radius: 10px;
  height: 12px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, #60a5fa, #2563eb);
  height: 100%;
  transition: width 0.3s ease;
}
</style>
