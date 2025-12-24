<template>
  <div class="page">
    <div class="card-grid">
      <div class="stat-card" v-for="item in kpis" :key="item.label">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800;font-size:16px;">{{ item.label }}</div>
            <div class="muted-text">{{ item.desc }}</div>
          </div>
          <span class="badge" :class="item.trend > 0 ? 'success' : 'warn'">{{ item.trend > 0 ? '+' : '' }}{{ item.trend }}%</span>
        </div>
        <div style="font-size:28px;font-weight:800;margin:6px 0;">{{ item.value }}</div>
        <div class="progress-bar"><span :style="{ width: item.progress + '%'}"></span></div>
      </div>
    </div>

    <div class="chart-row">
      <div class="table-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3>乡镇访客流量趋势</h3>
          <button @click="showRefreshModal = true">刷新趋势</button>
        </div>
        <div class="line-chart">
          <div
            v-for="(point, idx) in trafficPoints"
            :key="idx"
            class="line-point"
            :style="{ left: point.x + '%', top: point.y + '%' }"
          ></div>
          <div
            v-for="(seg, idx) in pathSegments"
            :key="'seg-' + idx"
            class="line-path"
            :style="{
              left: seg.left + '%',
              top: seg.top + '%',
              width: seg.width + '%',
              transform: `rotate(${seg.angle}deg)`
            }"
          ></div>
        </div>
      </div>
      <div class="table-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3>爆款品类分布</h3>
          <button @click="showAlertModal = true">异常提醒</button>
        </div>
        <div class="bar-chart">
          <div v-for="(bar, idx) in hotCategories" :key="idx" class="bar" :style="{ height: bar.height + 'px' }" title="bar.name"></div>
        </div>
        <div class="toolbar">
          <span v-for="tag in tags" :key="tag" class="tag-pill">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3>乡镇实时运营监控（20条+）</h3>
        <div class="table-actions">
          <button @click="openDispatchModal">联动调度</button>
          <button @click="openProgressModal">批量同步</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>乡镇</th>
            <th>今日成交</th>
            <th>退款率</th>
            <th>时效</th>
            <th>风险提示</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in townRows" :key="row.town">
            <td>{{ row.town }}</td>
            <td>{{ row.amount }}</td>
            <td>{{ row.refund }}%</td>
            <td>{{ row.time }}h</td>
            <td><span class="badge" :class="row.level">{{ row.notice }}</span></td>
            <td class="table-actions">
              <button @click="openDetail(row)">查看</button>
              <button @click="openAlert(row)">推送提醒</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="showRefreshModal" title="更新趋势" @close="showRefreshModal = false">
      <p>确认立即拉取最近 30 分钟流量数据？</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="showRefreshModal = false">取消</button>
        <button @click="applyRefresh">确认拉取</button>
      </div>
    </Modal>

    <Modal v-if="showAlertModal" title="风险提示" @close="showAlertModal = false">
      <p>系统检测到部分品类动销异常，是否生成预警周报并抄送运营组？</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="showAlertModal = false">稍后处理</button>
        <button @click="showAlertModal = false">生成周报</button>
      </div>
    </Modal>

    <Modal v-if="dispatchModal" title="联动调度" @close="dispatchModal = false">
      <form @submit.prevent="dispatch" style="display:grid;gap:12px;">
        <div>
          <label>调度主题</label>
          <input v-model="dispatchForm.topic" required placeholder="如：低温天气保供" />
        </div>
        <div>
          <label>覆盖区域</label>
          <select v-model="dispatchForm.area" required>
            <option disabled value="">请选择</option>
            <option v-for="town in townRows" :key="town.town">{{ town.town }}</option>
          </select>
        </div>
        <div>
          <label>调度指令</label>
          <textarea v-model="dispatchForm.command" required rows="3" placeholder="填写调度动作、负责人、目标时效"></textarea>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="dispatchModal = false">取消</button>
          <button type="submit">发布调度</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="progressModal" title="批量同步" @close="progressModal = false">
      <p class="muted-text">已触发数据同步，保持页面即可完成。</p>
      <div class="progress-bar" style="margin:12px 0;height:14px;">
        <span :style="{ width: progress + '%'}"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="progressModal = false">关闭</button>
        <button @click="progress = Math.min(100, progress + 20)">推进 20%</button>
      </div>
    </Modal>

    <Modal v-if="detailModal" :title="activeTown?.town + '经营详情'" @close="detailModal = false">
      <p>成交：{{ activeTown?.amount }}，退款率：{{ activeTown?.refund }}%，时效：{{ activeTown?.time }}h。</p>
      <p class="muted-text">按本周指标线监控，若超标系统将自动触发短信。</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="detailModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="alertModal" :title="activeTown?.town + '推送提醒'" @close="alertModal = false">
      <form @submit.prevent="alertModal = false" style="display:grid;gap:12px;">
        <div>
          <label>提醒类型</label>
          <select required>
            <option>库存补货</option>
            <option>配送加急</option>
            <option>渠道优化</option>
          </select>
        </div>
        <div>
          <label>备注</label>
          <textarea rows="3" placeholder="写下需要同步的信息"></textarea>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="alertModal = false">取消</button>
          <button type="submit">发送提醒</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const kpis = [
  { label: 'GMV(日)', value: '¥1,283,900', desc: '乡村主站+小程序', trend: 6.3, progress: 72 },
  { label: '支付转化', value: '12.6%', desc: '下单-支付', trend: 1.2, progress: 64 },
  { label: '履约准时', value: '96.8%', desc: '订单48h送达率', trend: 2.1, progress: 88 },
  { label: '售后关闭率', value: '89.4%', desc: '关闭/发起', trend: -1.4, progress: 54 }
];

