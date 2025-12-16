<template>
  <div class="grid" style="gap: 16px;">
    <div class="flex-between" style="flex-wrap: wrap; gap: 12px;">
      <div>
        <h2 style="margin: 0;">风险识别与态势评估</h2>
        <p style="margin: 4px 0 0; color: #6b7280;">威胁检测、风险画像与评分模型持续演进</p>
      </div>
      <div class="button-row">
        <button class="btn primary" @click="showScan = true">启动威胁扫描</button>
        <button class="btn success" @click="showModel = true">调整模型权重</button>
        <button class="btn warning" @click="showReport = true">生成评估报告</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">实时风险指数</div>
            <div style="font-size: 28px; font-weight: 800;">{{ riskScore }}</div>
          </div>
          <span class="badge danger">高风险</span>
        </div>
        <div class="progress-bar" style="margin-top: 12px;">
          <div class="inner" :style="{ width: riskScore + '%' }"></div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">异常告警</div>
            <div style="font-size: 28px; font-weight: 800;">{{ alerts.length }} 条</div>
          </div>
          <span class="badge warning">{{ pending }} 待处置</span>
        </div>
        <div class="progress-bar" style="margin-top: 12px;">
          <div class="inner" :style="{ width: (pending / alerts.length) * 100 + '%' }"></div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">模型覆盖率</div>
            <div style="font-size: 28px; font-weight: 800;">{{ coverage }}%</div>
          </div>
          <span class="badge success">动态调优</span>
        </div>
        <div class="progress-bar" style="margin-top: 12px;">
          <div class="inner" :style="{ width: coverage + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <h3 style="margin: 0;">高风险攻击面分布</h3>
        <small style="color: #6b7280;">模型输出 TOP10</small>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
        <div v-for="area in attackSurface" :key="area.name" class="card" style="box-shadow: none; border-style: dashed;">
          <div class="flex-between">
            <strong>{{ area.name }}</strong>
            <span class="badge" :class="area.level === '高' ? 'danger' : 'warning'">{{ area.level }}风险</span>
          </div>
          <div class="progress-bar" style="margin-top: 8px;">
            <div class="inner" :style="{ width: area.score + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 12px;">
        <h3 style="margin: 0;">告警事件明细</h3>
        <span class="badge" style="background: #eef2ff; color: #1d4ed8;">{{ alerts.length }} 条</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>事件</th>
            <th>来源</th>
            <th>资产</th>
            <th>级别</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in alerts" :key="alert.id">
            <td>{{ alert.time }}</td>
            <td>{{ alert.event }}</td>
            <td>{{ alert.source }}</td>
            <td>{{ alert.asset }}</td>
            <td><span class="badge" :class="levelClass(alert.level)">{{ alert.level }}</span></td>
            <td>{{ alert.status }}</td>
            <td class="button-row">
              <button class="btn ghost" @click="openAlert(alert)">查看</button>
              <button class="btn success" @click="handleAlert(alert)">处置</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showScan" title="威胁扫描进度">
      <p>正在对关键资产执行深度扫描</p>
      <div class="progress-bar" style="margin-bottom: 8px;">
        <div class="inner" :style="{ width: scanProgress + '%' }"></div>
      </div>
      <ul>
        <li v-for="step in scanSteps" :key="step">{{ step }}</li>
      </ul>
      <template #footer>
        <button class="btn ghost" @click="showScan = false">关闭</button>
        <button class="btn primary" @click="runScan">重新扫描</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showModel" title="模型权重调优">
      <div class="grid" style="gap: 10px;">
        <label>异常行为检测<input type="range" min="0" max="100" v-model="weights.behavior" /></label>
        <label>威胁情报关联<input type="range" min="0" max="100" v-model="weights.ti" /></label>
        <label>资产重要度<input type="range" min="0" max="100" v-model="weights.asset" /></label>
      </div>
      <template #footer>
        <button class="btn ghost" @click="showModel = false">取消</button>
        <button class="btn success" @click="saveWeights">保存权重</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showReport" title="生成评估报告">
      <form class="grid" style="gap: 10px;">
        <label>报告周期<select v-model="reportForm.range"><option>近24小时</option><option>近7天</option><option>近30天</option></select></label>
        <label>输出格式<select v-model="reportForm.format"><option>PDF</option><option>HTML</option><option>JSON</option></select></label>
      </form>
      <template #footer>
        <button class="btn ghost" @click="showReport = false">取消</button>
        <button class="btn primary" @click="exportReport">生成</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showAlert" :title="activeAlert?.event || '告警详情'">
      <p>来源：{{ activeAlert?.source }} | 资产：{{ activeAlert?.asset }}</p>
      <p>级别：{{ activeAlert?.level }} | 状态：{{ activeAlert?.status }}</p>
      <p>推荐动作：隔离端口、下发阻断策略、触发SOAR剧本</p>
      <template #footer>
        <button class="btn ghost" @click="showAlert = false">关闭</button>
        <button class="btn success" @click="showHandle = true">执行</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showHandle" title="处置剧本">
      <p>为告警 {{ activeAlert?.event }} 选择处置动作</p>
      <div class="grid" style="gap: 8px;">
        <label><input type="checkbox" value="阻断IP" v-model="actions" /> 阻断IP</label>
        <label><input type="checkbox" value="隔离主机" v-model="actions" /> 隔离主机</label>
        <label><input type="checkbox" value="发送工单" v-model="actions" /> 发送工单</label>
      </div>
      <template #footer>
        <button class="btn ghost" @click="showHandle = false">取消</button>
        <button class="btn primary" @click="applyActions">执行</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const riskScore = ref(82);
