<template>
  <RouterView />
</template>

<style>
:root {
  font-family: "Segoe UI", "PingFang SC", "Microsoft Yahei", sans-serif;
  color: #1f2a44;
  background: #f5f7fb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f5f7fb;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e6e9f4;
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar .logo {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #3b5bfd;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  color: #52607a;
  transition: all 0.2s ease;
}

.nav-item.router-link-active {
  background: #eef1ff;
  color: #3b5bfd;
  font-weight: 600;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  background: #ffffff;
  border-bottom: 1px solid #e6e9f4;
}

.topbar h1 {
  font-size: 20px;
  margin: 0;
}

.topbar .user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #52607a;
}

.page {
  padding: 24px 28px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(15, 31, 64, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.card-header h2 {
  font-size: 18px;
  margin: 0;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button.primary {
  background: #3b5bfd;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

button.secondary {
  background: #eef1ff;
  color: #3b5bfd;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

button.text {
  background: transparent;
  border: none;
  color: #3b5bfd;
  cursor: pointer;
  padding: 6px 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 10px;
  border-bottom: 1px solid #eef1f6;
  text-align: left;
}

.table th {
  color: #7b879a;
  font-weight: 600;
}

.badge {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 999px;
  background: #eef7ff;
  color: #3b5bfd;
  font-size: 12px;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 31, 64, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: min(520px, 92vw);
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 31, 64, 0.16);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d7ddea;
  background: #f9fbff;
}

.progress-bar {
  height: 10px;
  background: #eef1ff;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #3b5bfd, #6ea8ff);
}

@media (max-width: 900px) {
  .sidebar {
    display: none;
  }

  .topbar {
    padding: 16px;
  }

  .page {
    padding: 16px;
  }
}
</style>
