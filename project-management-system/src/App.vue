<template>
  <router-view />
</template>

<style>
:root {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #1f2c4f;
  background: #f2f7ff;
}
* { box-sizing: border-box; }
body { margin: 0; background: linear-gradient(150deg, #f5f9ff, #ecf3ff); }
input, select, textarea { width: 100%; padding: 8px 10px; border: 1px solid #cdd9f3; border-radius: 8px; }
.table-wrap { overflow: auto; background: #fff; border-radius: 12px; padding: 10px; box-shadow: 0 6px 20px rgba(70,116,214,.12); }
table { width: 100%; min-width: 760px; border-collapse: collapse; }
th, td { padding: 10px; border-bottom: 1px solid #edf2ff; text-align: left; font-size: 14px; }
th { background: #f7faff; position: sticky; top: 0; }
.toolbar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.btn { border: none; background: #2d7ef7; color: #fff; padding: 8px 13px; border-radius: 8px; cursor: pointer; }
.btn.light { background: #e9f1ff; color: #32559b; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; }
.card { background: #fff; border-radius: 14px; box-shadow: 0 7px 22px rgba(73,117,199,.13); padding: 14px; }
.form-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
</style>
