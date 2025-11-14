<template>
  <div class="module-grid">
    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>运输任务看板</h3>
          <p>实时掌握危废车辆流转状态</p>
        </div>
        <button class="primary-btn" @click="dispatchVehicle">调度车辆</button>
      </header>
      <ul class="task-list">
        <li v-for="task in tasks" :key="task.id">
          <div>
            <strong>{{ task.route }}</strong>
            <p>{{ task.waste }} · {{ task.weight }}吨</p>
          </div>
          <span class="badge" :style="{ background: task.badgeColor }">{{ task.status }}</span>
        </li>
      </ul>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>轨迹跟踪</h3>
          <p>点击节点查看车辆位置</p>
        </div>
      </header>
      <div class="timeline">
        <button
          v-for="node in nodes"
          :key="node.name"
          class="timeline-node"
          @click="showNode(node)"
        >
          <span>{{ node.name }}</span>
          <small>{{ node.time }}</small>
        </button>
      </div>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>异常记录</h3>
          <p>AI 智能识别并推送</p>
        </div>
        <button class="secondary-btn" @click="acknowledge">批量确认</button>
      </header>
      <div class="alert-list">
        <article v-for="alert in alerts" :key="alert.id">
          <h4>{{ alert.title }}</h4>
          <p>{{ alert.desc }}</p>
        </article>
      </div>
    </div>
  </div>
  <BaseModal v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
    <p>{{ modal.message }}</p>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tasks = [
  { id: 1, route: '暂存库 → 焚烧车间', waste: 'HW08 废矿物油', weight: 4.6, status: '装车完成', badgeColor: '#e0f2fe' },
  { id: 2, route: '焚烧车间 → 废液处理', waste: 'HW11 精馏残渣', weight: 3.2, status: '运输中', badgeColor: '#fee2e2' },
  { id: 3, route: '暂存库 → 外运处置', waste: 'HW49 其他废物', weight: 7.4, status: '待出厂', badgeColor: '#dcfce7' }
];

const nodes = [
  { name: '进厂称重', time: '08:12' },
  { name: '堆场装料', time: '08:40' },
  { name: '离场', time: '09:15' },
  { name: '转运接驳', time: '09:50' }
];

const alerts = [
  { id: 1, title: 'GPS 偏离 120m', desc: '车牌浙B6675 夜间偏离路线，已推送驾驶员纠正' },
  { id: 2, title: '温度超阈值', desc: '中转罐体温度 68℃，系统自动打开喷淋' }
];

const modal = reactive({ visible: false, title: '', message: '' });

const dispatchVehicle = () => {
  modal.visible = true;
  modal.title = '车辆调度';
  modal.message = '已为 HW08 任务指派新能源罐车，预计 10 分钟抵达。';
};

const showNode = (node) => {
  modal.visible = true;
  modal.title = '轨迹节点';
  modal.message = `${node.name} 节点已采集 VR 画面，时间 ${node.time}`;
};

const acknowledge = () => {
  modal.visible = true;
  modal.title = '异常确认';
  modal.message = '2 条异常记录已归档并同步后台。';
};
</script>

<style scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.task-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-node {
  display: flex;
  justify-content: space-between;
  background: #eef2ff;
  border: none;
  border-radius: 14px;
  padding: 12px 16px;
  cursor: pointer;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert-list article {
  padding: 16px;
  background: #fef2f2;
  border-radius: 16px;
}
</style>