const pending = ref(4);
const coverage = ref(92);
const showScan = ref(false);
const showModel = ref(false);
const showReport = ref(false);
const showAlert = ref(false);
const showHandle = ref(false);
const scanProgress = ref(55);
const activeAlert = ref(null);
const actions = ref([]);
const reportForm = reactive({ range: '近24小时', format: 'PDF' });
const weights = reactive({ behavior: 70, ti: 80, asset: 85 });

const attackSurface = [
  { name: '外网入口', level: '高', score: 88 },
  { name: 'VPN网关', level: '中', score: 66 },
  { name: '数据库', level: '高', score: 92 },
  { name: '办公终端', level: '中', score: 64 },
  { name: '云控制台', level: '高', score: 85 },
  { name: '邮件系统', level: '中', score: 70 },
  { name: 'API接口', level: '高', score: 81 },
  { name: '物联网', level: '中', score: 63 },
  { name: '域控', level: '高', score: 90 },
  { name: '容器集群', level: '中', score: 68 }
];

const alerts = reactive([
  { id: 1, time: '10:21', event: '异常登录尝试', source: 'EDR', asset: '终端-01', level: '高', status: '待处置' },
  { id: 2, time: '10:18', event: '数据库高风险SQL', source: 'DB审计', asset: 'DB-02', level: '高', status: '已分析' },
  { id: 3, time: '10:15', event: '横向移动迹象', source: 'NDR', asset: '交换机', level: '高', status: '待处置' },
  { id: 4, time: '10:10', event: '邮件钓鱼链接', source: '邮件网关', asset: '邮箱-07', level: '中', status: '已阻断' },
  { id: 5, time: '10:05', event: '异常流量激增', source: 'WAF', asset: '门户站点', level: '中', status: '已分析' },
  { id: 6, time: '09:59', event: '弱口令暴力破解', source: 'VPN', asset: 'VPN-01', level: '高', status: '已阻断' },
  { id: 7, time: '09:55', event: '恶意脚本执行', source: 'EDR', asset: '终端-09', level: '中', status: '待处置' },
  { id: 8, time: '09:50', event: '异常文件落地', source: 'EDR', asset: '终端-12', level: '中', status: '已分析' },
  { id: 9, time: '09:45', event: 'DNS隧道行为', source: 'NDR', asset: '防火墙', level: '高', status: '待处置' },
  { id: 10, time: '09:40', event: '配置基线偏离', source: 'CMP', asset: '服务器-03', level: '中', status: '待调整' },
  { id: 11, time: '09:35', event: '威胁情报命中', source: 'TI', asset: '公网IP', level: '中', status: '已标记' }
]);

const scanSteps = reactive(['端口探测', '指纹识别', '漏洞验证', '威胁关联', '评分计算']);

const runScan = () => {
  scanProgress.value = 0;
  scanSteps.splice(0, scanSteps.length, '端口探测', '指纹识别', '漏洞验证', '威胁关联', '评分计算');
  const timer = setInterval(() => {
    if (scanProgress.value >= 100) {
      clearInterval(timer);
    } else {
      scanProgress.value += 25;
    }
  }, 300);
};

const levelClass = (level) => ({ danger: level === '高', warning: level === '中', success: level === '低' });

const openAlert = (alert) => {
  activeAlert.value = alert;
  showAlert.value = true;
};

const handleAlert = (alert) => {
  activeAlert.value = alert;
  showHandle.value = true;
};

const applyActions = () => {
  showHandle.value = false;
};

const saveWeights = () => {
  showModel.value = false;
};

const exportReport = () => {
  showReport.value = false;
};
</script>
