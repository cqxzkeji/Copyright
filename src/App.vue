<template>
  <router-view />
</template>

<style>
*{box-sizing:border-box} body{margin:0;font-family:Inter,"PingFang SC","Microsoft Yahei",sans-serif;background:#f4f8ff;color:#1f2937}
input,select,textarea{width:100%;padding:8px 10px;border:1px solid #d7e1f8;border-radius:8px;background:#fff}
button{font:inherit}
.table-wrap{overflow:auto}
table{width:100%;border-collapse:collapse;background:#fff}
th,td{padding:10px;border-bottom:1px solid #edf2ff;text-align:left;white-space:nowrap}
.card{background:#fff;border-radius:14px;padding:14px;box-shadow:0 4px 16px rgba(29,78,216,.08)}
.btn{border:none;background:#dbeafe;color:#1e3a8a;padding:8px 12px;border-radius:8px;cursor:pointer}
.btn.primary{background:#2563eb;color:#fff}
.btn + .btn{margin-left:8px}
.grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
</style>
