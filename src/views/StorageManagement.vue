<template>
  <section>
    <div class="page-header">
      <h2>Storage & Inventory Monitoring</h2>
      <button class="button">Run Inspection Checklist</button>
    </div>
    <div class="card-grid">
      <div class="card">
        <h3>Storage Capacity</h3>
        <p style="font-size: 2rem; margin: 0;">{{ usedCapacity }} / 100 m³</p>
        <progress :value="usedCapacity" max="100" style="width: 100%; height: 12px;"></progress>
      </div>
      <div class="card">
        <h3>Temperature Alerts</h3>
        <p>{{ alerts.length }} sensors reporting deviations</p>
        <ul>
          <li v-for="alert in alerts" :key="alert.id">{{ alert.label }} — {{ alert.value }}°C</li>
        </ul>
      </div>
    </div>
    <div class="card" style="margin-top: 1.5rem;">
      <h3>Inventory by Zone</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Zone</th>
            <th>Material</th>
            <th>Volume</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="zone in zones" :key="zone.name">
            <td>{{ zone.name }}</td>
            <td>{{ zone.material }}</td>
            <td>{{ zone.volume }} m³</td>
            <td><span class="status-chip" :class="zone.color">{{ zone.condition }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
const usedCapacity = 72;
const alerts = [
  { id: 1, label: 'Drum vault sensor #03', value: 36 },
  { id: 2, label: 'Cold room #02', value: 2 }
];
const zones = [
  { name: 'Zone A1', material: 'Corrosives', volume: 18, condition: 'Stable', color: 'green' },
  { name: 'Zone B2', material: 'Oxidizers', volume: 22, condition: 'Monitor', color: 'orange' },
  { name: 'Zone C4', material: 'Spent catalysts', volume: 12, condition: 'Stable', color: 'green' }
];
</script>
