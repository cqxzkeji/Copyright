<template>
  <div class="supply-chain">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>供应链节点</h2>
          <p>显示采购、加工、仓储、运输等环节</p>
        </div>
        <button class="primary" @click="openNode">新增节点</button>
      </div>
      <div class="timeline">
        <div class="node" v-for="node in nodes" :key="node.id">
          <div class="node-header">
            <h3>{{ node.title }}</h3>
            <span>{{ node.time }}</span>
          </div>
          <p>{{ node.detail }}</p>
          <button class="ghost" @click="showNodeInfo(node)">详情</button>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>库存与发运</h2>
          <p>实时监控库存水平与在途车辆</p>
        </div>
        <button class="secondary" @click="dispatch">发起调拨</button>
      </div>
      <div class="inventory-grid">
        <div class="inventory-card" v-for="item in inventory" :key="item.name">
          <p>{{ item.name }}</p>
          <h3>{{ item.qty }}</h3>
          <small>{{ item.status }}</small>
        </div>
      </div>
    </section>

    <ModalDialog
      :show="showNode"
      title="新增供应链节点"
      confirm-text="创建节点"
      @close="showNode = false"
      @confirm="saveNode"
    >
      <div class="form-grid">
        <label>节点名称<input v-model="nodeForm.title" /></label>
        <label>执行时间<input v-model="nodeForm.time" /></label>
        <label>描述信息<textarea v-model="nodeForm.detail"></textarea></label>
      </div>
    </ModalDialog>

    <ModalDialog
      :show="!!activeNode"
      title="节点详情"
      confirm-text="关闭"
      @close="activeNode = null"
      @confirm="activeNode = null"
    >
      <p>节点：{{ activeNode?.title }}</p>
      <p>时间：{{ activeNode?.time }}</p>
      <p>说明：{{ activeNode?.detail }}</p>
    </ModalDialog>

    <ModalDialog
      :show="showDispatch"
      title="调拨任务"
      confirm-text="继续执行"
      @close="showDispatch = false"
      @confirm="showDispatch = false"
    >
      <p>已为冷链车辆预留装载窗口，调拨单号 {{ dispatchCode }}。</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: dispatchProgress + '%' }"></div>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const nodes = ref([
  { id: 1, title: '产地收购', time: '08:30', detail: '完成 6 吨有机蔬菜收购' },
  { id: 2, title: '加工分级', time: '11:20', detail: '采用光学分拣剔除不良品' },
  { id: 3, title: '冷链装车', time: '14:00', detail: '冷链车辆完成预冷并装载' }
]);

const inventory = [
  { name: '冷藏库 #01', qty: '12 吨', status: '安全库存' },
  { name: '冷藏库 #02', qty: '3 吨', status: '需补货' },
  { name: '在途车辆', qty: '2 辆', status: '预计 4 小时到仓' }
];

const showNode = ref(false);
const nodeForm = reactive({ title: '', time: '', detail: '' });
const activeNode = ref(null);
const showDispatch = ref(false);
const dispatchProgress = ref(40);
const dispatchCode = ref('DB20240301001');

const openNode = () => {
  showNode.value = true;
};

const saveNode = () => {
  if (!nodeForm.title) return;
  nodes.value.push({ id: Date.now(), title: nodeForm.title, time: nodeForm.time || '待定', detail: nodeForm.detail });
  showNode.value = false;
  nodeForm.title = '';
  nodeForm.time = '';
  nodeForm.detail = '';
};

const showNodeInfo = (node) => {
  activeNode.value = node;
};

const dispatch = () => {
  showDispatch.value = true;
  dispatchProgress.value = 40;
  const timer = setInterval(() => {
    if (dispatchProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    dispatchProgress.value += 20;
  }, 500);
};
</script>

<style scoped>
.supply-chain {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
}

.panel {
  flex: 1 1 45%;
  background: #f8fafc;
  border-radius: 20px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.node {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.inventory-card {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.ghost {
  background: #ecfccb;
  color: #4d7c0f;
}

.secondary {
  background: #0ea5e9;
  color: #fff;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

textarea {
  min-height: 80px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
}

.progress-inner {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
}

@media (max-width: 1024px) {
  .panel {
    flex: 1 1 100%;
  }
}
</style>
