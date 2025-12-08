<template>
  <div class="card" style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">采集概览</h3>
        <p class="helper-text" style="margin: 0.2rem 0 0;">数据采集与对比分析，一键触发弹窗操作</p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="primary-btn" @click="showCollection = true">新增采集</button>
        <button class="secondary-btn" @click="showCompare = true">对比分群</button>
        <button class="secondary-btn" @click="showAnomaly = true">异常预警</button>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
      <div class="card" style="box-shadow: none; border: 1px dashed #cbd5e1;">
        <p class="helper-text" style="margin: 0;">近 7 天采集量</p>
        <h2 style="margin: 0.2rem 0 0;">{{ collectionStats.total }} 万</h2>
        <p class="helper-text">覆盖 5 个渠道，采集成功率 {{ collectionStats.success }}%</p>
      </div>
      <div class="card" style="box-shadow: none; border: 1px dashed #cbd5e1;">
        <p class="helper-text" style="margin: 0;">同步到仓库</p>
        <h2 style="margin: 0.2rem 0 0;">{{ collectionStats.synced }} 万</h2>
        <p class="helper-text">自动清洗、去重、标签化后写入</p>
      </div>
      <div class="card" style="box-shadow: none; border: 1px dashed #cbd5e1;">
        <p class="helper-text" style="margin: 0;">异常警报</p>
        <h2 style="margin: 0.2rem 0 0;">{{ collectionStats.alerts }} 条</h2>
        <p class="helper-text">集中在点击率突降、停留时长异常</p>
      </div>
    </div>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">渠道表现</h3>
        <p class="helper-text" style="margin: 0.25rem 0 0;">每个渠道不少于 10 条记录的表格展示</p>
      </div>
      <button class="secondary-btn" @click="showTrend = true">趋势弹窗</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>渠道</th>
          <th>展示</th>
          <th>点击</th>
          <th>转化</th>
          <th>转化率</th>
          <th>成本</th>
          <th>留存 7 日</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in channelRows" :key="row.channel">
          <td>{{ row.channel }}</td>
          <td>{{ row.impressions.toLocaleString() }}</td>
          <td>{{ row.clicks.toLocaleString() }}</td>
          <td>{{ row.conversions }}</td>
          <td>{{ row.cvr }}%</td>
          <td>¥{{ row.cost }}</td>
          <td>{{ row.retention }}%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showCollection" title="新增采集任务" subtitle="表单弹窗" @close="showCollection = false">
    <div class="form-grid">
      <label>
        <span class="helper-text">渠道</span>
        <select class="input" v-model="collectionForm.channel">
          <option>信息流</option>
          <option>短视频</option>
          <option>搜索广告</option>
          <option>展示广告</option>
          <option>OTT</option>
        </select>
      </label>
      <label>
        <span class="helper-text">采集频率</span>
        <select class="input" v-model="collectionForm.freq">
          <option>每小时</option>
          <option>每 3 小时</option>
          <option>每日</option>
        </select>
      </label>
      <label>
        <span class="helper-text">落地页 URL</span>
        <input class="input" v-model="collectionForm.url" placeholder="https://" />
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showCollection = false">取消</button>
      <button class="primary-btn" @click="createCollection">创建并采集</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showCompare" title="分群对比" subtitle="表单弹窗" @close="showCompare = false">
    <div class="form-grid">
      <label>
        <span class="helper-text">对比维度</span>
        <select class="input" v-model="compareForm.dimension">
          <option>省份</option>
          <option>年龄段</option>
          <option>素材类型</option>
          <option>投放时段</option>
        </select>
      </label>
      <label>
        <span class="helper-text">指标</span>
        <select class="input" v-model="compareForm.metric">
          <option>点击率</option>
          <option>转化率</option>
          <option>CPA</option>
        </select>
      </label>
      <label>
        <span class="helper-text">对比组数量</span>
        <input class="input" type="number" min="2" v-model="compareForm.groups" />
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showCompare = false">取消</button>
      <button class="primary-btn" @click="openCompareProgress">开始对比</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showCompareProgress" title="对比计算" subtitle="进度条弹窗" @close="showCompareProgress = false">
    <p class="helper-text">系统正在为 {{ compareForm.dimension }} 计算 {{ compareForm.metric }} 差异。</p>
    <div class="progress-shell" style="margin-top: 0.5rem;">
      <div class="progress-inner" :style="{ width: compareProgress + '%' }"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-if="showAnomaly" title="异常预警" subtitle="提示信息弹窗" @close="showAnomaly = false">
    <p class="helper-text">点击率、转化率与停留时长出现波动，我们建议暂停部分流量。</p>
    <ul class="helper-text" style="padding-left: 1.1rem; display: grid; gap: 0.25rem;">
      <li>短视频渠道 CTR 突降 23%，可能与素材疲劳相关</li>
      <li>搜索广告 CVR 上升 11%，可考虑扩大预算</li>
      <li>OTT 渠道停留时长下降 15 秒，建议检查落地页</li>
    </ul>
  </ModalDialog>

  <ModalDialog v-if="showTrend" title="趋势洞察" subtitle="提示信息弹窗" @close="showTrend = false">
    <p class="helper-text">近 7 天整体转化趋势持续回升，周末时段点击贡献 36%。</p>
    <div style="display: grid; gap: 0.75rem; margin-top: 0.5rem;">
      <div v-for="row in channelRows.slice(0, 5)" :key="row.channel" class="card" style="box-shadow: none; border: 1px solid #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong>{{ row.channel }}</strong>
          <span class="badge">CTR {{ row.cvr }}%</span>
        </div>
        <div class="progress-shell" style="margin-top: 0.45rem;">
          <div class="progress-inner" :style="{ width: Math.min(row.cvr * 4, 100) + '%' }"></div>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showCollection = ref(false);
