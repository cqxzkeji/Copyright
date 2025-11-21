<template>
  <div class="module-shell">
    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>交易撮合</h2>
          <p>挂单实时同步到交易大厅</p>
        </div>
        <button @click="createOrder">发布挂牌</button>
      </header>
      <table class="order-table">
        <thead>
          <tr>
            <th>作品</th>
            <th>类型</th>
            <th>报价</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.title">
            <td>{{ order.title }}</td>
            <td>{{ order.type }}</td>
            <td>{{ order.price }}</td>
            <td>{{ order.status }}</td>
            <td><button class="ghost" @click="() => inspect(order)">查看</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="panel">
      <header class="panel-header">
        <h2>转让流程</h2>
        <button @click="openChecklist">核验资料</button>
      </header>
      <div class="timeline">
        <div v-for="step in steps" :key="step.title" class="timeline-step">
          <div class="timeline-dot"></div>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
          <button @click="() => complete(step)">{{ step.action }}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const orders = [
  { title: '数字插画《流光》', type: '图片', price: '¥25,000', status: '意向沟通' },
  { title: '纪录片《海岸线》', type: '视频', price: '¥180,000', status: '合同审阅' },
  { title: '配乐《夏日记》', type: '音频', price: '¥38,000', status: '资金托管' }
];

const steps = [
  { title: '签署协议', desc: '线上完成三方签章', action: '签署' },
  { title: '资金托管', desc: '平台托管交易款项', action: '托管' },
  { title: '权利交割', desc: '链上凭证转移完成', action: '交割' }
];

function createOrder() {
  window.alert('挂牌指引已打开，请填写作品与报价。');
}

function inspect(order) {
  window.alert(`作品：${order.title}\n报价：${order.price}\n当前状态：${order.status}`);
}

function openChecklist() {
  window.alert('资料核验：请上传营业执照、授权书与付款凭证。');
}

function complete(step) {
  window.alert(`流程【${step.title}】已执行。`);
}
</script>

<style scoped>
.module-shell {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.panel {
  flex: 1 1 360px;
  background: rgba(249, 250, 251, 0.9);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table th,
.order-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #34d399;
}

.ghost {
  background: #0f172a;
}
</style>
