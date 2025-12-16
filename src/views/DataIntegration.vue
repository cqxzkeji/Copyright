<template>
  <section>
    <div class="topbar" style="padding: 14px 16px;">
      <div class="title">数据采集与整合</div>
      <div class="actions">
        <button class="btn" @click="showAddSource = true">添加数据源</button>
        <button class="btn primary" @click="showSync = true">执行数据同步</button>
        <button class="btn" @click="showQuality = true">质量校验</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>数据源覆盖</h3>
        <p class="hint">当前已对接 {{ sources.length }} 个核心数据源，覆盖采购、生产、物流、售后全链路。</p>
        <div class="tag-grid">
          <div class="tag" v-for="source in sources.slice(0, 8)" :key="source.name">{{ source.name }}</div>
        </div>
      </div>
      <div class="card">
        <h3>采集质量得分</h3>
        <div class="summary-chart">
          <div v-for="metric in qualityMetrics" :key="metric.label" class="column" :style="{ height: `${metric.score * 1.4}px` }">
            <span>{{ metric.label }}</span>
          </div>
        </div>
        <p class="hint">指标超过 80 表示质量达标，当前平均 {{ avgQuality }} 分。</p>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>数据源列表</h3>
        <button class="btn primary" @click="showSync = true">批量同步</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>最近同步</th>
            <th>状态</th>
            <th>覆盖表数量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="source in sources" :key="source.name">
            <td>{{ source.name }}</td>
            <td>{{ source.type }}</td>
            <td>{{ source.updated }}</td>
            <td><span class="badge">{{ source.status }}</span></td>
            <td>{{ source.tables }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="showAddSource" title="新增数据源" @confirm="showAddSource = false">
      <div class="form-grid">
        <label>
          数据源名称
          <input placeholder="如：采购 ERP" />
        </label>
        <label>
          数据类型
          <select>
            <option>API</option>
            <option>数据库</option>
            <option>文件</option>
          </select>
        </label>
        <label>
          同步频率
          <select>
            <option>每 15 分钟</option>
            <option>每小时</option>
            <option>每日</option>
          </select>
        </label>
        <label>
          负责人
          <input placeholder="请输入姓名" />
        </label>
      </div>
    </BaseModal>

    <BaseModal v-model="showSync" title="数据同步进度" @confirm="startSync">
      <p>执行同步将拉取数据并更新整合模型。</p>
      <div class="progress">
        <div class="bar" :style="{ width: `${syncProgress}%` }"></div>
      </div>
      <p style="text-align: right; margin: 6px 0 0;">当前进度：{{ syncProgress }}%</p>
    </BaseModal>

    <BaseModal v-model="showQuality" title="质量校验结果" @confirm="showQuality = false">
      <p>系统根据缺失率、重复率、时效性等指标实时给出质量建议。</p>
      <ul>
        <li>缺失率低于 2% 的数据源自动标记为绿色。</li>
        <li>重复率高于 5% 的数据源需人工核查。</li>
        <li>时效性超过 30 分钟的批次会自动进入重跑队列。</li>
      </ul>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showAddSource = ref(false);
const showSync = ref(false);
const showQuality = ref(false);
const syncProgress = ref(45);

const sources = reactive([
  { name: '采购 ERP', type: 'API', updated: '09:20', status: '正常', tables: 18 },
  { name: '供应商 SRM', type: 'API', updated: '09:22', status: '正常', tables: 16 },
  { name: '仓储 WMS', type: '数据库', updated: '09:18', status: '正常', tables: 22 },
  { name: '物流 TMS', type: 'API', updated: '09:15', status: '正常', tables: 19 },
  { name: '生产 MES', type: '数据库', updated: '09:12', status: '正常', tables: 25 },
  { name: '质检 QIS', type: '数据库', updated: '09:10', status: '正常', tables: 14 },
  { name: '财务报表', type: '文件', updated: '08:50', status: '正常', tables: 9 },
  { name: '售后 CRM', type: 'API', updated: '09:05', status: '正常', tables: 12 },
  { name: '需求预测', type: '文件', updated: '08:48', status: '正常', tables: 7 },
  { name: '市场行情', type: 'API', updated: '08:42', status: '正常', tables: 6 }
]);

const qualityMetrics = reactive([
  { label: '缺失率', score: 92 },
  { label: '重复率', score: 88 },
  { label: '时效性', score: 90 },
  { label: '一致性', score: 86 },
  { label: '完整性', score: 91 }
]);

const avgQuality = computed(() => {
  const total = qualityMetrics.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / qualityMetrics.length);
});

const startSync = () => {
  syncProgress.value = 0;
  const timer = setInterval(() => {
    syncProgress.value += 20;
    if (syncProgress.value >= 100) {
      syncProgress.value = 100;
      clearInterval(timer);
    }
  }, 250);
};
</script>
