<template>
  <div class="module-shell">
    <header class="module-header">
      <div>
        <p class="eyebrow">运输与转移</p>
        <h3>在途车辆 {{ onWay }} 台 · 今日需转运 {{ todayDemand }} 吨</h3>
      </div>
      <div class="actions">
        <button @click="planOpen = true">创建运输计划</button>
        <button class="ghost" @click="noticeOpen = true">查看转移联单</button>
      </div>
    </header>
    <section class="timeline">
      <article v-for="shipment in shipments" :key="shipment.id" class="timeline-card">
        <div class="timeline-header">
          <h4>{{ shipment.route }}</h4>
          <span class="badge" :class="shipment.status">{{ shipment.status }}</span>
        </div>
        <p>驾驶员：{{ shipment.driver }} · 车牌：{{ shipment.plate }}</p>
        <p>发车时间：{{ shipment.depart }} · 预计到达：{{ shipment.arrive }}</p>
        <div class="progress">
          <div :style="{ width: shipment.progress + '%' }"></div>
        </div>
        <footer>
          <span>{{ shipment.progress }}%</span>
          <button class="ghost" @click="track(shipment)">启动跟踪</button>
        </footer>
      </article>
    </section>

    <ModalDialog v-if="planOpen" title="运输计划" primary-text="提交计划" @close="planOpen = false" @confirm="submitPlan">
      <form class="modal-form">
        <label>
          运输路线
          <input v-model="planForm.route" placeholder="工厂A → 处置场" />
        </label>
        <label>
          危废类别
          <select v-model="planForm.category">
            <option value="HW17">HW17 表面处理废物</option>
            <option value="HW48">HW48 有机溶剂</option>
            <option value="HW08">HW08 含油废物</option>
          </select>
        </label>
        <label>
          发车时间
          <input v-model="planForm.depart" type="datetime-local" />
        </label>
        <label>
          指派车辆
          <input v-model="planForm.plate" placeholder="皖A·X1234" />
        </label>
      </form>
    </ModalDialog>

    <ModalDialog v-if="noticeOpen" title="电子联单" primary-text="关闭" @close="noticeOpen = false" @confirm="noticeOpen = false">
      <p>联单号：HF-TRANS-2025-032</p>
      <p>转移量：6.2 吨 · 危废类别 HW48</p>
      <p>审批状态：已签发 · 扫码可追溯。</p>
    </ModalDialog>

    <ModalDialog
      v-if="trackingShipment"
      :title="trackingShipment.route + ' 跟踪'"
      primary-text="确认到厂"
      @close="stopTracking"
      @confirm="markArrived"
    >
      <p>当前进度：{{ trackingProgress }}%</p>
      <div class="progress large">
        <div :style="{ width: trackingProgress + '%' }"></div>
      </div>
      <p>北斗定位：{{ trackingShipment.location }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const shipments = ref([
  { id: 1, route: '厂区东门 → 危废仓', driver: '李帅', plate: '皖A·F9182', depart: '08:30', arrive: '10:00', progress: 62, status: '在途', location: 'G205 国道' },
  { id: 2, route: '危废仓 → 处置中心', driver: '王琪', plate: '皖A·M2881', depart: '10:10', arrive: '13:30', progress: 25, status: '待发车', location: '厂区集结' },
  { id: 3, route: '焚烧站 → 二级仓', driver: '曹宁', plate: '皖B·Q6621', depart: '06:20', arrive: '08:50', progress: 95, status: '即将抵达', location: '环城东路' }
]);

const planOpen = ref(false);
const noticeOpen = ref(false);
const trackingShipment = ref(null);
const trackingProgress = ref(0);
const timer = ref(null);

const planForm = reactive({ route: '', category: 'HW17', depart: '', plate: '' });

const onWay = shipments.value.filter((item) => item.status !== '待发车').length;
const todayDemand = 12.6;

const submitPlan = () => {
  shipments.value.push({
    id: Date.now(),
    route: planForm.route || '临时任务',
    driver: '调度中',
    plate: planForm.plate || '待分配',
    depart: planForm.depart || '--',
    arrive: '--',
    progress: 0,
    status: '待发车',
    location: '调度中心'
  });
  planOpen.value = false;
};

const track = (shipment) => {
  trackingShipment.value = shipment;
  trackingProgress.value = shipment.progress;
  if (timer.value) {
    clearInterval(timer.value);
  }
  timer.value = setInterval(() => {
    trackingProgress.value = Math.min(100, trackingProgress.value + 5);
    if (trackingProgress.value === 100) {
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 600);
};

const stopTracking = () => {
  trackingShipment.value = null;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const markArrived = () => {
  if (trackingShipment.value) {
    trackingShipment.value.status = '已抵达';
    trackingShipment.value.progress = 100;
  }
  stopTracking();
};

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

button {
  background: linear-gradient(120deg, #0ea5e9, #6366f1);
  color: #fff;
  border-radius: 16px;
  padding: 0.7rem 1.6rem;
}

button.ghost {
  background: rgba(14, 165, 233, 0.15);
  color: #0369a1;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.timeline-card {
  background: #ecfeff;
  border-radius: 22px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.badge.在途 {
  background: #fef3c7;
  color: #a16207;
}

.badge.待发车 {
  background: #fee2e2;
  color: #b91c1c;
}

.badge.即将抵达,
.badge.已抵达 {
  background: #dcfce7;
  color: #166534;
}

.progress {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.2);
}

.progress.large {
  height: 14px;
  margin: 0.5rem 0 1rem;
}

.progress div {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #0ea5e9, #14b8a6);
}

table {
  width: 100%;
}
</style>
