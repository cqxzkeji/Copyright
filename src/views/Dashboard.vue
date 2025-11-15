<template>
  <section>
    <div class="page-header">
      <div>
        <h2>Facility Dashboard</h2>
        <p>Live overview of hazardous waste handling and compliance KPIs.</p>
      </div>
      <button class="button">Export Summary</button>
    </div>
    <div class="card-grid">
      <div class="card" v-for="metric in metrics" :key="metric.label">
        <h3>{{ metric.label }}</h3>
        <p style="font-size: 2rem; margin: 0;">{{ metric.value }}</p>
        <small :style="{ color: metric.trend > 0 ? '#16a34a' : '#dc2626' }">
          {{ metric.trend > 0 ? '▲' : '▼' }} {{ Math.abs(metric.trend) }}% vs last month
        </small>
      </div>
    </div>
    <div class="card" style="margin-top: 1.5rem;">
      <h3>Upcoming Compliance Milestones</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Requirement</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in milestones" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.due }}</td>
            <td><span class="status-chip" :class="item.color">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
const metrics = [
  { label: 'Active Waste Streams', value: 18, trend: 4.1 },
  { label: 'Pending Transfers', value: 6, trend: -2.5 },
  { label: 'Storage Utilization', value: '72%', trend: 1.2 },
  { label: 'Incidents YTD', value: 0, trend: -100 }
];

const milestones = [
  { name: 'EPA Biennial Report', due: '2024-07-31', status: 'On Track', color: 'green' },
  { name: 'Manifest Reconciliation', due: '2024-06-15', status: 'Review', color: 'orange' },
  { name: 'Facility Audit', due: '2024-08-12', status: 'Scheduled', color: 'green' }
];
</script>
