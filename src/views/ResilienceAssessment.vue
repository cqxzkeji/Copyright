<template>
  <section>
    <div class="topbar" style="padding: 14px 16px;">
      <div class="title">供应链韧性评估</div>
      <div class="actions">
        <button class="btn" @click="showModel = true">更新评估模型</button>
        <button class="btn primary" @click="showRun = true">运行韧性计算</button>
        <button class="btn" @click="showReport = true">导出报告</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>韧性要素对比</h3>
        <div class="info-grid">
          <div class="item" v-for="metric in dimensions" :key="metric.name">
            <strong>{{ metric.score }}</strong>
            <div>{{ metric.name }}</div>
            <div class="progress" style="margin-top: 8px;">
              <div class="bar" :style="{ width: `${metric.score}%` }"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>供应商韧性散点</h3>
        <div class="small-chart">
          <span v-for="point in supplierResilience" :key="point" :style="{ height: `${point}px` }"></span>
        </div>
        <p class="hint">散点高度代表韧性得分，采集自 12 个重点供应商。</p>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>韧性评分清单</h3>
        <button class="btn primary" @click="showRun = true">重新计算</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>节点</th>
            <th>韧性得分</th>
            <th>脆弱点</th>
            <th>冗余措施</th>
            <th>建议</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in assessment" :key="item.node">
            <td>{{ item.node }}</td>
            <td><span class="badge">{{ item.score }}</span></td>
            <td>{{ item.weakness }}</td>
            <td>{{ item.buffer }}</td>
            <td>{{ item.suggestion }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="showModel" title="更新评估模型" @confirm="showModel = false">
      <div class="form-grid">
        <label>
          评分方案
          <select>
            <option>韧性基线模型</option>
            <option>区域弹性模型</option>
            <option>供应商韧性模型</option>
          </select>
        </label>
        <label>
          权重版本
          <select>
            <option>2024Q4</option>
            <option>2024Q3</option>
            <option>自定义</option>
          </select>
        </label>
      </div>
      <label style="display: block; margin-top: 10px;">
        调整说明
        <textarea rows="4" placeholder="记录权重调整原因"></textarea>
      </label>
    </BaseModal>

    <BaseModal v-model="showRun" title="韧性计算进度" @confirm="runAssessment">
      <p>系统将基于最新数据重新计算韧性指数，预计 8 秒完成。</p>
      <div class="progress">
        <div class="bar" :style="{ width: `${runProgress}%` }"></div>
      </div>
      <p style="text-align: right; margin: 6px 0 0;">当前进度：{{ runProgress }}%</p>
    </BaseModal>

    <BaseModal v-model="showReport" title="导出评估报告" @confirm="showReport = false">
      <p>选择输出格式与接收人后，将发送包含韧性得分、薄弱环节和改进建议的报告。</p>
      <div class="form-grid">
        <label>
          报告格式
          <select>
            <option>PDF</option>
            <option>Excel</option>
            <option>Markdown</option>
          </select>
        </label>
        <label>
          抄送
          <input placeholder="输入邮件列表" />
        </label>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showModel = ref(false);
const showRun = ref(false);
const showReport = ref(false);
const runProgress = ref(60);

const dimensions = reactive([
  { name: '可视化能力', score: 86 },
  { name: '冗余配置', score: 79 },
  { name: '柔性制造', score: 82 },
  { name: '协同效率', score: 88 },
  { name: '恢复速度', score: 84 },
  { name: '需求弹性', score: 81 }
]);

const supplierResilience = reactive([90, 78, 84, 86, 74, 82, 88, 80, 76, 85, 79, 92]);

const assessment = reactive([
  { node: '核心供应商A', score: 86, weakness: '单一来源', buffer: '双供切换', suggestion: '签订备选协议' },
  { node: '备件仓库', score: 82, weakness: '库存低', buffer: '安全库存2.5天', suggestion: '增加高风险物料储备' },
  { node: '生产线1', score: 79, weakness: '维护周期长', buffer: '预防性保养', suggestion: '缩短保养周期' },
  { node: '生产线2', score: 81, weakness: '缺工风险', buffer: '多能工培训', suggestion: '交叉培训' },
  { node: '检测中心', score: 84, weakness: '设备老化', buffer: '备用检测仪', suggestion: '更换核心部件' },
  { node: '干线物流', score: 78, weakness: '气候影响', buffer: '多路线调度', suggestion: '预置替代路线' },
  { node: '分拨中心', score: 80, weakness: '装卸瓶颈', buffer: '弹性工位', suggestion: '提升自动化' },
  { node: '配送中心', score: 83, weakness: '夜间运力不足', buffer: '夜班外包', suggestion: '补充运力池' },
  { node: '海外仓', score: 77, weakness: '清关不确定', buffer: '预清关方案', suggestion: '增加本地代理' },
  { node: '售后网点', score: 75, weakness: '备件调度慢', buffer: '区域备件柜', suggestion: '优化调拨路径' }
]);

const runAssessment = () => {
  runProgress.value = 0;
  const timer = setInterval(() => {
    runProgress.value += 25;
    if (runProgress.value >= 100) {
      runProgress.value = 100;
      clearInterval(timer);
    }
  }, 200);
};
</script>
