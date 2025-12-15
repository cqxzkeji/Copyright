<template>
  <div class="card chart">
    <div class="flex-between">
      <div>
        <h3>{{ title }}</h3>
        <p class="muted">{{ subtitle }}</p>
      </div>
      <button class="ghost" @click="openModal">查看明细</button>
    </div>
    <div class="bars">
      <div
        v-for="item in data"
        :key="item.label"
        class="bar"
        :style="{ height: `${item.value}%`, background: item.color }"
      >
        <span class="tooltip">{{ item.label }}：{{ item.value }}%</span>
      </div>
    </div>
    <div class="tag-row">
      <span class="mini-tag" v-for="item in data" :key="item.label" :style="{ background: `${item.color}22`, color: item.color }">
        {{ item.label }}
      </span>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>指标明细</h3>
          <button class="ghost" @click="showModal = false">关闭</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>指标</th>
              <th>数值</th>
              <th>趋势说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ item.value }}%</td>
              <td>{{ item.desc }}</td>
            </tr>
          </tbody>
        </table>
        <div class="modal-actions">
          <button @click="showModal = false">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  title: String,
  subtitle: String,
  data: {
    type: Array,
    default: () => []
  }
});

const showModal = ref(false);
const openModal = () => {
  showModal.value = true;
};
</script>

<style scoped>
.chart h3 { margin: 0; }
.chart .muted {
  color: var(--muted);
  margin: 4px 0 12px;
  font-size: 13px;
}

.bars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  align-items: end;
  gap: 12px;
  height: 220px;
  padding: 10px 0 4px;
}

.bar {
  position: relative;
  border-radius: 10px 10px 6px 6px;
  transition: transform 0.2s ease;
}

.bar:hover { transform: translateY(-4px); }

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, -6px);
  background: #111827;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  white-space: nowrap;
}

.mini-tag {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
}
</style>
