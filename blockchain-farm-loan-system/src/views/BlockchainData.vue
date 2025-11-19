<template>
  <div class="module">
    <header>
      <div>
        <h2>区块链数据管理</h2>
        <p>监控链上事件、节点健康与同步状态</p>
      </div>
      <button @click="startAudit">触发数据审计</button>
    </header>

    <section class="events">
      <article v-for="event in store.blockchainEvents" :key="event.id" class="event">
        <div>
          <h3>{{ event.type }} · {{ event.time }}</h3>
          <p>哈希：{{ event.hash }}</p>
        </div>
        <button @click="inspect(event)">查看凭证</button>
      </article>
    </section>

    <div class="node-status">
      <div class="status-card" v-for="node in nodes" :key="node.name">
        <h4>{{ node.name }}</h4>
        <p>延迟：{{ node.latency }}ms</p>
        <p>出块：{{ node.block }} 区块</p>
        <button @click="ping(node)">Ping 节点</button>
      </div>
    </div>

    <div v-if="modal.show" class="modal-mask" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <div v-if="modal.progress !== undefined" class="progress">
          <div class="bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
        <button @click="closeModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const store = inject('store');
const nodes = reactive([
  { name: '冀南节点', latency: 89, block: 18293 },
  { name: '豫中节点', latency: 102, block: 18292 },
  { name: '云链备份', latency: 76, block: 18290 }
]);

const modal = reactive({ show: false, title: '', message: '', progress: undefined });
let timer;

function closeModal() {
  modal.show = false;
  modal.progress = undefined;
  clearInterval(timer);
}

function inspect(event) {
  modal.show = true;
  modal.title = '链上凭证';
  modal.message = `${event.type} 事件哈希 ${event.hash} 已经验证通过`;
}

function ping(node) {
  modal.show = true;
  modal.title = '节点诊断';
  modal.message = `${node.name} 延迟 ${node.latency}ms，正在执行连通性测试...`;
}

function startAudit() {
  modal.show = true;
  modal.title = '数据审计';
  modal.message = '正在对 128 条交易执行 Merkle 校验';
  modal.progress = 5;
  clearInterval(timer);
  timer = setInterval(() => {
    if (modal.progress >= 100) {
      modal.message = '审计完成，未发现异常';
      clearInterval(timer);
      return;
    }
    modal.progress += 15;
  }, 400);
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

button {
  border: none;
  border-radius: 12px;
  padding: 0.6rem 1rem;
  background: linear-gradient(120deg, #8e9aaf, #5e60ce);
  color: #fff;
  cursor: pointer;
}

.events {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.event {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: #edf2fb;
  border-radius: 14px;
  padding: 1rem;
  gap: 0.6rem;
}

.node-status {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.status-card {
  flex: 1 1 200px;
  background: #fff;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(94, 96, 206, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: min(420px, 90vw);
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress {
  height: 10px;
  background: #dfe7fd;
  border-radius: 999px;
}

.progress .bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(120deg, #48cae4, #0077b6);
  transition: width 0.3s ease;
}
</style>
