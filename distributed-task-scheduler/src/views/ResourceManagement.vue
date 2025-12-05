<template>
  <div class="card">
    <div class="flex-between">
      <h2>资源管理</h2>
      <div class="actions">
        <button class="ghost" @click="openAllocate">分配资源</button>
        <button class="ghost" @click="openScale">弹性扩容</button>
      </div>
    </div>
    <div class="grid" style="margin-top: 10px">
      <div class="card" v-for="pool in pools" :key="pool.name">
        <div class="flex-between">
          <div>{{ pool.name }}</div>
          <span class="chip">{{ pool.type }}</span>
        </div>
        <p class="hint">可用 {{ pool.available }} / 总量 {{ pool.total }}</p>
        <div class="progress-bar">
          <div :style="{ width: `${pool.availablePercent}%` }"></div>
        </div>
        <button class="ghost" @click="selectPool(pool)">资源详情</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>节点</th>
          <th>CPU</th>
          <th>内存</th>
          <th>GPU</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="node in resources" :key="node.name">
          <td>{{ node.name }}</td>
          <td>{{ node.cpu }}%</td>
          <td>{{ node.memory }}%</td>
          <td>{{ node.gpu }}%</td>
          <td>
            <button class="ghost" @click="openThrottle(node)">限流</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showAllocate" class="modal-backdrop" @click.self="showAllocate = false">
    <div class="modal">
      <header>分配资源</header>
      <div class="body">
        <div class="input-row">
          <label>资源池</label>
          <select>
            <option>计算池</option>
            <option>GPU 池</option>
            <option>IO 池</option>
          </select>
        </div>
        <div class="input-row">
          <label>配额</label>
          <input type="number" min="1" value="5" />
        </div>
      </div>
      <div class="footer">
        <button @click="showAllocate = false">取消</button>
        <button @click="confirmAllocate">提交</button>
      </div>
    </div>
  </div>

  <div v-if="showScale" class="modal-backdrop" @click.self="showScale = false">
    <div class="modal">
      <header>弹性扩容</header>
      <div class="body">
        <p>为高峰期按需扩容节点，扩容后将自动回收。</p>
        <div class="progress-bar" style="margin-top: 10px">
          <div :style="{ width: `${scaleProgress}%` }"></div>
        </div>
      </div>
      <div class="footer">
        <button @click="showScale = false">完成</button>
      </div>
    </div>
  </div>

  <div v-if="showPool" class="modal-backdrop" @click.self="showPool = false">
    <div class="modal">
      <header>{{ currentPool?.name }} 详情</header>
      <div class="body">
        <p>类型：{{ currentPool?.type }}，可用 {{ currentPool?.available }} / {{ currentPool?.total }}</p>
        <p>策略：{{ currentPool?.policy }}</p>
      </div>
      <div class="footer">
        <button @click="showPool = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showThrottleModal" class="modal-backdrop" @click.self="showThrottleModal = false">
    <div class="modal">
      <header>节点限流：{{ throttleNode?.name }}</header>
      <div class="body">
        <div class="input-row">
          <label>CPU 上限 (%)</label>
          <input type="number" min="10" max="100" v-model.number="throttle.cpu" />
        </div>
        <div class="input-row">
          <label>内存上限 (%)</label>
          <input type="number" min="10" max="100" v-model.number="throttle.memory" />
        </div>
      </div>
      <div class="footer">
        <button @click="showThrottleModal = false">取消</button>
        <button @click="saveThrottle">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const pools = reactive([
  { name: '计算池', type: 'CPU', available: 42, total: 60, policy: '按需分配', availablePercent: 70 },
  { name: 'GPU 池', type: 'GPU', available: 18, total: 24, policy: '高优先级保障', availablePercent: 75 },
  { name: 'IO 池', type: 'IO', available: 55, total: 80, policy: '吞吐优先', availablePercent: 69 },
  { name: '缓存池', type: 'MEM', available: 68, total: 90, policy: '热点优先', availablePercent: 76 },
]);

const resources = reactive([
  { name: '节点 A', cpu: 72, memory: 64, gpu: 40 },
  { name: '节点 B', cpu: 58, memory: 70, gpu: 0 },
  { name: '节点 C', cpu: 81, memory: 55, gpu: 67 },
  { name: '节点 D', cpu: 45, memory: 52, gpu: 0 },
  { name: '节点 E', cpu: 63, memory: 71, gpu: 33 },
  { name: '节点 F', cpu: 39, memory: 48, gpu: 0 },
  { name: '节点 G', cpu: 77, memory: 83, gpu: 52 },
  { name: '节点 H', cpu: 50, memory: 43, gpu: 0 },
  { name: '节点 I', cpu: 68, memory: 65, gpu: 40 },
  { name: '节点 J', cpu: 55, memory: 58, gpu: 28 },
]);

const showAllocate = ref(false);
const showScale = ref(false);
const showPool = ref(false);
const showThrottleModal = ref(false);
const scaleProgress = ref(30);
const currentPool = ref(null);
const throttleNode = ref(null);
const throttle = reactive({ cpu: 60, memory: 60 });

const openAllocate = () => {
  showAllocate.value = true;
};

const confirmAllocate = () => {
  showAllocate.value = false;
};

const openScale = () => {
  showScale.value = true;
  scaleProgress.value = 30;
  setTimeout(() => (scaleProgress.value = 95), 800);
};

const selectPool = (pool) => {
  currentPool.value = pool;
  showPool.value = true;
};

const openThrottle = (node) => {
  throttleNode.value = node;
  throttle.cpu = node.cpu;
  throttle.memory = node.memory;
  showThrottleModal.value = true;
};

const saveThrottle = () => {
  showThrottleModal.value = false;
};
</script>

<style scoped>
h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.hint {
  color: #6a7a8b;
  margin: 4px 0;
}
</style>
