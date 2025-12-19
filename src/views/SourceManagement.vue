<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>产地批次概览</h3>
        <p>整合农户、地块与采收记录，支持快速核验。</p>
      </div>
      <div class="actions">
        <button @click="showForm = true">新增产地</button>
        <button @click="showProgress = true">采收进度</button>
        <button @click="showInfo = true">提醒信息</button>
      </div>
    </div>

    <div class="media-grid">
      <div class="card">
        <h4>地块图像</h4>
        <img src="/src/assets/field.svg" alt="地块示意" />
        <p>实时卫星图与传感器数据绑定。</p>
      </div>
      <div class="card">
        <h4>产地巡检趋势</h4>
        <svg viewBox="0 0 320 160" aria-label="产地巡检趋势">
          <polyline
            fill="none"
            stroke="#2563eb"
            stroke-width="4"
            points="10,120 50,90 90,110 130,70 170,60 210,80 250,40 290,50"
          />
          <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="4" fill="#22c55e" />
        </svg>
        <p>巡检次数本月提升 12%。</p>
      </div>
    </div>

    <div class="table-card">
      <h4>源头批次列表</h4>
      <table>
        <thead>
          <tr>
            <th>批次号</th>
            <th>基地</th>
            <th>品类</th>
            <th>采收日期</th>
            <th>负责人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in batches" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.farm }}</td>
            <td>{{ item.crop }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.manager }}</td>
            <td><span class="status">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="showForm" title="新增产地档案" @close="showForm = false">
      <form class="form-grid">
        <label>
          基地名称
          <input type="text" placeholder="请输入基地名称" />
        </label>
        <label>
          负责人
          <input type="text" placeholder="请输入负责人" />
        </label>
        <label>
          主要品类
          <input type="text" placeholder="如：有机番茄" />
        </label>
        <label>
          认证级别
          <select>
            <option>绿色认证</option>
            <option>有机认证</option>
            <option>地理标志</option>
          </select>
        </label>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="采收进度追踪" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>今日计划采收 18 吨，已完成 {{ progress }}%。</p>
    </BaseModal>

    <BaseModal :open="showInfo" title="产地提醒" @close="showInfo = false">
      <p>建议明日 08:00 前完成温湿度采样，系统已自动派发任务。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(72);

const points = [
  { x: 10, y: 120 },
  { x: 50, y: 90 },
  { x: 90, y: 110 },
  { x: 130, y: 70 },
  { x: 170, y: 60 },
  { x: 210, y: 80 },
  { x: 250, y: 40 },
  { x: 290, y: 50 }
];

const batches = [
  { id: 'SC-2401', farm: '清源基地', crop: '有机黄瓜', date: '2024-06-01', manager: '陈林', status: '已登记' },
  { id: 'SC-2402', farm: '绿野基地', crop: '鲜食玉米', date: '2024-06-02', manager: '李娜', status: '采收中' },
  { id: 'SC-2403', farm: '晴川基地', crop: '苹果', date: '2024-06-03', manager: '周雅', status: '已登记' },
  { id: 'SC-2404', farm: '丰源基地', crop: '草莓', date: '2024-06-04', manager: '王磊', status: '待巡检' },
  { id: 'SC-2405', farm: '金穗基地', crop: '生菜', date: '2024-06-05', manager: '赵晴', status: '采收中' },
  { id: 'SC-2406', farm: '星河基地', crop: '西蓝花', date: '2024-06-06', manager: '韩涛', status: '已登记' },
  { id: 'SC-2407', farm: '雨润基地', crop: '芦笋', date: '2024-06-07', manager: '蒋静', status: '已登记' },
  { id: 'SC-2408', farm: '祥和基地', crop: '青椒', date: '2024-06-08', manager: '许宁', status: '待巡检' },
  { id: 'SC-2409', farm: '沃土基地', crop: '胡萝卜', date: '2024-06-09', manager: '唐悦', status: '已登记' },
  { id: 'SC-2410', farm: '恒丰基地', crop: '葡萄', date: '2024-06-10', manager: '徐晨', status: '采收中' },
  { id: 'SC-2411', farm: '南湖基地', crop: '藜麦', date: '2024-06-11', manager: '罗珊', status: '已登记' },
  { id: 'SC-2412', farm: '锦田基地', crop: '蓝莓', date: '2024-06-12', manager: '孙凯', status: '待巡检' }
];
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header h3 {
  margin: 0 0 4px;
}

.module-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  border: none;
  background: #e0f2fe;
  color: #0369a1;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
}

.card img {
  width: 100%;
  border-radius: 12px;
  margin: 10px 0;
}

.card svg {
  width: 100%;
  height: 160px;
  background: #ffffff;
  border-radius: 12px;
  margin: 10px 0;
}

.table-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-card th,
.table-card td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  background: #dcfce7;
  color: #15803d;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
}
</style>
