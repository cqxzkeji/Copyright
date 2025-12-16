<template>
  <div class="card" style="padding: 16px;">
    <header class="topbar">
      <div>
        <h3 style="font-size: 18px;">{{ title }}</h3>
        <p style="color: var(--muted); font-size: 14px;">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </header>
    <div style="overflow-x: auto;">
      <table class="table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td v-for="col in columns" :key="col.key">
              <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  columns: Array,
  rows: Array
});
</script>
