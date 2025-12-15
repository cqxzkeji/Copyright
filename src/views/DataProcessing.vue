<template>
  <div class="container">
    <div class="flex">
      <div class="card" style="flex: 2 1 420px;">
        <h3>处理任务概览</h3>
        <div class="stat-grid">
          <div class="stat">
            <p class="label">活跃任务</p>
            <h2>18</h2>
            <span class="chip">排队 2</span>
          </div>
          <div class="stat">
            <p class="label">平均时延</p>
            <h2>2.8 分钟</h2>
            <span class="chip">优化中</span>
          </div>
          <div class="stat">
            <p class="label">成功率</p>
            <h2>99.2%</h2>
            <span class="chip">达标</span>
          </div>
        </div>
        <div class="actions">
          <button @click="showRun = true; startRun();">执行全量分析</button>
          <button class="ghost" @click="showParams = true">调整算法参数</button>
          <button @click="showHint = true">查看监控提示</button>
        </div>
      </div>
      <div class="card" style="flex: 1 1 320px;">
        <h3>处理阶段分布</h3>
        <div class="pie">
          <div class="slice" style="--deg: 140deg; --color: #1e88e5"></div>
          <div class="slice" style="--deg: 80deg; --color: #4fc3f7"></div>
          <div class="slice" style="--deg: 50deg; --color: #fb8c00"></div>
          <div class="slice" style="--deg: 90deg; --color: #43a047"></div>
          <div class="center">实时</div>
        </div>
        <p class="muted">按阶段拆解 CPU 占用比例</p>
      </div>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3>处理流水线</h3>
          <p class="muted">包含 10 条以上流水线，支持逐一操作</p>
        </div>
        <button class="ghost" @click="showHint = true">操作说明</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>流水线</th>
            <th>输入源</th>
            <th>输出</th>
            <th>最近运行</th>
            <th>耗时</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pipe in pipelines" :key="pipe.name">
            <td>{{ pipe.name }}</td>
            <td>{{ pipe.input }}</td>
            <td>{{ pipe.output }}</td>
            <td>{{ pipe.runAt }}</td>
            <td>{{ pipe.duration }}</td>
            <td><span class="badge" :style="{ background: pipe.color }">{{ pipe.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <modal-dialog v-model="showRun" title="执行分析" width="480px">
      <p>正在启动全量分析流水线，预计需要 2 分钟完成。</p>
      <div class="progress"><div class="progress-bar" :style="{ width: runProgress + '%' }"></div></div>
    </modal-dialog>

    <modal-dialog v-model="showParams" title="算法参数" width="540px">
      <div class="form-grid">
        <label>采样率<input value="0.8" /></label>
        <label>批次大小<input value="256" /></label>
        <label>告警阈值<input value="0.65" /></label>
      </div>
      <template #footer>
        <button class="ghost" @click="showParams = false">取消</button>
        <button @click="showParams = false; showHint = true;">保存</button>
      </template>
    </modal-dialog>

    <modal-dialog v-model="showHint" title="监控提示">
      <ul class="bullet">
        <li>推荐在低峰时段执行全量分析，避免计算资源冲突。</li>
        <li>参数调整后立即生效，影响实时告警敏感度。</li>
        <li>异常流水线会自动重试两次并记录原因。</li>
      </ul>
    </modal-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showRun = ref(false);
const showParams = ref(false);
const showHint = ref(false);
const runProgress = ref(10);

const pipelines = [
  { name: '清洗-标准化', input: '日志流', output: 'ODS', runAt: '10:05', duration: '1.2m', status: '完成', color: '#43a047' },
  { name: '埋点宽表', input: '行为事件', output: 'DWD', runAt: '10:02', duration: '2.5m', status: '完成', color: '#43a047' },
  { name: '风控特征', input: '交易明细', output: 'Feature', runAt: '09:59', duration: '2.8m', status: '进行中', color: '#1e88e5' },
  { name: '舆情聚合', input: '文本流', output: '索引库', runAt: '09:55', duration: '1.6m', status: '完成', color: '#43a047' },
  { name: '数据脱敏', input: '用户表', output: '安全区', runAt: '09:50', duration: '2.0m', status: '完成', color: '#43a047' },
  { name: '实时指标', input: '监控事件', output: 'Redis', runAt: '09:48', duration: '0.8m', status: '进行中', color: '#1e88e5' },
  { name: '模型训练', input: '特征集', output: '模型仓', runAt: '09:40', duration: '5.6m', status: '排队', color: '#fb8c00' },
  { name: '图像识别', input: '摄像流', output: '识别结果', runAt: '09:36', duration: '3.1m', status: '完成', color: '#43a047' },
  { name: '异常检测', input: '告警流', output: '告警库', runAt: '09:30', duration: '1.0m', status: '完成', color: '#43a047' },
  { name: '报表预计算', input: '聚合数据', output: 'BI表', runAt: '09:25', duration: '4.2m', status: '完成', color: '#43a047' },
  { name: '质量评分', input: 'ODS 数据', output: '质量报告', runAt: '09:22', duration: '1.4m', status: '完成', color: '#43a047' }
];

const startRun = () => {
  runProgress.value = 10;
  const timer = setInterval(() => {
    runProgress.value += 18;
    if (runProgress.value >= 100) {
      clearInterval(timer);
      showRun.value = false;
      showHint.value = true;
    }
  }, 320);
};
</script>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.stat {
  background: #f7fbff;
  padding: 12px;
  border-radius: 12px;
}

.label {
  margin: 0;
  color: #6b7280;
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

button.ghost {
  background: #eef2f7;
  color: #1f2933;
}

.pie {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto;
  border-radius: 50%;
  background: conic-gradient(#1e88e5 0deg 140deg, #4fc3f7 140deg 220deg, #fb8c00 220deg 270deg, #43a047 270deg 360deg);
  display: grid;
  place-items: center;
}

.center {
  background: #fff;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #1e88e5;
  box-shadow: inset 0 0 0 10px #e8f2ff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.muted {
  margin: 0;
  color: #94a3b8;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d7deea;
}
</style>
