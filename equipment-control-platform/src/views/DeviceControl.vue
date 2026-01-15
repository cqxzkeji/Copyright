<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>装备接入与控制</h2>
        <p>统一接入多类型装备，支持远程控制与参数配置。</p>
      </div>
      <div class="actions">
        <button @click="openModal('access')">接入新装备</button>
        <button @click="openModal('control')">远程控制</button>
        <button @click="openModal('config')">参数配置</button>
      </div>
    </section>

    <div class="cards">
      <div class="card">
        <h3>接入概览</h3>
        <p>今日新增 6 台，累计接入 128 台。</p>
        <ul>
          <li>无人机：46 台</li>
          <li>地面车：32 台</li>
          <li>通信基站：24 台</li>
          <li>雷达阵列：26 台</li>
        </ul>
      </div>
      <div class="card">
        <h3>控制通道</h3>
        <p>当前已开启 8 条远程控制通道。</p>
        <div class="progress">
          <div class="bar" :style="{ width: '76%' }"></div>
        </div>
        <span>控制链路稳定度 76%</span>
      </div>
      <div class="card">
        <h3>重点任务</h3>
        <p>夜航巡检 · 海域扫测 · 机库自检</p>
        <button class="ghost" @click="openModal('task')">查看任务清单</button>
      </div>
    </div>

    <div class="table-card">
      <h3>装备接入列表</h3>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>装备类型</th>
            <th>场景</th>
            <th>控制状态</th>
            <th>链路质量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in deviceList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.scene }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.link }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      :open="modal.open"
      :title="modal.title"
      :confirm-text="modal.confirmText"
      @close="modal.open = false"
      @confirm="confirmAction"
    >
      <div v-if="modal.type === 'access'">
        <p>填写装备接入参数，系统将自动建立控制通道。</p>
        <form class="form-grid">
          <label>装备名称<input placeholder="如：北斗导航终端" /></label>
          <label>装备类型<select><option>无人机</option><option>地面车</option><option>雷达阵列</option></select></label>
          <label>所属场景<select><option>综合指挥中心</option><option>机库保障区</option><option>港口巡防</option></select></label>
          <label>接入优先级<select><option>高</option><option>中</option><option>低</option></select></label>
        </form>
      </div>
      <div v-else-if="modal.type === 'control'">
        <p>远程控制命令将通过安全链路下发。</p>
        <form class="form-grid">
          <label>控制对象<input placeholder="输入装备编号" /></label>
          <label>控制模式<select><option>自动协同</option><option>人工接管</option><option>应急返航</option></select></label>
          <label>执行时间<input type="time" /></label>
          <label>安全确认<select><option>已核验</option><option>待核验</option></select></label>
        </form>
      </div>
      <div v-else-if="modal.type === 'config'">
        <p>参数配置将实时同步到目标设备。</p>
        <form class="form-grid">
          <label>主链路频段<input placeholder="2.4GHz" /></label>
          <label>备用链路频段<input placeholder="5.8GHz" /></label>
          <label>加密策略<select><option>国密算法</option><option>AES-256</option></select></label>
          <label>日志上传周期<select><option>15 分钟</option><option>30 分钟</option><option>1 小时</option></select></label>
        </form>
      </div>
      <div v-else>
        <p>任务清单</p>
        <ul class="task-list">
          <li>夜航巡检：预计 22:00 开始，持续 3 小时。</li>
          <li>海域扫测：预计 23:30 开始，覆盖 4 条航线。</li>
          <li>机库自检：预计 00:30 开始，覆盖 16 个传感器。</li>
        </ul>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const deviceList = [
  { id: 'EC-001', type: '无人机', scene: '海域巡防', status: '控制中', link: '98%' },
  { id: 'EC-002', type: '地面车', scene: '机库保障', status: '待命', link: '94%' },
  { id: 'EC-003', type: '雷达阵列', scene: '边境警戒', status: '控制中', link: '96%' },
  { id: 'EC-004', type: '通信基站', scene: '港口指挥', status: '维护中', link: '89%' },
  { id: 'EC-005', type: '无人机', scene: '夜航巡检', status: '控制中', link: '97%' },
  { id: 'EC-006', type: '地面车', scene: '物资配送', status: '待命', link: '93%' },
  { id: 'EC-007', type: '雷达阵列', scene: '海岸监测', status: '控制中', link: '95%' },
  { id: 'EC-008', type: '通信基站', scene: '远程监控', status: '控制中', link: '92%' },
  { id: 'EC-009', type: '无人机', scene: '应急救援', status: '待命', link: '90%' },
  { id: 'EC-010', type: '地面车', scene: '机库保障', status: '维护中', link: '88%' },
  { id: 'EC-011', type: '雷达阵列', scene: '边境警戒', status: '控制中', link: '97%' },
  { id: 'EC-012', type: '通信基站', scene: '港口指挥', status: '待命', link: '91%' }
];

const modal = reactive({
  open: false,
  type: '',
  title: '',
  confirmText: ''
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  const titles = {
    access: '接入新装备',
    control: '远程控制',
    config: '参数配置',
    task: '任务清单'
  };
  modal.title = titles[type];
  modal.confirmText = type === 'task' ? '' : '提交执行';
};

const confirmAction = () => {
  modal.open = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.module-header h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button,
.ghost {
  border: none;
  background: #eef3ff;
  color: #2f3c4a;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress {
  height: 8px;
  background: #e4ecfb;
  border-radius: 6px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(120deg, #2f80ed, #56ccf2);
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-card th,
.table-card td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2fb;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #5b6b82;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d9e3f3;
  background: #f7faff;
}

.task-list {
  margin: 0;
  padding-left: 18px;
  color: #5b6b82;
}
</style>