const trafficPoints = [
  { x: 5, y: 80 },
  { x: 20, y: 66 },
  { x: 35, y: 58 },
  { x: 50, y: 44 },
  { x: 65, y: 35 },
  { x: 80, y: 40 },
  { x: 95, y: 32 }
];

const hotCategories = [
  { name: '农特产', height: 120 },
  { name: '米面粮油', height: 140 },
  { name: '果蔬生鲜', height: 160 },
  { name: '家禽蛋类', height: 150 },
  { name: '地方小吃', height: 110 },
  { name: '加工半成品', height: 100 }
];

const tags = ['渠道拓新', '供应保障', '退货异常', '团购火热', '产地直发', '冷链监控'];

const townRows = reactive([
  { town: '黄花镇', amount: '¥62,400', refund: 2.6, time: 4.2, notice: '库存紧张', level: 'warn' },
  { town: '双桥镇', amount: '¥58,120', refund: 3.1, time: 6.1, notice: '运输加急', level: 'info' },
  { town: '石门镇', amount: '¥72,930', refund: 1.8, time: 3.9, notice: '正常', level: 'success' },
  { town: '凤凰镇', amount: '¥49,210', refund: 4.2, time: 5.4, notice: '售后关注', level: 'warn' },
  { town: '梅溪镇', amount: '¥81,330', refund: 1.5, time: 3.2, notice: '正常', level: 'success' },
  { town: '龙潭镇', amount: '¥55,470', refund: 2.1, time: 4.8, notice: '时效预警', level: 'warn' },
  { town: '梧桐镇', amount: '¥64,510', refund: 1.9, time: 4.1, notice: '正常', level: 'success' },
  { town: '坪山镇', amount: '¥57,880', refund: 3.8, time: 5.6, notice: '库存紧张', level: 'warn' },
  { town: '白石镇', amount: '¥73,660', refund: 2.3, time: 3.5, notice: '正常', level: 'success' },
  { town: '高岭镇', amount: '¥68,920', refund: 2.0, time: 4.0, notice: '正常', level: 'success' },
  { town: '水田镇', amount: '¥54,430', refund: 2.7, time: 4.6, notice: '运输加急', level: 'info' },
  { town: '长岗镇', amount: '¥61,300', refund: 1.6, time: 3.7, notice: '正常', level: 'success' },
  { town: '棠梨镇', amount: '¥46,780', refund: 4.5, time: 6.0, notice: '售后关注', level: 'warn' },
  { town: '青龙镇', amount: '¥59,450', refund: 2.2, time: 4.1, notice: '正常', level: 'success' },
  { town: '朱砂镇', amount: '¥63,510', refund: 2.5, time: 4.4, notice: '正常', level: 'success' },
  { town: '石柱镇', amount: '¥69,820', refund: 1.7, time: 3.9, notice: '正常', level: 'success' },
  { town: '龙泉镇', amount: '¥65,900', refund: 2.8, time: 4.7, notice: '库存紧张', level: 'warn' },
  { town: '杨梅镇', amount: '¥52,300', refund: 3.4, time: 5.3, notice: '运输加急', level: 'info' },
  { town: '花桥镇', amount: '¥47,650', refund: 4.8, time: 6.3, notice: '售后关注', level: 'warn' },
  { town: '秀水镇', amount: '¥60,780', refund: 2.4, time: 4.2, notice: '正常', level: 'success' },
  { town: '天台镇', amount: '¥58,900', refund: 2.9, time: 4.9, notice: '正常', level: 'success' }
]);

const showRefreshModal = ref(false);
const showAlertModal = ref(false);
const dispatchModal = ref(false);
const progressModal = ref(false);
const detailModal = ref(false);
const alertModal = ref(false);
const progress = ref(20);
const activeTown = ref(null);
const dispatchForm = reactive({ topic: '', area: '', command: '' });

const pathSegments = computed(() => {
  const segments = [];
  for (let i = 0; i < trafficPoints.length - 1; i++) {
    const a = trafficPoints[i];
    const b = trafficPoints[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    segments.push({
      left: a.x,
      top: a.y,
      width: length,
      angle
    });
  }
  return segments;
});

const openDispatchModal = () => {
  dispatchModal.value = true;
};

const openProgressModal = () => {
  progressModal.value = true;
  progress.value = 30;
};

const dispatch = () => {
  dispatchModal.value = false;
};

const openDetail = (row) => {
  activeTown.value = row;
  detailModal.value = true;
};

const openAlert = (row) => {
  activeTown.value = row;
  alertModal.value = true;
};

const applyRefresh = () => {
  progress.value = 60;
  showRefreshModal.value = false;
  progressModal.value = true;
};
</script>
