<template>
  <section>
    <div class="banner">
      <div>
        <strong>实时态势：</strong> 全链路稳定运行，核心节点韧性指数持续提升，风险监测保持低位。
      </div>
      <div class="actions">
        <button class="btn" @click="showPublish = true">发布公告</button>
        <button class="btn primary" @click="showRefresh = true">刷新态势</button>
        <button class="btn" @click="showExport = true">导出看板</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>整体韧性指数</h3>
        <div class="summary-chart">
          <div
            v-for="item in resilienceTrend"
            :key="item.month"
            class="column"
            :style="{ height: `${item.value * 1.8}px` }"
          >
            <span>{{ item.month }}</span>
          </div>
        </div>
        <p class="hint">过去 12 个月平均韧性指数 {{ avgResilience }}，保持稳健增长。</p>
      </div>
      <div class="card">
        <h3>风险态势脉冲</h3>
        <div class="small-chart">
          <span v-for="pulse in riskPulse" :key="pulse" :style="{ height: `${pulse}px` }"></span>
        </div>
        <p class="hint">近 12 周风险脉冲保持可控，未触发超阈值预警。</p>
      </div>
      <div class="card">
        <h3>执行效率</h3>
        <div class="info-grid">
          <div class="item" v-for="metric in efficiency" :key="metric.label">
            <strong>{{ metric.value }}</strong>
            <div>{{ metric.label }}</div>
            <div class="progress" style="margin-top: 8px;">
              <div class="bar" :style="{ width: `${metric.progress}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>关键环节韧性监测</h3>
        <div class="actions">
          <button class="btn" @click="showPublish = true">快速提醒</button>
          <button class="btn primary" @click="showRefresh = true">同步最新</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>环节</th>
            <th>韧性指数</th>
            <th>恢复时长(h)</th>
            <th>预警等级</th>
            <th>最后刷新</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in nodes" :key="item.stage">
            <td>{{ item.stage }}</td>
            <td><span class="badge">{{ item.score }}</span></td>
            <td>{{ item.recovery }}</td>
            <td>{{ item.level }}</td>
            <td>{{ item.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="showPublish" title="发布运营公告" @confirm="showPublish = false">
      <div class="form-grid">
        <label>
          标题
          <input placeholder="如：周度韧性提升计划" />
        </label>
        <label>
          推送范围
          <select>
            <option>全员</option>
            <option>供应链中心</option>
            <option>区域运营团队</option>
          </select>
        </label>
      </div>
      <label style="display: block; margin-top: 10px;">
        正文
        <textarea rows="4" placeholder="输入公告内容"></textarea>
      </label>
    </BaseModal>

    <BaseModal v-model="showRefresh" title="刷新态势" @confirm="simulateRefresh">
      <p>刷新将拉取最新监测数据并更新所有模块的指标卡片。</p>
      <div class="progress">
        <div class="bar" :style="{ width: `${refreshProgress}%` }"></div>
      </div>
      <p style="text-align: right; margin: 6px 0 0;">当前进度：{{ refreshProgress }}%</p>
    </BaseModal>

    <BaseModal v-model="showExport" title="导出看板" @confirm="showExport = false">
      <p>选择导出格式后，系统会生成包含图表与表格的报告文件。</p>
      <div class="form-grid">
        <label>
          导出格式
          <select>
            <option>PDF</option>
            <option>Excel</option>
            <option>图片</option>
          </select>
        </label>
        <label>
          时间范围
          <select>
            <option>本周</option>
            <option>本月</option>
            <option>近 90 天</option>
          </select>
        </label>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showPublish = ref(false);
const showRefresh = ref(false);
const showExport = ref(false);
const refreshProgress = ref(30);

const resilienceTrend = reactive([
  { month: '1月', value: 62 },
  { month: '2月', value: 65 },
  { month: '3月', value: 68 },
  { month: '4月', value: 70 },
  { month: '5月', value: 74 },
  { month: '6月', value: 76 },
  { month: '7月', value: 78 },
  { month: '8月', value: 80 },
  { month: '9月', value: 83 },
  { month: '10月', value: 85 },
  { month: '11月', value: 87 },
  { month: '12月', value: 90 }
]);

const nodes = reactive([
  { stage: '原材料采购', score: 88, recovery: 6, level: '低', time: '09:00' },
  { stage: '仓储入库', score: 84, recovery: 8, level: '低', time: '09:10' },
  { stage: '生产计划', score: 81, recovery: 7, level: '低', time: '09:15' },
  { stage: '生产执行', score: 79, recovery: 9, level: '中', time: '09:20' },
  { stage: '质量检测', score: 85, recovery: 6, level: '低', time: '09:22' },
  { stage: '包装入库', score: 80, recovery: 10, level: '中', time: '09:26' },
  { stage: '区域分拨', score: 77, recovery: 12, level: '中', time: '09:31' },
  { stage: '干线运输', score: 75, recovery: 14, level: '中', time: '09:35' },
  { stage: '终端配送', score: 82, recovery: 8, level: '低', time: '09:40' },
  { stage: '售后与退换', score: 73, recovery: 16, level: '中', time: '09:45' }
]);

const riskPulse = reactive([56, 42, 60, 48, 45, 54, 50, 46, 44, 38, 40, 36]);

const efficiency = reactive([
  { label: '监测数据更新及时率', value: '98.2%', progress: 98 },
  { label: '风险闭环完成率', value: '92.6%', progress: 93 },
  { label: '应急演练完成度', value: '87.4%', progress: 87 },
  { label: '权限审核通过率', value: '96.5%', progress: 96 }
]);

const avgResilience = computed(() => {
  const total = resilienceTrend.reduce((sum, item) => sum + item.value, 0);
  return Math.round(total / resilienceTrend.length);
});

const simulateRefresh = () => {
  refreshProgress.value = 0;
  const timer = setInterval(() => {
    refreshProgress.value += 15;
    if (refreshProgress.value >= 100) {
      refreshProgress.value = 100;
      clearInterval(timer);
    }
  }, 200);
};

onMounted(() => {
  refreshProgress.value = 40;
});
</script>