const showCompare = ref(false);
const showAnomaly = ref(false);
const showTrend = ref(false);
const showCompareProgress = ref(false);
const compareProgress = ref(35);

const collectionStats = reactive({ total: 128, success: 98.6, synced: 117, alerts: 3 });

const channelRows = reactive([
  { channel: '信息流-A', impressions: 210000, clicks: 10230, conversions: 613, cvr: 6.0, cost: 0.82, retention: 42 },
  { channel: '信息流-B', impressions: 180000, clicks: 9510, conversions: 538, cvr: 5.6, cost: 0.78, retention: 40 },
  { channel: '短视频-A', impressions: 265000, clicks: 12580, conversions: 704, cvr: 5.9, cost: 0.73, retention: 44 },
  { channel: '短视频-B', impressions: 198000, clicks: 11012, conversions: 586, cvr: 5.3, cost: 0.76, retention: 41 },
  { channel: '搜索-品牌', impressions: 87000, clicks: 9512, conversions: 1220, cvr: 12.8, cost: 0.56, retention: 55 },
  { channel: '搜索-通用', impressions: 124000, clicks: 10020, conversions: 715, cvr: 7.1, cost: 0.62, retention: 47 },
  { channel: '展示-高意向', impressions: 96000, clicks: 6022, conversions: 188, cvr: 3.1, cost: 0.95, retention: 28 },
  { channel: '展示-广泛', impressions: 175000, clicks: 7120, conversions: 202, cvr: 2.8, cost: 1.12, retention: 26 },
  { channel: 'OTT-客厅', impressions: 43000, clicks: 2811, conversions: 130, cvr: 4.6, cost: 1.34, retention: 24 },
  { channel: 'OTT-卧室', impressions: 38000, clicks: 2604, conversions: 120, cvr: 4.6, cost: 1.28, retention: 23 },
  { channel: '联盟-再营销', impressions: 54000, clicks: 5420, conversions: 256, cvr: 4.7, cost: 0.88, retention: 37 },
]);

const collectionForm = reactive({ channel: '信息流', freq: '每小时', url: 'https://example.com' });
const compareForm = reactive({ dimension: '省份', metric: '点击率', groups: 4 });

const createCollection = () => {
  showCollection.value = false;
  showCompareProgress.value = true;
  compareProgress.value = 42;
};

const openCompareProgress = () => {
  showCompare.value = false;
  compareProgress.value = 0;
  showCompareProgress.value = true;
  setTimeout(() => (compareProgress.value = 65), 200);
  setTimeout(() => (compareProgress.value = 100), 400);
};
</script>
