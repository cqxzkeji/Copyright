<template>
  <div class="module-shell">
    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>授权策略</h2>
          <p>根据场景生成对应合同条款</p>
        </div>
        <button @click="generateContract">生成合同</button>
      </header>
      <form class="flex-form" @submit.prevent="previewLicense">
        <label>
          授权方
          <input v-model="form.licensor" placeholder="智象音乐" required />
        </label>
        <label>
          被授权方
          <input v-model="form.licensee" placeholder="声浪科技" required />
        </label>
        <label>
          使用范围
          <select v-model="form.scope">
            <option value="全球">全球</option>
            <option value="大中华区">大中华区</option>
            <option value="线上平台">线上平台</option>
          </select>
        </label>
        <label>
          有效期（月）
          <input type="number" min="1" v-model.number="form.term" />
        </label>
        <div class="actions">
          <button type="submit">预览授权摘要</button>
          <button type="button" class="secondary" @click="openReminder">到期提醒</button>
        </div>
      </form>
    </section>

    <section class="panel">
      <header class="panel-header">
        <h2>授权套餐</h2>
        <button @click="addPackage">新增套餐</button>
      </header>
      <div class="package-grid">
        <article v-for="item in packages" :key="item.name" class="package-card">
          <h3>{{ item.name }}</h3>
          <p class="price">¥{{ item.price }}/年</p>
          <ul>
            <li v-for="feature in item.features" :key="feature">{{ feature }}</li>
          </ul>
          <button class="ghost" @click="() => selectPackage(item)">选择</button>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
  licensor: '',
  licensee: '',
  scope: '全球',
  term: 12
});

const packages = [
  { name: '基础发行', price: '18,000', features: ['单一平台', '月度报表', '版权备案'] },
  { name: '全网推广', price: '56,000', features: ['全渠道投放', '一键下架', '联名运营'] },
  { name: '高级定制', price: '98,000', features: ['专属法务', '离线授权', '收益拆账'] }
];

function previewLicense() {
  window.alert(`授权方：${form.licensor}\n被授权方：${form.licensee}\n范围：${form.scope}\n有效期：${form.term} 个月`);
}

function openReminder() {
  window.alert('已开启到期提醒，系统将在期满前 30 天短信通知。');
}

function generateContract() {
  window.alert('AI 合同助手已整理条款草稿。');
}

function addPackage() {
  window.alert('请在后台配置新的套餐模板。');
}

function selectPackage(item) {
  window.alert(`已选择【${item.name}】，将在授权摘要中体现。`);
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

.package-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.package-card {
  flex: 1 1 200px;
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 15px 25px rgba(15, 23, 42, 0.1);
}

.package-card ul {
  padding-left: 1.25rem;
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.secondary {
  background: #f97316;
}

.price {
  font-size: 1.3rem;
  font-weight: 600;
}

.ghost {
  background: #111827;
  margin-top: auto;
}
</style>
