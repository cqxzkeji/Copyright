<template>
  <div class="module-page">
    <div class="module-header">
      <div>
        <h2>变形分析与风险评估</h2>
        <p>识别变形特征，评估风险等级与影响范围。</p>
      </div>
      <div class="actions">
        <el-button type="primary" @click="openDialog('run')">启动分析</el-button>
        <el-button @click="openDialog('threshold')">阈值设置</el-button>
        <el-button @click="openDialog('report')">生成报告</el-button>
      </div>
    </div>

    <div class="stat-grid">
      <el-card>
        <div class="stat">
          <div>
            <h3>高风险点位</h3>
            <p>3 处</p>
          </div>
          <el-tag type="danger">重点</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>变形趋势</h3>
            <p>轻微上升</p>
          </div>
          <el-tag type="warning">预警</el-tag>
        </div>
      </el-card>
      <el-card>
        <div class="stat">
          <div>
            <h3>评估完成率</h3>
            <p>94%</p>
          </div>
          <el-tag type="success">已覆盖</el-tag>
        </div>
      </el-card>
    </div>

    <div class="panel-grid">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>风险等级分布</span>
            <el-button size="small" @click="openDialog('insight')">风险解读</el-button>
          </div>
        </template>
        <div ref="chartRef" class="chart"></div>
      </el-card>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>变形特征清单</span>
            <el-button size="small" type="primary" @click="openDialog('review')">专家复核</el-button>
          </div>
        </template>
        <el-table :data="tableData" height="380">
          <el-table-column prop="point" label="监测点" width="140" />
          <el-table-column prop="feature" label="特征" width="140" />
          <el-table-column prop="risk" label="风险等级" width="120" />
          <el-table-column prop="trend" label="趋势" width="120" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </el-card>
    </div>

    <el-dialog v-model="dialogs.run" title="分析进度" width="420px" :close-on-click-modal="false">
      <p>正在运行变形特征提取算法，请稍候。</p>
      <el-progress :percentage="72" status="success" />
      <template #footer>
        <el-button type="primary" @click="dialogs.run = false">完成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.threshold" title="阈值设置" width="480px" :close-on-click-modal="false">
      <el-form :model="thresholdForm" label-width="120px">
        <el-form-item label="变形报警阈值"><el-input v-model="thresholdForm.alarm" /></el-form-item>
        <el-form-item label="风险评估阈值"><el-input v-model="thresholdForm.risk" /></el-form-item>
        <el-form-item label="更新说明"><el-input v-model="thresholdForm.note" type="textarea" rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.threshold = false">取消</el-button>
        <el-button type="primary" @click="dialogs.threshold = false">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.report" title="报告生成" width="420px" :close-on-click-modal="false">
      <p>风险评估报告已生成，将同步至管理端。</p>
      <template #footer>
        <el-button type="primary" @click="dialogs.report = false">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.insight" title="风险解读" width="420px" :close-on-click-modal="false">
      <p>高风险点集中在负载波动区域，建议优化负载调配并安排局放检测。</p>
      <template #footer>
        <el-button type="primary" @click="dialogs.insight = false">知道了</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogs.review" title="专家复核" width="480px" :close-on-click-modal="false">
      <el-form :model="reviewForm" label-width="90px">
        <el-form-item label="专家"><el-input v-model="reviewForm.expert" /></el-form-item>
        <el-form-item label="复核意见"><el-input v-model="reviewForm.note" type="textarea" rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.review = false">取消</el-button>
        <el-button type="primary" @click="dialogs.review = false">提交复核</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);

const tableData = Array.from({ length: 20 }, (_, index) => ({
  point: `绕组${String.fromCharCode(65 + (index % 3))}-0${index + 1}`,
  feature: index % 2 === 0 ? '径向压缩' : '轴向位移',
  risk: index % 5 === 0 ? '高' : index % 3 === 0 ? '中' : '低',
  trend: index % 4 === 0 ? '上升' : '稳定',
  remark: index % 4 === 0 ? '建议检修' : '持续关注'
}));

const dialogs = ref({
  run: false,
  threshold: false,
  report: false,
  insight: false,
  review: false
});

const thresholdForm = ref({
  alarm: '0.85 mm',
  risk: '0.65 mm',
  note: '根据夏季负载调整阈值'
});

const reviewForm = ref({
  expert: '张主任',
  note: '建议在高负载时段增加巡检'
});

const openDialog = (key) => {
  dialogs.value[key] = true;
};

onMounted(() => {
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        name: '风险等级',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 6, name: '高风险' },
          { value: 9, name: '中风险' },
          { value: 16, name: '低风险' }
        ]
      }
    ]
  });
  window.addEventListener('resize', () => chart.resize());
});
</script>

<style scoped>
.module-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header h2 {
  margin: 0 0 6px;
  color: #1a2b5c;
}

.module-header p {
  margin: 0;
  color: #7b8bb3;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat h3 {
  margin: 0 0 6px;
  color: #2c3a66;
}

.stat p {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a2b5c;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart {
  width: 100%;
  height: 360px;
}
</style>
