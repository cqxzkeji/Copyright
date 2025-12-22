<template>
  <div class="module">
    <section class="actions">
      <button class="primary" type="button" @click="showForm = true">新增用户权限</button>
      <button class="secondary" type="button" @click="openProgress">生成统计报告</button>
      <button class="ghost" type="button" @click="showTip = true">权限提示</button>
    </section>

    <div class="grid">
      <BarChart title="活跃用户访问量" :labels="chartLabels" :values="chartValues" />
      <div class="card">
        <h3>用户权限与统计</h3>
        <table>
          <thead>
            <tr>
              <th>用户</th>
              <th>角色</th>
              <th>部门</th>
              <th>作业数</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.name">
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.team }}</td>
              <td>{{ user.jobs }}</td>
              <td><span :class="['tag', user.status === '启用' ? 'ok' : 'warn']">{{ user.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal :open="showForm" title="新增用户权限" @close="showForm = false">
      <form class="form" @submit.prevent="submitUser">
        <label>用户名称<input v-model="form.name" required placeholder="王某某" /></label>
        <label>角色<input v-model="form.role" required placeholder="管理员/科研用户" /></label>
        <label>部门<input v-model="form.team" required placeholder="计算中心" /></label>
        <label>访问级别<input v-model="form.level" required placeholder="L1/L2/L3" /></label>
        <button class="primary" type="submit">保存</button>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="统计报告生成中" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>报告生成 {{ progress }}%，完成后自动推送。</p>
    </BaseModal>

    <BaseModal :open="showTip" title="权限提示" @close="showTip = false">
      <ul class="tips">
        <li>建议定期核查过期账号。</li>
        <li>高权限操作需开启双因素认证。</li>
        <li>统计报告支持导出 CSV。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import BarChart from "../components/BarChart.vue";

const chartLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const chartValues = [120, 140, 132, 150, 128, 160, 148, 138, 155, 142];

const users = ref([
  { name: "赵远", role: "管理员", team: "系统运维", jobs: 32, status: "启用" },
  { name: "李晴", role: "科研用户", team: "材料学院", jobs: 18, status: "启用" },
  { name: "陈浩", role: "科研用户", team: "生物信息", jobs: 24, status: "启用" },
  { name: "孙悦", role: "访客", team: "外协", jobs: 3, status: "停用" },
  { name: "周颖", role: "科研用户", team: "物理学院", jobs: 15, status: "启用" },
  { name: "王哲", role: "管理员", team: "计算中心", jobs: 28, status: "启用" },
  { name: "郑航", role: "科研用户", team: "化学学院", jobs: 21, status: "启用" },
  { name: "郭敏", role: "运维", team: "系统运维", jobs: 12, status: "启用" },
  { name: "刘硕", role: "科研用户", team: "地球科学", jobs: 17, status: "启用" },
  { name: "黄宁", role: "访客", team: "合作单位", jobs: 5, status: "停用" }
]);

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
const form = ref({
  name: "",
  role: "",
  team: "",
  level: ""
});

let progressTimer;

const submitUser = () => {
  users.value.unshift({
    name: form.value.name,
    role: form.value.role,
    team: form.value.team,
    jobs: 0,
    status: "启用"
  });
  showForm.value = false;
  form.value = { name: "", role: "", team: "", level: "" };
};

const openProgress = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    progress.value += 11;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(progressTimer);
    }
  }, 260);
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary,
.secondary,
.ghost {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e0f2fe;
  color: #1d4ed8;
}

.ghost {
  border: 1px solid #cbd5f5;
  background: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

h3 {
  margin: 0 0 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
 td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ok {
  background: #dcfce7;
  color: #166534;
}

.tag.warn {
  background: #fee2e2;
  color: #b91c1c;
}

.form {
  display: grid;
  gap: 12px;
}

.form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.form input {
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  padding: 8px 10px;
}

.progress {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  transition: width 0.2s ease;
}

.tips {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}
</style>
