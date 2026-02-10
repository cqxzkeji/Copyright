<template>
  <router-view />
</template>

<style>
:root {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #1f2d49;
  background: #f6f9ff;
}
* { box-sizing: border-box; }
body { margin: 0; background: linear-gradient(180deg, #f7fbff 0%, #f2f7ff 100%); }
button { cursor: pointer; }
.btn { border: 1px solid #4d80ff; background:#4d80ff; color:#fff; padding:8px 12px; border-radius:8px; }
.btn.secondary { background:#fff; color:#4d80ff; }
.input, select, textarea { width:100%; padding:10px; border:1px solid #ccd8ef; border-radius:8px; }
.table { width:100%; border-collapse: collapse; font-size: 13px; }
.table th,.table td{ border-bottom:1px solid #edf2fc; padding: 10px; text-align:left; }
.card { background:#fff; border-radius:14px; box-shadow: 0 6px 24px rgba(27,57,125,.08); padding:16px; }
.grid2 { display:grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap:16px; }
</style>
