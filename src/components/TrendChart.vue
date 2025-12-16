<template>
  <div class="card" style="padding: 16px;">
    <header class="topbar" style="margin-bottom: 10px;">
      <div>
        <h3 style="font-size: 18px;">{{ title }}</h3>
        <p style="color: var(--muted); font-size: 14px;">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </header>
    <div style="display: grid; gap: 10px;">
      <div v-for="item in series" :key="item.label" style="display: grid; grid-template-columns: 120px 1fr 60px; align-items: center; gap: 8px;">
        <div style="font-weight: 600;">{{ item.label }}</div>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: item.value + '%' }"></div>
        </div>
        <div style="text-align: right; color: var(--muted);">{{ item.value }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  series: Array
});
</script>
