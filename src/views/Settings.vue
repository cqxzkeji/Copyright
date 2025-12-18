<template>
  <section class="module">
    <div class="section-header">
      <div>
        <h3>系统配置与权限管理</h3>
        <p class="muted">管理角色、菜单权限与接口密钥，保持协同安全。</p>
      </div>
      <div class="section-actions">
        <button class="btn" @click="showRole = true">新增角色</button>
        <button class="btn secondary" @click="showSync = true">同步配置</button>
        <button class="btn outline" @click="showHint = true">安全提示</button>
      </div>
    </div>

    <div class="grid two">
      <div class="table-card">
        <div class="table-head">
          <h4>角色与权限</h4>
          <small class="muted">覆盖 10 个协同角色</small>
        </div>
        <table>
          <thead>
            <tr>
              <th>角色</th>
              <th>说明</th>
              <th>数据范围</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.name">
              <td>{{ role.name }}</td>
              <td>{{ role.desc }}</td>
              <td>{{ role.scope }}</td>
              <td :class="role.statusColor">{{ role.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-card">
        <div class="table-head">
          <h4>接口密钥状态</h4>
          <small class="muted">接口调用安全性</small>
        </div>
        <Bar :data="keyData" :options="barOptions" />
      </div>
    </div>
  </section>

  <div v-if="showRole" class="modal-overlay" @click.self="showRole = false">
    <div class="modal">
      <h3>新增角色</h3>
      <form @submit.prevent="submitRole">
        <label>角色名称<input v-model="roleForm.name" required /></label>
        <label>描述<textarea v-model="roleForm.desc" rows="3"></textarea></label>
        <label>数据范围<select v-model="roleForm.scope"><option>全域</option><option>仓储</option><option>采购</option><option>物流</option></select></label>
        <div class="actions">
          <button class="btn outline" type="button" @click="showRole = false">取消</button>
          <button class="btn" type="submit">创建</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showSync" class="modal-overlay" @click.self="showSync = false">
    <div class="modal">
      <h3>配置同步</h3>
      <p>正在同步菜单、API 权限与租户配置。</p>
      <div class="progress"><div class="bar" style="width: 70%"></div></div>
      <div class="actions">
        <button class="btn" @click="showSync = false">完成</button>
      </div>
    </div>
  </div>

  <div v-if="showHint" class="modal-overlay" @click.self="showHint = false">
    <div class="modal">
      <h3>安全提示</h3>
      <p>建议每 30 天轮换一次密钥，并开启两步验证。</p>
      <div class="actions">
        <button class="btn" @click="showHint = false">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const roles = ref([
  { name: '系统管理员', desc: '全局配置、租户治理', scope: '全域', status: '启用', statusColor: 'status-green' },
  { name: '采购经理', desc: '采购计划、供应商管理', scope: '采购', status: '启用', statusColor: 'status-green' },
  { name: '订单运营', desc: '订单履约跟踪、异常处理', scope: '采购', status: '启用', statusColor: 'status-green' },
  { name: '仓库主管', desc: '仓容管理、入出库审核', scope: '仓储', status: '启用', statusColor: 'status-green' },
  { name: '质检专员', desc: '质检标准、破损追溯', scope: '仓储', status: '启用', statusColor: 'status-green' },
  { name: '调度员', desc: '车辆调度、在途监控', scope: '物流', status: '启用', statusColor: 'status-green' },
  { name: '财务对账', desc: '费用核对、账单导出', scope: '全域', status: '启用', statusColor: 'status-green' },
  { name: '分析专员', desc: '数据看板、指标维护', scope: '全域', status: '启用', statusColor: 'status-green' },
  { name: '供应商协同', desc: '产销计划共享、对账', scope: '采购', status: '启用', statusColor: 'status-green' },
  { name: '安全审计', desc: '操作审计、密钥轮换', scope: '全域', status: '启用', statusColor: 'status-green' },
]);

const keyData = ref({
  labels: ['活跃密钥', '即将到期', '已过期'],
  datasets: [
    {
      label: '数量',
      data: [18, 4, 2],
      backgroundColor: ['#3a86ff', '#ffbe0b', '#ef476f'],
      borderRadius: 10,
    },
  ],
});

const barOptions = ref({
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { ticks: { color: '#6b7280' }, grid: { color: '#e5e7eb' } }, x: { ticks: { color: '#6b7280' }, grid: { display: false } } },
});

const showRole = ref(false);
const showSync = ref(false);
const showHint = ref(false);
const roleForm = ref({ name: '', desc: '', scope: '全域' });

const submitRole = () => {
  showRole.value = false;
  alert('已创建角色：' + roleForm.value.name);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.muted {
  color: var(--muted);
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.progress {
  background: #f3f4f6;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-top: 12px;
}

.bar {
  height: 100%;
  background: linear-gradient(135deg, #3a86ff, #8338ec);
}
</style>
