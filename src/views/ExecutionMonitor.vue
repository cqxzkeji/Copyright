<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr;">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>执行监控</h2>
          <p class="hint">车辆轨迹、到离场、节点签收回传</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('reroute')">调度改派</button>
          <button class="btn secondary" @click="openModal('notify')">消息通知</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>车辆</th>
            <th>位置</th>
            <th>状态</th>
            <th>到离场</th>
            <th>异常</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in monitors" :key="row.car">
            <td>{{ row.car }}</td>
            <td>{{ row.pos }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.alert }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <header class="section-header">
        <div>
          <h2>异常与协同</h2>
          <p class="hint">超时、偏航、拥堵、取消、缺货、拒收</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('second')">二次优化</button>
          <button class="btn secondary" @click="openModal('progress')">进度弹窗</button>
        </div>
      </header>
      <div class="timeline">
        <div v-for="item in alerts" :key="item.id" class="timeline-item">
          <div class="dot"></div>
          <div>
            <strong>{{ item.title }}</strong>
            <p class="hint">{{ item.detail }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="activeModal" class="modal-mask" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <form class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px;" @submit.prevent="confirm">
        <label>异常类型<select><option>超时</option><option>偏航</option><option>拥堵</option><option>取消</option></select></label>
        <label>责任人<input placeholder="司机/客服" /></label>
        <label>协同节点<input placeholder="仓库/客户/分拨" /></label>
        <label>改派资源<input placeholder="车辆/司机" /></label>
        <label style="grid-column: 1 / -1;">处理意见<textarea rows="2" placeholder="填写处理方案、复投线路等" /></label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button type="button" class="btn secondary" @click="openProgress">进度</button>
          <button class="btn success" type="submit">确认</button>
        </div>
      </form>
      <div v-if="showProgress" class="card" style="margin-top: 12px;">
        <strong>正在回传签收与重新规划...</strong>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const monitors = reactive([
  { car: '沪A01', pos: 'G2 嘉定', status: '行驶', time: '09:12 到场', alert: '正常' },
  { car: '沪A02', pos: '外环S20', status: '拥堵', time: '09:20 出场', alert: '延迟 12min' },
  { car: '沪A03', pos: '浦东内环', status: '行驶', time: '09:35 到场', alert: '正常' },
  { car: '京B01', pos: '北五环', status: '偏航', time: '09:05 出场', alert: '需改派' },
  { car: '京B02', pos: '丰台', status: '行驶', time: '09:18 到场', alert: '正常' },
  { car: '京B03', pos: '朝阳', status: '等待', time: '09:30 等待', alert: '预约窗口' },
  { car: '穗C01', pos: '广园快速', status: '拥堵', time: '09:10 行驶', alert: '延迟 8min' },
  { car: '穗C02', pos: '南沙港', status: '行驶', time: '09:25 到场', alert: '正常' },
  { car: '深D01', pos: '南山', status: '卸货', time: '09:40 卸货', alert: '正常' },
  { car: '深D02', pos: '盐田', status: '行驶', time: '09:15 行驶', alert: '正常' },
  { car: '渝E01', pos: '两江新区', status: '行驶', time: '09:05 行驶', alert: '正常' },
  { car: '渝E02', pos: '观音桥', status: '超时', time: '09:45 超时', alert: '需协同' },
  { car: '蓉F01', pos: '高新区', status: '等待', time: '09:22 等待', alert: '预约' },
  { car: '蓉F02', pos: '龙泉驿', status: '行驶', time: '09:33 行驶', alert: '正常' },
  { car: '汉G01', pos: '东西湖', status: '行驶', time: '09:11 行驶', alert: '正常' },
  { car: '汉G02', pos: '光谷', status: '卸货', time: '09:26 卸货', alert: '正常' },
  { car: '杭H01', pos: '滨江', status: '行驶', time: '09:14 行驶', alert: '正常' },
  { car: '杭H02', pos: '余杭', status: '拥堵', time: '09:38 行驶', alert: '延迟 10min' },
  { car: '津J01', pos: '北辰', status: '行驶', time: '09:16 行驶', alert: '正常' },
  { car: '津J02', pos: '西青', status: '等待', time: '09:28 等待', alert: '预约' }
]);

const alerts = reactive([
  { id: 1, title: '偏航提醒', detail: '京B01 偏航至北五环，建议改派就近车辆补单' },
  { id: 2, title: '拥堵影响', detail: '沪A02 外环拥堵，预计延迟 15 分钟，提醒客户' },
  { id: 3, title: '预约窗口', detail: '京B03 客户预约 10:00-12:00，请控制到达时间' },
  { id: 4, title: '超时未签', detail: '渝E02 预计超时，需客服联系客户确认签收' }
]);

const activeModal = ref('');
const showProgress = ref(false);
const progress = ref(50);

const openModal = (name) => {
  activeModal.value = name;
  showProgress.value = false;
  progress.value = 50;
};

const closeModal = () => {
  activeModal.value = '';
};

const openProgress = () => {
  showProgress.value = true;
  let val = 50;
  const timer = setInterval(() => {
    val += 12;
    progress.value = Math.min(val, 100);
    if (val >= 100) clearInterval(timer);
  }, 300);
};

const confirm = () => {
  alert('异常处理已推送至相关责任人并更新看板');
  closeModal();
};

const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'reroute':
      return '调度改派与二次优化';
    case 'notify':
      return '消息通知与协同';
    case 'second':
      return '异常场景二次优化';
    case 'progress':
      return '处理进度与签收回传';
    default:
      return '执行监控';
  }
});
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 8px;
}

.timeline {
  display: grid;
  gap: 14px;
}

.timeline-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
}
</style>
