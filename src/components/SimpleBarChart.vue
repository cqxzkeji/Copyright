<template>
  <div class="chart">
    <div class="item" v-for="(item, i) in data" :key="i">
      <div class="bar" :style="{ height: item.value + '%' }" :title="`${item.name}: ${item.value}`"></div>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ data: { type: Array, default: () => [] } })
</script>

<style scoped>
.chart { height: 220px; display: flex; align-items: end; gap: 10px; padding: 8px; border-radius: 10px; background: #f8fbff; }
.item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.bar { width: 70%; min-height: 10px; border-radius: 8px 8px 0 0; background: linear-gradient(180deg,#93c5fd,#3b82f6); }
span { font-size: 12px; color: #334155; }
</style>
