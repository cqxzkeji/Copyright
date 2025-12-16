<template>
  <div class="grid" style="gap: 16px;">
    <div class="flex-between" style="flex-wrap: wrap; gap: 12px;">
      <div>
        <h2 style="margin: 0;">安全态势可视化与分析</h2>
        <p style="margin: 4px 0 0; color: #6b7280;">多维指标、趋势、拓扑画像一目了然</p>
      </div>
      <div class="button-row">
        <button class="btn primary" @click="showShare = true">分享看板</button>
        <button class="btn success" @click="showFilter = true">筛选维度</button>
        <button class="btn warning" @click="showForecast = true">趋势预测</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">攻击阻断</div>
            <div style="font-size: 28px; font-weight: 800;">1,284 次</div>
          </div>
          <span class="badge success">+18%</span>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">资产在线</div>
            <div style="font-size: 28px; font-weight: 800;">312 台</div>
          </div>
          <span class="badge warning">维护 6 台</span>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">告警闭环</div>
            <div style="font-size: 28px; font-weight: 800;">93%</div>
          </div>
          <span class="badge success">效率提升</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 12px;">
        <h3 style="margin: 0;">威胁趋势折线图</h3>
        <small style="color: #6b7280;">近7日</small>
      </div>
      <div style="display: flex; align-items: flex-end; gap: 8px; height: 220px;">
        <div v-for="point in trend" :key="point.day" style="flex: 1;">
          <div style="height: 180px; display: flex; align-items: flex-end;">
            <div style="width: 100%; background: linear-gradient(180deg, #2c7dfa, #a5b4fc); border-radius: 12px;" :style="{ height: point.value + 'px' }"></div>
          </div>
          <div style="text-align: center; margin-top: 6px; color: #6b7280;">{{ point.day }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <h3 style="margin: 0;">资产风险热力表</h3>
        <span class="badge" style="background: #eef2ff; color: #1d4ed8;">{{ assets.length }} 项</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>资产</th>
            <th>类型</th>
            <th>风险评分</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asset in assets" :key="asset.name">
            <td>{{ asset.name }}</td>
            <td>{{ asset.type }}</td>
            <td>
              <div class="progress-bar" style="height: 10px;">
                <div class="inner" :style="{ width: asset.score + '%', background: asset.score > 80 ? '#ef4444' : '#f59e0b' }"></div>
              </div>
            </td>
            <td><span class="badge" :class="asset.status === '关注' ? 'warning' : 'success'">{{ asset.status }}</span></td>
            <td class="button-row">
              <button class="btn ghost" @click="openAsset(asset)">详情</button>
              <button class="btn success" @click="showTune = true">优化</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showShare" title="分享看板">
      <p>选择共享范围</p>
      <div class="grid" style="gap: 8px;">
        <label><input type="checkbox" value="SOC团队" v-model="shareTo" /> SOC团队</label>
        <label><input type="checkbox" value="应急响应" v-model="shareTo" /> 应急响应</label>
        <label><input type="checkbox" value="管理层" v-model="shareTo" /> 管理层</label>
      </div>
      <template #footer>
        <button class="btn ghost" @click="showShare = false">取消</button>
        <button class="btn primary" @click="shareBoard">生成链接</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showFilter" title="筛选维度">
      <form class="grid" style="gap: 10px;">
        <label>威胁类型<select multiple v-model="filters.types"><option>网络攻击</option><option>账户安全</option><option>恶意软件</option><option>配置基线</option></select></label>
        <label>时间<select v-model="filters.range"><option>近24小时</option><option>近7天</option><option>近30天</option></select></label>
      </form>
      <template #footer>
        <button class="btn ghost" @click="showFilter = false">关闭</button>
        <button class="btn success" @click="applyFilter">应用</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showForecast" title="趋势预测">
      <p>基于历史趋势和威胁情报生成预测曲线</p>
      <div class="progress-bar" style="margin-bottom: 8px;">
        <div class="inner" :style="{ width: forecastProgress + '%' }"></div>
      </div>
      <template #footer>
        <button class="btn ghost" @click="showForecast = false">关闭</button>
        <button class="btn primary" @click="runForecast">重新预测</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showAsset" :title="activeAsset?.name || '资产详情'">
      <p>类型：{{ activeAsset?.type }} | 风险评分：{{ activeAsset?.score }}</p>
      <p>建议：{{ activeAsset?.advice }}</p>
      <template #footer>
        <button class="btn ghost" @click="showAsset = false">关闭</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showTune" title="优化建议">
      <p>根据当前风险分布自动生成优化建议</p>
      <ul>
        <li>启用零信任策略，缩小访问域</li>
        <li>提升高风险资产的补丁频率</li>
        <li>开启异常行为的实时告警</li>
      </ul>
      <template #footer>
        <button class="btn ghost" @click="showTune = false">关闭</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showShare = ref(false);
const showFilter = ref(false);
const showForecast = ref(false);
const showAsset = ref(false);
const showTune = ref(false);
const forecastProgress = ref(64);
const shareTo = ref(['SOC团队']);
const activeAsset = ref(null);

const trend = [
  { day: '周一', value: 120 },
  { day: '周二', value: 160 },
  { day: '周三', value: 140 },
  { day: '周四', value: 180 },
  { day: '周五', value: 210 },
  { day: '周六', value: 170 },
  { day: '周日', value: 155 }
];

const assets = reactive([
  { name: '核心数据库', type: '数据库', score: 92, status: '关注', advice: '开启WAF虚拟补丁' },
  { name: '域控服务器', type: '域控', score: 88, status: '关注', advice: '强化双因子验证' },
  { name: '云控制台', type: 'IaaS', score: 85, status: '关注', advice: '启用访问审计' },
  { name: '办公终端集群', type: '终端', score: 76, status: '观察', advice: '提升EDR策略敏感度' },
  { name: '邮件网关', type: '安全设备', score: 74, status: '观察', advice: '更新反垃圾策略' },
  { name: '容器集群', type: 'K8s', score: 81, status: '关注', advice: '加固镜像扫描' },
  { name: 'VPN网关', type: '网络', score: 79, status: '观察', advice: '优化访问控制' },
  { name: '研发仓库', type: '代码仓', score: 70, status: '观察', advice: '启用安全扫描' },
  { name: '物联网平台', type: 'IoT', score: 68, status: '观察', advice: '限制外联访问' },
  { name: '日志中心', type: '日志', score: 66, status: '观察', advice: '提升存储配额' }
]);

const filters = reactive({ types: ['网络攻击'], range: '近7天' });

const shareBoard = () => {
  showShare.value = false;
};

const applyFilter = () => {
  showFilter.value = false;
};

const runForecast = () => {
  forecastProgress.value = 0;
  const timer = setInterval(() => {
    if (forecastProgress.value >= 100) {
      clearInterval(timer);
    } else {
      forecastProgress.value += 20;
    }
  }, 300);
};

const openAsset = (asset) => {
  activeAsset.value = asset;
  showAsset.value = true;
};
</script>
