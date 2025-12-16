<template>
  <div class="grid" style="gap: 16px;">
    <div class="flex-between" style="gap: 12px; flex-wrap: wrap;">
      <div>
        <h2 style="margin: 0;">安全数据采集与接入</h2>
        <p style="margin: 4px 0 0; color: #6b7280;">统一接入多源数据，保障采集链路稳定</p>
      </div>
      <div class="button-row">
        <button class="btn primary" @click="showAdd = true">新增数据源</button>
        <button class="btn success" @click="startJob">启动采集</button>
        <button class="btn warning" @click="showTest = true">连通性检测</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">今日采集量</div>
            <div style="font-size: 26px; font-weight: 800;">{{ metrics.today }} GB</div>
          </div>
          <span class="badge success">+12%</span>
        </div>
        <div class="progress-bar" style="margin-top: 12px;">
          <div class="inner" :style="{ width: metrics.todayProgress + '%' }"></div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">平均延迟</div>
            <div style="font-size: 26px; font-weight: 800;">{{ metrics.latency }} ms</div>
          </div>
          <span class="badge warning">抖动 {{ metrics.jitter }}ms</span>
        </div>
        <div class="progress-bar" style="margin-top: 12px;">
          <div class="inner" :style="{ width: '70%' }"></div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">失败重试</div>
            <div style="font-size: 26px; font-weight: 800;">{{ metrics.retry }}</div>
          </div>
          <span class="badge danger">{{ metrics.retryRate }}% </span>
        </div>
        <div class="progress-bar" style="margin-top: 12px;">
          <div class="inner" :style="{ width: metrics.retryRate + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 12px;">
        <h3 style="margin: 0;">采集链路吞吐趋势</h3>
        <small style="color: #6b7280;">单位：GB</small>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 10px; align-items: end;">
        <div v-for="point in throughput" :key="point.label" style="text-align: center;">
          <div style="background: linear-gradient(180deg, #2c7dfa, #67e8f9); border-radius: 10px; width: 100%;" :style="{ height: point.value * 3 + 'px' }"></div>
          <div style="margin-top: 6px; font-size: 13px; color: #6b7280;">{{ point.label }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 12px;">
        <h3 style="margin: 0;">数据源接入明细</h3>
        <span class="badge" style="background: #eef2ff; color: #1d4ed8;">共 {{ sources.length }} 条</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>数据源</th>
            <th>类型</th>
            <th>状态</th>
            <th>采集频率</th>
            <th>延迟</th>
            <th>最新同步</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="source in sources" :key="source.name">
            <td>{{ source.name }}</td>
            <td>{{ source.type }}</td>
            <td><span class="badge" :class="statusClass(source.status)">{{ source.status }}</span></td>
            <td>{{ source.schedule }}</td>
            <td>{{ source.latency }} ms</td>
            <td>{{ source.updated }}</td>
            <td class="button-row">
              <button class="btn ghost" @click="openDetail(source)">详情</button>
              <button class="btn success" @click="openOptimize(source)">优化</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showAdd" title="新增数据源">
      <form class="grid" style="gap: 12px;">
        <div>
          <label>名称</label>
          <input v-model="form.name" placeholder="如：防火墙日志" />
        </div>
        <div>
          <label>类型</label>
          <select v-model="form.type">
            <option>Syslog</option>
            <option>API</option>
            <option>数据库</option>
            <option>Agent</option>
          </select>
        </div>
        <div>
          <label>采集频率</label>
          <input v-model="form.schedule" placeholder="*/5 * * * *" />
        </div>
      </form>
      <template #footer>
        <button class="btn ghost" @click="showAdd = false">取消</button>
        <button class="btn primary" @click="submitSource">保存</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showTest" title="连通性检测">
      <p style="margin: 0 0 10px;">正在对所选数据源进行握手与链路探测</p>
      <div class="progress-bar">
        <div class="inner" :style="{ width: testProgress + '%' }"></div>
      </div>
      <ul>
        <li v-for="log in testLogs" :key="log">{{ log }}</li>
      </ul>
      <template #footer>
        <button class="btn primary" @click="triggerTest">重新检测</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showDetail" :title="activeSource?.name || '详情'">
      <p>采集路径：{{ activeSource?.path }}</p>
      <p>最近5次同步成功率：{{ activeSource?.success }}%</p>
      <p>告警：{{ activeSource?.alerts.join('、') }}</p>
      <template #footer>
        <button class="btn ghost" @click="showDetail = false">关闭</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showOptimize" title="采集链路优化">
      <p>为数据源 {{ activeSource?.name }} 选择优化策略</p>
      <div class="grid" style="gap: 8px;">
        <label><input type="radio" value="压缩" v-model="optimize" /> 启用压缩传输</label>
        <label><input type="radio" value="分片" v-model="optimize" /> 分片并行</label>
        <label><input type="radio" value="缓存" v-model="optimize" /> 增量缓存</label>
      </div>
      <template #footer>
        <button class="btn ghost" @click="showOptimize = false">取消</button>
        <button class="btn success" @click="applyOptimize">应用策略</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showProgress" title="采集任务执行">
      <p>正在启动采集任务，预计耗时 {{ progress }}%</p>
      <div class="progress-bar">
        <div class="inner" :style="{ width: progress + '%' }"></div>
      </div>
      <template #footer>
        <button class="btn ghost" @click="showProgress = false">关闭</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showAdd = ref(false);
const showTest = ref(false);
const showProgress = ref(false);
const showDetail = ref(false);
const showOptimize = ref(false);
const progress = ref(0);
const testProgress = ref(60);
const optimize = ref('压缩');
const activeSource = ref(null);
const form = reactive({ name: '', type: 'Syslog', schedule: '*/5 * * * *' });

const metrics = reactive({ today: 4.8, todayProgress: 76, latency: 38, jitter: 8, retry: 3, retryRate: 14 });
const throughput = [
  { label: '08:00', value: 2.1 },
  { label: '10:00', value: 3.3 },
  { label: '12:00', value: 2.8 },
  { label: '14:00', value: 4.2 },
  { label: '16:00', value: 3.7 },
  { label: '18:00', value: 5.0 },
  { label: '20:00', value: 4.4 }
];

const sources = reactive([
  { name: '防火墙日志', type: 'Syslog', status: '在线', schedule: '*/5 * * * *', latency: 35, updated: '10:21', path: '/var/log/fw', success: 99, alerts: ['无'] },
  { name: '交换机流量', type: 'Netflow', status: '在线', schedule: '*/1 * * * *', latency: 18, updated: '10:20', path: '/var/netflow', success: 98, alerts: ['丢包率1%'] },
  { name: '终端EDR', type: 'API', status: '在线', schedule: '*/10 * * * *', latency: 42, updated: '10:19', path: 'https://edr', success: 96, alerts: ['认证续期'] },
  { name: '邮件网关', type: 'API', status: '在线', schedule: '*/15 * * * *', latency: 53, updated: '10:18', path: 'https://mx', success: 94, alerts: ['延迟升高'] },
  { name: '数据库审计', type: 'Agent', status: '离线', schedule: '0 */1 * * *', latency: 120, updated: '09:55', path: '/audit/db', success: 88, alerts: ['心跳超时'] },
  { name: '云WAF', type: 'API', status: '在线', schedule: '*/2 * * * *', latency: 33, updated: '10:16', path: 'https://waf', success: 97, alerts: ['无'] },
  { name: 'VPN日志', type: 'Syslog', status: '在线', schedule: '*/3 * * * *', latency: 41, updated: '10:14', path: '/var/log/vpn', success: 95, alerts: ['证书更新'] },
  { name: 'AD认证', type: 'Agent', status: '在线', schedule: '*/6 * * * *', latency: 39, updated: '10:13', path: '/var/log/ad', success: 99, alerts: ['无'] },
  { name: '云原生日志', type: 'API', status: '在线', schedule: '*/5 * * * *', latency: 28, updated: '10:11', path: 'https://k8s', success: 97, alerts: ['无'] },
  { name: '威胁情报', type: 'API', status: '在线', schedule: '0 */2 * * *', latency: 64, updated: '10:05', path: 'https://ti', success: 92, alerts: ['配额将满'] },
  { name: '物联网日志', type: 'MQTT', status: '在线', schedule: '*/8 * * * *', latency: 48, updated: '10:02', path: '/iot', success: 93, alerts: ['无'] }
]);

const statusClass = (status) => ({ success: status === '在线', danger: status === '离线' });

const submitSource = () => {
  if (form.name) {
    sources.push({
      name: form.name,
      type: form.type,
      status: '在线',
      schedule: form.schedule,
      latency: 30,
      updated: '刚刚',
      path: '/new/source',
      success: 100,
      alerts: ['无']
    });
    showAdd.value = false;
  }
};

const startJob = () => {
  showProgress.value = true;
  progress.value = 0;
  const timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
    } else {
      progress.value += 20;
    }
  }, 300);
};

const triggerTest = () => {
  showTest.value = true;
  testProgress.value = 20;
  const steps = ['握手建立', '带宽检测', '延迟统计', '丢包分析', '结果汇总'];
  testLogs.value = [];
  let idx = 0;
  const interval = setInterval(() => {
    if (idx < steps.length) {
      testLogs.value.push(`${steps[idx]}...完成`);
      testProgress.value += 16;
      idx++;
    } else {
      clearInterval(interval);
    }
  }, 400);
};

const testLogs = ref(['握手建立...完成', '带宽检测...完成', '延迟统计...完成']);

const openDetail = (source) => {
  activeSource.value = source;
  showDetail.value = true;
};

const openOptimize = (source) => {
  activeSource.value = source;
  optimize.value = '压缩';
  showOptimize.value = true;
};

const applyOptimize = () => {
  showOptimize.value = false;
};
</script>
