<template>
  <div class="chart-card">
    <h4>{{ title }}</h4>
    <div class="bars">
      <div v-for="(item, idx) in data" :key="idx" class="bar-item">
        <span>{{ item.label }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${item.value}%` }"></div>
        </div>
        <b>{{ item.value }}%</b>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  data: Array
})
</script>
