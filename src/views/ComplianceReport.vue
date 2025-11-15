<template>
  <section>
    <div class="page-header">
      <h2>Compliance & Regulatory Reporting</h2>
      <button class="button">Generate PDF</button>
    </div>
    <div class="card">
      <h3>Reporting Checklist</h3>
      <ul>
        <li v-for="item in checklist" :key="item.label">
          <label>
            <input type="checkbox" v-model="item.complete" />
            {{ item.label }}
          </label>
        </li>
      </ul>
    </div>
    <div class="card" style="margin-top: 1.5rem;">
      <h3>Submission History</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Report</th>
            <th>Submitted</th>
            <th>Confirmation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.name">
            <td>{{ report.name }}</td>
            <td>{{ report.date }}</td>
            <td>{{ report.confirmation }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue';

const checklist = reactive([
  { label: 'RCRA Hazardous Waste Manifest review', complete: false },
  { label: 'Biennial report data validated', complete: true },
  { label: 'Training records updated', complete: true },
  { label: 'Universal waste log uploaded', complete: false }
]);

const reports = [
  { name: 'Biennial Report 2022', date: '2023-02-15', confirmation: '#BR-2215' },
  { name: 'Quarterly Emissions Q1', date: '2024-04-07', confirmation: '#QE-0407' },
  { name: 'Tier II Inventory', date: '2024-03-01', confirmation: '#T2-0301' }
];
</script>
