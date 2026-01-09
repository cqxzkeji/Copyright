<template>
  <section class="card">
    <div class="section-header">
      <div>
        <h3>存量用地基础数据管理</h3>
        <p>整合权属、规划属性、面积结构与利用现状数据。</p>
      </div>
      <div class="section-actions">
        <button class="btn btn-outline" @click="openImport">多源数据导入</button>
        <button class="btn btn-outline" @click="openStandard">标准化处理</button>
        <button class="btn btn-primary" @click="openUpdate">动态更新</button>
      </div>
    </div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
      <div v-for="summary in summaries" :key="summary.label" class="card summary-card">
        <p>{{ summary.label }}</p>
        <h4>{{ summary.value }}</h4>
        <span class="tag">{{ summary.tag }}</span>
      </div>
    </div>
  </section>

  <section class="flex" style="margin-top: 20px;">
    <div class="card" style="flex: 1;">
      <div class="section-header">
        <div>
          <h3>用地结构分布</h3>
          <p>按现状用地类型统计</p>
        </div>
        <button class="btn btn-outline" @click="openField">字段说明</button>
      </div>
      <div class="pie">
        <div v-for="item in landStructure" :key="item.name" class="pie-row">
          <span>{{ item.name }}</span>
          <div class="pie-bar" :style="{ width: item.percent + '%' }"></div>
          <strong>{{ item.percent }}%</strong>
        </div>
      </div>
    </div>
    <div class="card" style="flex: 1;">
      <div class="section-header">
        <div>
          <h3>数据质量监测</h3>
          <p>一致性与完整性评分</p>
        </div>
        <button class="btn btn-primary" @click="openQuality">质量诊断</button>
      </div>
      <ul class="quality-list">
        <li v-for="item in qualityList" :key="item.label">
          <span>{{ item.label }}</span>
          <span class="tag">{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </section>

  <section class="card" style="margin-top: 20px;">
    <div class="section-header">
      <div>
        <h3>基础数据库清单</h3>
        <p>共 {{ tableData.length }} 条记录</p>
      </div>
      <button class="btn btn-outline" @click="openExport">导出数据库</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>地块编号</th>
          <th>权属</th>
          <th>规划属性</th>
          <th>面积(公顷)</th>
          <th>利用现状</th>
          <th>更新频率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.code">
          <td>{{ row.code }}</td>
          <td>{{ row.owner }}</td>
          <td>{{ row.plan }}</td>
          <td>{{ row.area }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.update }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal v-model="importVisible" title="多源数据导入">
    <label>
      数据来源
      <select class="select">
        <option>国土空间规划数据库</option>
        <option>不动产登记系统</option>
        <option>遥感监测平台</option>
      </select>
    </label>
    <label>
      文件路径
      <input class="input" placeholder="请选择数据文件" />
    </label>
    <div class="tag">支持 Shp / GeoJSON / Excel</div>
  </BaseModal>

  <BaseModal v-model="standardVisible" title="标准化处理">
    <p>系统将按照统一标准清洗字段与空间坐标。</p>
    <div class="progress">
      <div class="progress-bar" style="width: 61%;"></div>
    </div>
    <p class="muted">正在标准化 61% ...</p>
  </BaseModal>

  <BaseModal v-model="updateVisible" title="动态更新">
    <label>
      更新周期
      <select class="select">
        <option>实时同步</option>
        <option>每日更新</option>
        <option>每周更新</option>
      </select>
    </label>
    <label>
      更新说明
      <textarea class="textarea" rows="3" placeholder="填写更新说明"></textarea>
    </label>
  </BaseModal>

  <BaseModal v-model="fieldVisible" title="字段说明">
    <ul class="field-list">
      <li>权属：土地权利归属信息</li>
      <li>规划属性：控规、产业规划定义的功能定位</li>
      <li>面积结构：地块面积与建筑面积统计</li>
      <li>利用现状：当前用地类型及开发强度</li>
    </ul>
  </BaseModal>

  <BaseModal v-model="qualityVisible" title="质量诊断">
    <p>系统已完成数据一致性诊断，整体质量评分 92 分。</p>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
      <div class="card mini-card">
        <p>缺失字段</p>
        <strong>12 处</strong>
      </div>
      <div class="card mini-card">
        <p>空间偏差</p>
        <strong>1.4%</strong>
      </div>
      <div class="card mini-card">
        <p>重复记录</p>
        <strong>6 条</strong>
      </div>
    </div>
  </BaseModal>

  <BaseModal v-model="exportVisible" title="导出数据库">
    <p>请选择导出格式与字段范围。</p>
    <label>
      导出格式
      <select class="select">
        <option>GeoPackage</option>
        <option>Excel</option>
        <option>CSV</option>
      </select>
    </label>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const summaries = [
  { label: '地块总数', value: '2,468', tag: '已归档' },
  { label: '规划属性覆盖率', value: '98%', tag: '合规' },
  { label: '权属完整率', value: '95%', tag: '已核验' },
  { label: '动态更新频率', value: '7 天', tag: '自动同步' }
];

const landStructure = [
  { name: '工业用地', percent: 38 },
  { name: '居住用地', percent: 26 },
  { name: '公共服务', percent: 18 },
  { name: '仓储物流', percent: 10 },
  { name: '其他', percent: 8 }
];

const qualityList = [
  { label: '字段完整率', value: '96%' },
  { label: '坐标准确率', value: '94%' },
  { label: '更新及时率', value: '90%' },
  { label: '空间一致性', value: '92%' }
];

const tableData = Array.from({ length: 22 }).map((_, index) => ({
  code: `LD-${2024 + index}`,
  owner: ['国有', '集体', '企业'][index % 3],
  plan: ['产业升级', '综合居住', '公共服务'][index % 3],
  area: (12.5 - index * 0.2).toFixed(1),
  status: ['低效工业', '城镇居住', '仓储物流'][index % 3],
  update: ['实时', '每周', '每月'][index % 3]
}));

const importVisible = ref(false);
const standardVisible = ref(false);
const updateVisible = ref(false);
const fieldVisible = ref(false);
const qualityVisible = ref(false);
const exportVisible = ref(false);

const openImport = () => {
  importVisible.value = true;
};

const openStandard = () => {
  standardVisible.value = true;
};

const openUpdate = () => {
  updateVisible.value = true;
};

const openField = () => {
  fieldVisible.value = true;
};

const openQuality = () => {
  qualityVisible.value = true;
};

const openExport = () => {
  exportVisible.value = true;
};
</script>

<style scoped>
.summary-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pie {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pie-row {
  display: grid;
  grid-template-columns: 90px 1fr 50px;
  gap: 10px;
  align-items: center;
  font-size: 13px;
}

.pie-bar {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #3dd598, #2f80ed);
}

.quality-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quality-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-list {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
}

.progress {
  background: #f1f5f9;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  background: var(--primary);
  height: 100%;
}

.muted {
  color: var(--muted);
  font-size: 13px;
}

.mini-card {
  padding: 12px;
  text-align: center;
}
</style>
