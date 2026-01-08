<template>
  <div class="chart-panel">
    <header>
      <h4>{{ title }}</h4>
      <p>{{ subtitle }}</p>
    </header>
    <svg viewBox="0 0 320 140" role="img" aria-label="chart">
      <defs>
        <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#7aa8ff" />
          <stop offset="100%" stop-color="#c9ddff" />
        </linearGradient>
      </defs>
      <rect
        v-for="(value, index) in values"
        :key="index"
        :x="20 + index * 45"
        :y="120 - value"
        width="28"
        :height="value"
        rx="6"
        fill="url(#barGradient)"
      />
      <line x1="10" y1="120" x2="310" y2="120" stroke="#d7e3ff" />
    </svg>
    <div class="legend">
      <span v-for="(label, index) in labels" :key="label">
        {{ label }} · {{ values[index] }}%
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  labels: {
    type: Array,
    default: () => [],
  },
  values: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.chart-panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 10px 30px rgba(18, 38, 63, 0.08);
}

header h4 {
  margin: 0 0 4px;
  color: #24335c;
}

header p {
  margin: 0 0 12px;
  color: #6d7aa8;
  font-size: 13px;
}

svg {
  width: 100%;
  height: 140px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #6673a3;
}
</style>
