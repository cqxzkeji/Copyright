<template>
  <div class="page">
    <div class="grid two">
      <div class="card">
        <div class="section-title">库区温湿度监测</div>
        <div class="hero-image">智能仓储环境监控</div>
      </div>
      <div class="card">
        <div class="section-title">库存周转趋势</div>
        <div class="chart-bars">
          <div v-for="bar in chartData" :key="bar.name" class="bar" :style="{ height: bar.value + '%' }">
            {{ bar.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">库存明细表</div>
      <table class="table">
        <thead>
          <tr>
            <th>仓库</th>
            <th>品类</th>
            <th>批次</th>
            <th>库存量(吨)</th>
            <th>保质期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventory" :key="item.batch">
            <td>{{ item.warehouse }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.batch }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.expire }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-title">出入库操作</div>
      <div class="grid three">
        <button class="primary-btn" @click="openForm">新增入库单</button>
        <button class="ghost-btn" @click="openProgress">出库拣货进度</button>
        <button class="ghost-btn" @click="openInfo">库存告警提示</button>
      </div>
    </div>

    <BaseModal v-if="showForm" title="新增入库单" @close="showForm = false">
      <div class="input-group">
        <label>仓库</label>
        <input v-model="form.warehouse" placeholder="请输入仓库名称" />
      </div>
      <div class="input-group">
        <label>品类</label>
        <input v-model="form.category" placeholder="如：冷链蔬菜" />
      </div>
      <div class="input-group">
        <label>数量(吨)</label>
        <input v-model="form.quantity" placeholder="请输入数量" />
      </div>
      <div class="input-group">
        <label>入库类型</label>
        <select v-model="form.type">
          <option>采购入库</option>
          <option>调拨入库</option>
          <option>退货入库</option>
        </select>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showForm = false">取消</button>
        <button class="primary-btn" @click="submitForm">确认入库</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showProgress" title="出库拣货进度" @close="showProgress = false">
      <p>当前订单已完成 6/10 个拣货任务，预计 25 分钟完成。</p>
      <div class="progress-bar" style="margin-top: 12px;">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showProgress = false">关闭</button>
        <button class="primary-btn" @click="boostProgress">更新进度</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showInfo" title="库存告警提示" @close="showInfo = false">
      <p>冷链仓库 B2 库位库存周转低于 15 天，请优先安排出库。</p>
      <div class="actions">
        <button class="primary-btn" @click="showInfo = false">确认</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { name: '周一', value: 60 },
  { name: '周二', value: 75 },
  { name: '周三', value: 90 },
  { name: '周四', value: 65 },
  { name: '周五', value: 80 },
  { name: '周六', value: 55 },
  { name: '周日', value: 70 }
];

const inventory = [
  { warehouse: '华东一号仓', category: '大米', batch: 'RICE-2401', quantity: 120, expire: '2025-01-15', status: '正常' },
  { warehouse: '华北二号仓', category: '玉米', batch: 'CORN-2403', quantity: 98, expire: '2024-12-10', status: '正常' },
  { warehouse: '华南冷链仓', category: '叶菜', batch: 'VEG-2405', quantity: 35, expire: '2024-07-02', status: '需优先' },
  { warehouse: '西南山地仓', category: '土豆', batch: 'POT-2406', quantity: 76, expire: '2024-11-20', status: '正常' },
  { warehouse: '华中中心仓', category: '柑橘', batch: 'CIT-2402', quantity: 64, expire: '2024-09-10', status: '正常' },
  { warehouse: '东北粮储仓', category: '大豆', batch: 'SOY-2404', quantity: 130, expire: '2025-02-18', status: '正常' },
  { warehouse: '华东一号仓', category: '草莓', batch: 'STR-2402', quantity: 22, expire: '2024-06-28', status: '需优先' },
  { warehouse: '华北二号仓', category: '花生', batch: 'PEA-2401', quantity: 58, expire: '2024-10-05', status: '正常' },
  { warehouse: '西北中心仓', category: '枸杞', batch: 'GOJ-2405', quantity: 44, expire: '2025-03-12', status: '正常' },
  { warehouse: '华南冷链仓', category: '火龙果', batch: 'PIT-2407', quantity: 30, expire: '2024-07-15', status: '需优先' },
  { warehouse: '华中中心仓', category: '猪肉', batch: 'MEAT-2406', quantity: 52, expire: '2024-08-01', status: '正常' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(60);

const form = reactive({
  warehouse: '',
  category: '',
  quantity: '',
  type: '采购入库'
});

const openForm = () => {
  showForm.value = true;
};

const openProgress = () => {
  showProgress.value = true;
};

const openInfo = () => {
  showInfo.value = true;
};

const submitForm = () => {
  showForm.value = false;
};

const boostProgress = () => {
  progress.value = Math.min(100, progress.value + 15);
};
</script>
