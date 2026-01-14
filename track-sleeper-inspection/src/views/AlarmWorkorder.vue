<template>
  <section class="module-grid">
    <div class="app-card overview">
      <div>
        <h2>告警联动与工单处置</h2>
        <p>支持实时告警、推送与派单闭环，记录整改前后对比与责任人。</p>
        <div class="metrics">
          <div>
            <strong>32</strong>
            <span>今日告警</span>
          </div>
          <div>
            <strong>12</strong>
            <span>处理中</span>
          </div>
          <div>
            <strong>96%</strong>
            <span>按期闭环</span>
          </div>
        </div>
      </div>
      <img :src="chartImage" alt="告警趋势" />
    </div>

    <div class="app-card">
      <div class="toolbar">
        <button class="primary-btn" type="button" @click="openAlarmModal">新增告警</button>
        <button class="secondary-btn" type="button" @click="openDispatchModal">派单管理</button>
        <button class="ghost-btn" type="button" @click="openNotifyModal">推送策略</button>
        <button class="ghost-btn" type="button" @click="openProgressModal">处置进度</button>
      </div>
      <table class="app-table">
        <thead>
          <tr>
            <th>告警编号</th>
            <th>里程</th>
            <th>病害类型</th>
            <th>响应级别</th>
            <th>责任人</th>
            <th>时限</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in alarmRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.mileage }}</td>
            <td>{{ row.issue }}</td>
            <td><span :class="['badge', row.levelClass]">{{ row.level }}</span></td>
            <td>{{ row.owner }}</td>
            <td>{{ row.deadline }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal
      v-if="showAlarmModal"
      title="新增告警记录"
      :on-close="closeAlarmModal"
      :on-confirm="closeAlarmModal"
    >
      <div class="form-grid">
        <label class="form-field">
          告警类型
          <select v-model="alarmForm.type">
            <option>严重破损</option>
            <option>轨枕缺失</option>
            <option>裂纹扩展</option>
          </select>
        </label>
        <label class="form-field">
          里程位置
          <input v-model="alarmForm.mileage" />
        </label>
        <label class="form-field">
          响应级别
          <select v-model="alarmForm.level">
            <option>一级</option>
            <option>二级</option>
            <option>三级</option>
          </select>
        </label>
        <label class="form-field">
          责任班组
          <input v-model="alarmForm.team" />
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showDispatchModal"
      title="派单管理"
      :on-close="closeDispatchModal"
      :on-confirm="closeDispatchModal"
    >
      <div class="form-grid">
        <label class="form-field">
          工单编号
          <input v-model="dispatchForm.code" />
        </label>
        <label class="form-field">
          负责人
          <input v-model="dispatchForm.owner" />
        </label>
        <label class="form-field">
          预计完成
          <input v-model="dispatchForm.deadline" />
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          处置要求
          <textarea v-model="dispatchForm.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showNotifyModal"
      title="推送策略"
      :on-close="closeNotifyModal"
      :on-confirm="closeNotifyModal"
    >
      <div class="form-grid">
        <label class="form-field">
          推送渠道
          <select v-model="notifyForm.channel">
            <option>短信 + 邮件</option>
            <option>平台消息</option>
            <option>全部渠道</option>
          </select>
        </label>
        <label class="form-field">
          频率策略
          <select v-model="notifyForm.frequency">
            <option>实时</option>
            <option>每 30 分钟</option>
            <option>每日汇总</option>
          </select>
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          推送备注
          <textarea v-model="notifyForm.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showProgressModal"
      title="工单处置进度"
      :on-close="closeProgressModal"
      :on-confirm="closeProgressModal"
    >
      <p>工单 {{ progressTicket }} 正在派单与整改跟踪。</p>
      <div class="progress-bar" style="margin-top: 16px">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="margin-top: 10px; color: #60729b">完成度 {{ progress }}%</p>
    </Modal>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import Modal from "../components/Modal.vue";

const chartImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='180'>
      <rect width='300' height='180' rx='16' fill='#f2f7ff'/>
      <path d='M30 120 L90 80 L150 100 L210 60 L270 90' fill='none' stroke='#ff8fa3' stroke-width='6'/>
      <circle cx='90' cy='80' r='6' fill='#ff5c7c'/>
      <circle cx='150' cy='100' r='6' fill='#ff5c7c'/>
      <circle cx='210' cy='60' r='6' fill='#ff5c7c'/>
    </svg>`
  );

const alarmRows = Array.from({ length: 20 }, (_, index) => {
  const issues = ["裂纹扩展", "掉块", "缺失", "轨枕松动", "异物侵限"];
  const levels = [
    { label: "一级", class: "danger" },
    { label: "二级", class: "warning" },
    { label: "三级", class: "success" },
  ];
  const level = levels[index % levels.length];
  return {
    id: `AL-${2024}${index + 11}`,
    mileage: `K${30 + index}+${(index * 5) % 1000}`,
    issue: issues[index % issues.length],
    level: level.label,
    levelClass: level.class,
    owner: ["抢修一组", "抢修二组", "设备保障组"][index % 3],
    deadline: `${2 + (index % 4)} 小时内`,
  };
});

const showAlarmModal = ref(false);
const showDispatchModal = ref(false);
const showNotifyModal = ref(false);
const showProgressModal = ref(false);
const progress = ref(0);
const progressTicket = ref("WO-3321");
let timer;

const alarmForm = ref({
  type: "严重破损",
  mileage: "K33+120",
  level: "一级",
  team: "抢修一组",
});

const dispatchForm = ref({
  code: "WO-3321",
  owner: "张队长",
  deadline: "2024-07-18 12:00",
  note: "完成轨枕更换并回传照片。",
});

const notifyForm = ref({
  channel: "全部渠道",
  frequency: "实时",
  note: "一级告警需同步项目负责人。",
});

const openAlarmModal = () => {
  showAlarmModal.value = true;
};

const closeAlarmModal = () => {
  showAlarmModal.value = false;
};

const openDispatchModal = () => {
  showDispatchModal.value = true;
};

const closeDispatchModal = () => {
  showDispatchModal.value = false;
};

const openNotifyModal = () => {
  showNotifyModal.value = true;
};

const closeNotifyModal = () => {
  showNotifyModal.value = false;
};

const openProgressModal = () => {
  progress.value = 25;
  progressTicket.value = "WO-3321";
  showProgressModal.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 15, 100);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 420);
};

const closeProgressModal = () => {
  showProgressModal.value = false;
  clearInterval(timer);
};

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.module-grid {
  display: grid;
  gap: 20px;
}

.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  align-items: center;
}

.overview h2 {
  margin: 0 0 8px;
}

.overview p {
  margin: 0 0 16px;
  color: #60729b;
}

.overview img {
  width: 100%;
  border-radius: 14px;
  background: #f1f6ff;
}

.metrics {
  display: flex;
  gap: 16px;
}

.metrics div {
  background: #f4f7ff;
  border-radius: 12px;
  padding: 10px 14px;
  min-width: 90px;
}

.metrics strong {
  font-size: 18px;
  display: block;
}

.metrics span {
  font-size: 12px;
  color: #6a7aa3;
}
</style>
