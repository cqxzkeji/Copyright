<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div class="card">
      <div class="badge">实时接入</div>
      <h3>在线设备 128 台</h3>
      <p>传感器稳定率 99.2%，今日新增点位 6 个。</p>
    </div>
    <div class="card">
      <div class="badge">巡检联动</div>
      <h3>人工巡检 42 次</h3>
      <p>图片/视频采集 86 条，覆盖 12 个地块。</p>
    </div>
    <div class="card">
      <div class="badge">异常监测</div>
      <h3>异常标注 9 项</h3>
      <p>缺失补齐任务 3 项，数据校验通过率 98.1%。</p>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-header">
      <div>
        <h3>采集策略</h3>
        <span>传感器 / 人工巡检 / 批次地块绑定</span>
      </div>
      <div class="actions">
        <button class="btn" @click="openModal('新增传感器接入', 'sensor')">新增传感器接入</button>
        <button class="btn secondary" @click="openModal('上传巡检记录', 'inspection')">上传巡检记录</button>
        <button class="btn secondary" @click="openModal('批次与地块绑定', 'batch')">批次绑定</button>
        <button class="btn ghost" @click="openModal('缺失补齐任务', 'progress')">启动缺失补齐</button>
        <button class="btn ghost" @click="openModal('异常标注确认', 'alert')">异常标注</button>
      </div>
    </div>
    <div class="chart">
      <svg viewBox="0 0 640 220" aria-hidden="true">
        <defs>
          <linearGradient id="ingest" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stop-color="#60a5fa" />
            <stop offset="100%" stop-color="#34d399" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="640" height="220" fill="#f8fafc" rx="18" />
        <polyline
          fill="none"
          stroke="url(#ingest)"
          stroke-width="4"
          points="20,160 80,120 140,130 200,90 260,100 320,70 380,90 440,60 500,80 560,55 620,70"
        />
        <circle v-for="(x, index) in chartPoints" :key="index" :cx="x.x" :cy="x.y" r="5" fill="#2563eb" />
      </svg>
      <div class="chart-legend">
        <span class="badge">实时采集曲线</span>
        <span>时间粒度：10 分钟</span>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-header">
      <div>
        <h3>接入明细列表</h3>
        <span>温湿度 / 光照 / 土壤水分 / EC / pH</span>
      </div>
      <button class="btn ghost" @click="openModal('接入提示信息', 'info')">按钮提示信息</button>
    </div>
    <div class="table-scroll">
      <table class="table">
        <thead>
          <tr>
            <th>采集时间</th>
            <th>设备编号</th>
            <th>地块</th>
            <th>温度(℃)</th>
            <th>湿度(%)</th>
            <th>光照(lux)</th>
            <th>土壤水分(%)</th>
            <th>EC</th>
            <th>pH</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.time }}</td>
            <td>{{ row.device }}</td>
            <td>{{ row.plot }}</td>
            <td>{{ row.temp }}</td>
            <td>{{ row.hum }}</td>
            <td>{{ row.light }}</td>
            <td>{{ row.soil }}</td>
            <td>{{ row.ec }}</td>
            <td>{{ row.ph }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" @close="modal.open = false">
    <div v-if="modal.type === 'sensor'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">传感器编号</label>
        <input class="input" placeholder="例如：TH-2024-008" />
      </div>
      <div>
        <label class="label">绑定地块</label>
        <input class="input" placeholder="选择地块或输入编号" />
      </div>
      <div>
        <label class="label">采集指标</label>
        <input class="input" placeholder="温湿度/光照/土壤" />
      </div>
      <button class="btn">提交接入申请</button>
    </div>
    <div v-else-if="modal.type === 'inspection'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">巡检人员</label>
        <input class="input" placeholder="姓名" />
      </div>
      <div>
        <label class="label">图片/视频说明</label>
        <input class="input" placeholder="上传后自动生成巡检记录" />
      </div>
      <button class="btn">生成巡检批次</button>
    </div>
    <div v-else-if="modal.type === 'batch'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">批次编号</label>
        <input class="input" placeholder="BATCH-2024-09" />
      </div>
      <div>
        <label class="label">目标地块</label>
        <input class="input" placeholder="地块 A3 / 温室 2" />
      </div>
      <button class="btn">确认绑定</button>
    </div>
    <div v-else-if="modal.type === 'progress'" class="grid" style="gap: 12px;">
      <p>正在执行缺失补齐与数据校验任务，请等待完成。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: '72%' }"></div>
      </div>
      <button class="btn">查看任务详情</button>
    </div>
    <div v-else-if="modal.type === 'alert'" class="grid" style="gap: 12px;">
      <p>检测到 3 条异常数据，是否立即标注并推送治理规则？</p>
      <div style="display: flex; gap: 10px;">
        <button class="btn">确认标注</button>
        <button class="btn secondary">稍后处理</button>
      </div>
    </div>
    <div v-else>
      <p>采集模块支持多源接入，建议优先绑定关键地块与重点批次。</p>
      <ul>
        <li>设备离线超过 30 分钟会触发预警。</li>
        <li>巡检上传后自动关联批次与地块。</li>
      </ul>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartPoints = [
  { x: 20, y: 160 },
  { x: 80, y: 120 },
  { x: 140, y: 130 },
  { x: 200, y: 90 },
  { x: 260, y: 100 },
  { x: 320, y: 70 },
  { x: 380, y: 90 },
  { x: 440, y: 60 },
  { x: 500, y: 80 },
  { x: 560, y: 55 },
  { x: 620, y: 70 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  time: `2024-05-2${Math.floor(index / 3)} 0${(index % 6) + 8}:20`,
  device: `TH-${100 + index}`,
  plot: `地块-${(index % 6) + 1}`,
  temp: (24 + (index % 5)).toFixed(1),
  hum: (60 + (index % 8)).toFixed(0),
  light: 12000 + index * 120,
  soil: (35 + (index % 10)).toFixed(0),
  ec: (1.2 + index * 0.02).toFixed(2),
  ph: (6.3 + (index % 4) * 0.1).toFixed(1),
  status: index % 3 === 0 ? '正常' : '已校验'
}));

const modal = reactive({
  open: false,
  title: '',
  type: ''
});

const openModal = (title, type) => {
  modal.open = true;
  modal.title = title;
  modal.type = type;
};
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0 0 4px;
}

.section-header span {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chart {
  margin-top: 12px;
}

.chart-legend {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
}
</style>
