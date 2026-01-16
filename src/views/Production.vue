<template>
  <section class="card">
    <div class="card-header">
      <div>
        <div class="card-title">农业生产管理</div>
        <div style="color: var(--muted); font-size: 13px;">计划制定、农事活动执行与过程管控。</div>
      </div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="button-secondary" type="button" @click="showDispatchModal = true">灌溉调度</button>
        <button class="button-secondary" type="button" @click="showFertilizeModal = true">施肥计划</button>
        <button class="button-secondary" type="button" @click="startProgress">执行巡田</button>
        <button class="button-primary" type="button" @click="showPlanModal = true">新增种植计划</button>
      </div>
    </div>
    <div class="grid-3">
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">在执行计划</div>
        <div style="font-size: 26px; font-weight: 700;">8 项</div>
        <div style="color: var(--accent); font-size: 13px;">按期完成率 92%</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">今日农事活动</div>
        <div style="font-size: 26px; font-weight: 700;">14 次</div>
        <div style="color: var(--accent); font-size: 13px;">巡田 6 / 施肥 3</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">水肥联动</div>
        <div style="font-size: 26px; font-weight: 700;">3 套</div>
        <div style="color: #f59e0b; font-size: 13px;">待调整 1 套</div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <div class="card-title">作物生长进度</div>
      <span class="chip">周计划完成度</span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
      <div v-for="stage in stages" :key="stage.name" class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>{{ stage.name }}</div>
          <span class="chip">{{ stage.rate }}%</span>
        </div>
        <div class="progress-bar" style="margin-top: 10px;">
          <span :style="{ width: stage.rate + '%' }"></span>
        </div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <div class="card-title">农事活动计划表</div>
      <button class="button-ghost" type="button" @click="showTipModal = true">操作提示</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>计划编号</th>
          <th>地块</th>
          <th>作物</th>
          <th>任务类型</th>
          <th>负责人</th>
          <th>开始时间</th>
          <th>进度</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.plot }}</td>
          <td>{{ task.crop }}</td>
          <td>{{ task.type }}</td>
          <td>{{ task.owner }}</td>
          <td>{{ task.start }}</td>
          <td><span class="chip">{{ task.progress }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal
    :open="showPlanModal"
    title="新增种植计划"
    @close="showPlanModal = false"
    @confirm="savePlan"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>计划名称</label>
        <input v-model="planForm.name" placeholder="例如：春季水稻一号计划" />
      </div>
      <div class="form-field">
        <label>作物类型</label>
        <select v-model="planForm.crop">
          <option>水稻</option>
          <option>玉米</option>
          <option>番茄</option>
        </select>
      </div>
      <div class="form-field">
        <label>负责地块</label>
        <input v-model="planForm.plot" placeholder="例如：南区 2 号地" />
      </div>
      <div class="form-field">
        <label>目标产量</label>
        <input v-model="planForm.target" placeholder="例如：4500kg" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showDispatchModal"
    title="灌溉调度"
    @close="showDispatchModal = false"
    @confirm="confirmDispatch"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>选择地块</label>
        <select v-model="dispatchForm.plot">
          <option>北区 1 号地</option>
          <option>南区 3 号地</option>
          <option>东区 4 号地</option>
        </select>
      </div>
      <div class="form-field">
        <label>灌溉方式</label>
        <select v-model="dispatchForm.mode">
          <option>滴灌</option>
          <option>喷灌</option>
          <option>渗灌</option>
        </select>
      </div>
      <div class="form-field">
        <label>预计水量</label>
        <input v-model="dispatchForm.volume" placeholder="例如：12 吨" />
      </div>
      <div class="form-field">
        <label>执行时间</label>
        <input v-model="dispatchForm.time" placeholder="例如：明日 08:30" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showFertilizeModal"
    title="施肥计划"
    @close="showFertilizeModal = false"
    @confirm="confirmFertilize"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>地块选择</label>
        <select v-model="fertilizeForm.plot">
          <option>东区 2 号地</option>
          <option>西区 1 号地</option>
          <option>温室 A 区</option>
        </select>
      </div>
      <div class="form-field">
        <label>肥料配方</label>
        <select v-model="fertilizeForm.recipe">
          <option>高氮促进型</option>
          <option>均衡通用型</option>
          <option>促果型</option>
        </select>
      </div>
      <div class="form-field">
        <label>施肥量</label>
        <input v-model="fertilizeForm.amount" placeholder="例如：35kg" />
      </div>
      <div class="form-field">
        <label>执行时间</label>
        <input v-model="fertilizeForm.time" placeholder="例如：今日 15:00" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showProgressModal"
    title="巡田进度"
    @close="closeProgress"
    @confirm="closeProgress"
  >
    <p>正在执行无人车巡田任务，预计 12 分钟完成。</p>
    <div class="progress-bar">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <div style="color: var(--muted); font-size: 13px;">{{ progress }}% 已完成</div>
  </BaseModal>

  <BaseModal
    :open="showTipModal"
    title="操作提示"
    @close="showTipModal = false"
    @confirm="showTipModal = false"
  >
    <p style="color: var(--muted); line-height: 1.6;">
      可在表格中查看各任务进度，必要时通过灌溉调度或施肥计划调整执行节奏。
    </p>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stages = [
  { name: '育苗期', rate: 78 },
  { name: '抽穗期', rate: 62 },
  { name: '灌浆期', rate: 48 },
  { name: '成熟期', rate: 35 }
];

const tasks = Array.from({ length: 22 }, (_, index) => ({
  id: `P-${200 + index}`,
  plot: `${['北区', '南区', '东区', '西区'][index % 4]} ${index % 5 + 1} 号地`,
  crop: ['水稻', '玉米', '番茄', '辣椒'][index % 4],
  type: ['播种', '灌溉', '施肥', '巡田'][index % 4],
  owner: ['张工', '李工', '王工'][index % 3],
  start: `2024-03-${(index % 20) + 1} 08:30`,
  progress: index % 5 === 0 ? '待调整' : '执行中'
}));

const showPlanModal = ref(false);
const showDispatchModal = ref(false);
const showFertilizeModal = ref(false);
const showProgressModal = ref(false);
const showTipModal = ref(false);

const planForm = reactive({
  name: '',
  crop: '水稻',
  plot: '',
  target: ''
});

const dispatchForm = reactive({
  plot: '北区 1 号地',
  mode: '滴灌',
  volume: '',
  time: ''
});

const fertilizeForm = reactive({
  plot: '东区 2 号地',
  recipe: '高氮促进型',
  amount: '',
  time: ''
});

const progress = ref(0);
let timer;

const startProgress = () => {
  progress.value = 0;
  showProgressModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 8;
    } else {
      clearInterval(timer);
    }
  }, 260);
};

const closeProgress = () => {
  showProgressModal.value = false;
  progress.value = 100;
};

const savePlan = () => {
  showPlanModal.value = false;
};

const confirmDispatch = () => {
  showDispatchModal.value = false;
};

const confirmFertilize = () => {
  showFertilizeModal.value = false;
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
