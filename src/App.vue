<template>
  <router-view />
</template>

<style>
:root {
  color-scheme: light;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --primary: #2f80ed;
  --primary-soft: #e9f2ff;
  --accent: #3dd598;
  --warning: #ffb020;
  --danger: #ff6b6b;
  --text: #1f2a37;
  --muted: #6b7280;
  --border: #e5e7eb;
  --bg: #f6f8fb;
  --card: #ffffff;
  --shadow: 0 12px 30px rgba(31, 42, 55, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

.card {
  background: var(--card);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(229, 231, 235, 0.7);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 12px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th,
.table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.table thead {
  background: #f9fbff;
}

.btn {
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(47, 128, 237, 0.18);
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-outline {
  background: #fff;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.btn-ghost {
  background: transparent;
  color: var(--muted);
}

.input,
.select,
.textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
}

.grid {
  display: grid;
  gap: 16px;
}

.flex {
  display: flex;
  gap: 16px;
}

@media (max-width: 960px) {
  .flex {
    flex-direction: column;
  }
}
</style>
