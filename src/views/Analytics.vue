<template>
  <section>
    <div class="page-header">
      <h2>Analytics & Visualization</h2>
      <button class="button">Download CSV</button>
    </div>
    <div class="card-grid">
      <div class="card">
        <h3>Waste Generation Trend</h3>
        <svg viewBox="0 0 300 160" width="100%" height="160">
          <polyline
            fill="rgba(59,130,246,0.15)"
            stroke="#2563eb"
            stroke-width="3"
            :points="points"
          />
        </svg>
      </div>
      <div class="card">
        <h3>Waste Composition</h3>
        <ul>
          <li v-for="segment in composition" :key="segment.label">
            {{ segment.label }} — {{ segment.value }}%
          </li>
        </ul>
      </div>
    </div>
    <div class="card" style="margin-top: 1.5rem;">
      <h3>Key Insights</h3>
      <ul>
        <li v-for="insight in insights" :key="insight">{{ insight }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const data = [60, 54, 70, 62, 75, 68, 80, 76];
const points = data.map((value, index) => `${(index / (data.length - 1)) * 280 + 10},${150 - value}`).join(' ');

const composition = [
  { label: 'Solvents', value: 42 },
  { label: 'Heavy Metals', value: 28 },
  { label: 'Acids/Bases', value: 18 },
  { label: 'Reactive Agents', value: 12 }
];

const insights = [
  'Solvent recycling reduced generation by 8% QoQ.',
  'Temperature excursions correlate with increased storage utilization.',
  'Transport delays mainly occur with third-party consolidation routes.'
];
</script>
