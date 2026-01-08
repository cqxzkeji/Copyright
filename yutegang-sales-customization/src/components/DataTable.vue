<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.table-wrapper {
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 10px 30px rgba(18, 38, 63, 0.08);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #eef2ff;
  white-space: nowrap;
}

thead th {
  background: #f3f6ff;
  color: #283b6b;
  font-weight: 600;
}

tbody tr:hover {
  background: #f7faff;
}
</style>
