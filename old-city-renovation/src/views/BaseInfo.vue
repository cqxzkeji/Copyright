<template>
  <div class="grid">
    <div class="section-title">
      <h2>基础信息台账</h2>
      <div class="actions">
        <button class="btn" @click="openModal('add')">新增建筑</button>
        <button class="btn secondary" @click="openModal('sync')">同步普查数据</button>
        <button class="btn secondary" @click="openModal('export')">导出台账</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="card">
        <p class="tip">建筑总量</p>
        <h3 style="margin: 4px 0;">{{ baseInfo.length }} 栋</h3>
        <div class="progress-bar"><span :style="{ width: '82%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">自来水/燃气覆盖</p>
        <h3 style="margin: 4px 0;">94% / 88%</h3>
        <div class="progress-bar"><span :style="{ width: '94%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">人口登记</p>
        <h3 style="margin: 4px 0;">12,430 人</h3>
        <div class="progress-bar"><span :style="{ width: '71%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">重点人群</p>
        <h3 style="margin: 4px 0;">老年 1,420 · 学龄 820</h3>
        <div class="progress-bar"><span :style="{ width: '62%' }"></span></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">
        <h3>建筑与设施一览</h3>
        <p class="tip">共 {{ baseInfo.length }} 条记录，覆盖 6 个街道</p>
      </div>
      <div class="chart-bar" style="background:#f8fbff;border:1px dashed #dbe6ff;">
        <div v-for="item in chartData" :key="item.label" class="bar" :style="{ height: item.value + 'px' }">
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>编号</th>
              <th>街道</th>
              <th>建筑名称</th>
              <th>楼层</th>
              <th>建成年份</th>
              <th>居民数</th>
              <th>设施状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in baseInfo" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.street }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.floors }}</td>
              <td>{{ item.year }}</td>
              <td>{{ item.population }}</td>
              <td>
                <span class="tag" :class="item.status === '良好' ? 'success' : 'warn'">{{ item.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modal.type" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="section-title">
          <h3>{{ modalTitle }}</h3>
          <button class="btn secondary" @click="closeModal">关闭</button>
        </div>
        <div v-if="modal.type === 'add'" class="grid" style="gap: 12px;">
          <div class="form-grid">
            <div>
              <label>建筑名称</label>
              <input placeholder="请输入建筑名称" />
            </div>
            <div>
              <label>街道</label>
              <select>
                <option>新华街道</option>
                <option>文化路街道</option>
                <option>迎宾路街道</option>
              </select>
            </div>
            <div>
              <label>楼层</label>
              <input type="number" placeholder="6" />
            </div>
            <div>
              <label>建成年份</label>
              <input type="number" placeholder="1998" />
            </div>
          </div>
          <textarea rows="3" placeholder="补充建筑现状描述"></textarea>
          <button class="btn">提交登记</button>
        </div>
        <div v-else-if="modal.type === 'sync'" class="grid" style="gap: 10px;">
          <p class="tip">同步普查数据将覆盖最新的人口、设施、房屋结构等指标。</p>
          <div class="progress-bar"><span :style="{ width: syncProgress + '%' }"></span></div>
          <button class="btn" @click="simulateSync">开始同步</button>
        </div>
        <div v-else class="grid" style="gap: 12px;">
          <p class="tip">导出将生成台账 Excel，并推送到邮件。</p>
          <div class="progress-bar"><span :style="{ width: 76 + '%' }"></span></div>
          <button class="btn">生成导出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const baseInfo = reactive([
  { id: 'B001', street: '新华街道', name: '富强小区1号', floors: 6, year: 1996, population: 88, status: '良好' },
  { id: 'B002', street: '新华街道', name: '富强小区2号', floors: 6, year: 1996, population: 92, status: '良好' },
  { id: 'B003', street: '新华街道', name: '富强小区3号', floors: 6, year: 1996, population: 80, status: '需维护' },
  { id: 'B004', street: '新华街道', name: '富强小区4号', floors: 6, year: 1996, population: 85, status: '需维护' },
  { id: 'B005', street: '文化路街道', name: '团结苑1幢', floors: 7, year: 2001, population: 110, status: '良好' },
  { id: 'B006', street: '文化路街道', name: '团结苑2幢', floors: 7, year: 2001, population: 108, status: '良好' },
  { id: 'B007', street: '文化路街道', name: '团结苑3幢', floors: 7, year: 2001, population: 104, status: '良好' },
  { id: 'B008', street: '文化路街道', name: '文化公寓1栋', floors: 5, year: 1994, population: 76, status: '需维护' },
  { id: 'B009', street: '文化路街道', name: '文化公寓2栋', floors: 5, year: 1994, population: 73, status: '良好' },
  { id: 'B010', street: '迎宾路街道', name: '迎宾里1号', floors: 8, year: 1999, population: 132, status: '良好' },
  { id: 'B011', street: '迎宾路街道', name: '迎宾里2号', floors: 8, year: 1999, population: 129, status: '良好' },
  { id: 'B012', street: '迎宾路街道', name: '迎宾里3号', floors: 8, year: 1999, population: 125, status: '良好' },
  { id: 'B013', street: '迎宾路街道', name: '迎宾里4号', floors: 8, year: 1999, population: 120, status: '需维护' },
  { id: 'B014', street: '迎宾路街道', name: '桂花巷1号', floors: 4, year: 1988, population: 64, status: '需维护' },
  { id: 'B015', street: '迎宾路街道', name: '桂花巷2号', floors: 4, year: 1988, population: 61, status: '需维护' },
  { id: 'B016', street: '迎宾路街道', name: '桂花巷3号', floors: 4, year: 1988, population: 60, status: '良好' },
  { id: 'B017', street: '东城街道', name: '东城公寓A', floors: 6, year: 2003, population: 98, status: '良好' },
  { id: 'B018', street: '东城街道', name: '东城公寓B', floors: 6, year: 2003, population: 96, status: '良好' },
  { id: 'B019', street: '东城街道', name: '东城公寓C', floors: 6, year: 2003, population: 94, status: '需维护' },
  { id: 'B020', street: '和平街道', name: '和平里1号', floors: 5, year: 1992, population: 82, status: '良好' },
  { id: 'B021', street: '和平街道', name: '和平里2号', floors: 5, year: 1992, population: 80, status: '良好' },
  { id: 'B022', street: '和平街道', name: '和平里3号', floors: 5, year: 1992, population: 78, status: '需维护' }
]);

const chartData = computed(() => [
  { label: '新华', value: 130 },
  { label: '文化', value: 160 },
  { label: '迎宾', value: 180 },
  { label: '东城', value: 140 },
  { label: '和平', value: 120 }
]);

const modal = reactive({ type: '' });
const syncProgress = ref(32);

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = '';
};

const modalTitle = computed(() => {
  if (modal.type === 'add') return '新增建筑信息';
  if (modal.type === 'sync') return '同步普查数据';
  if (modal.type === 'export') return '导出台账';
  return '';
});

const simulateSync = () => {
  syncProgress.value = Math.min(100, syncProgress.value + 20);
};
</script>
