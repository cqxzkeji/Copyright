<template>
  <div class="grid" style="gap: 16px;">
    <div class="header-actions" style="justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 10px; align-items: center;">
        <h2 style="margin: 0;">异常告警管理</h2>
        <span class="tag">实时防护</span>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openRule">新增规则</button>
        <button class="secondary-btn" @click="showProgress = true">批量确认</button>
        <button class="secondary-btn" @click="showGuide = true">操作提示</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card">
        <div style="color: #6b7280;">今日告警</div>
        <div style="font-size: 26px; font-weight: 800;">34</div>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="progress-inner" :style="{ width: '54%', background: 'linear-gradient(90deg,#f97316,#fb923c)' }"></div>
        </div>
      </div>
      <div class="card">
        <div style="color: #6b7280;">已处理</div>
        <div style="font-size: 26px; font-weight: 800;">22</div>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="progress-inner" :style="{ width: '72%' }"></div>
        </div>
      </div>
      <div class="card">
        <div style="color: #6b7280;">未处理</div>
        <div style="font-size: 26px; font-weight: 800;">12</div>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="progress-inner" :style="{ width: '36%', background: 'linear-gradient(90deg,#f43f5e,#fb7185)' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>告警趋势</strong>
        <button class="secondary-btn" @click="showTrendInfo = true">查看描述</button>
      </div>
      <div class="chart-placeholder" style="margin-top: 14px; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));">
        <div v-for="alert in trend" :key="alert.name" class="bar" :style="{ height: `${alert.count}px`, background: 'linear-gradient(180deg,#fb7185,#f43f5e)' }">
          <span>{{ alert.name }} {{ alert.count }}次</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>告警列表</strong>
        <button class="secondary-btn" @click="showTableInfo = true">表格提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>类型</th>
            <th>来源</th>
            <th>级别</th>
            <th>时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in alerts" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.source }}</td>
            <td>{{ item.level }}</td>
            <td>{{ item.time }}</td>
            <td><span class="status-chip" :style="item.level === '高' ? warnChip : goodChip">{{ item.status }}</span></td>
            <td>
              <button class="secondary-btn" @click="openDetail(item)">处理</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showRuleModal" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">新增告警规则</div>
      <div class="modal-body">
        <div class="form-group">
          <label>规则名称</label>
          <input v-model="rule.name" placeholder="如：出口链路丢包" />
        </div>
        <div class="form-group">
          <label>阈值</label>
          <input v-model="rule.threshold" placeholder="如：丢包率>2%" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="secondary-btn" @click="showRuleModal = false">取消</button>
        <button class="primary-btn" @click="saveRule">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">批量确认</div>
      <div class="modal-body">
        <div class="progress-bar">
          <div class="progress-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="margin-top: 8px;">正在批量确认未处理告警...</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showProgress = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showGuide" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">操作提示</div>
      <div class="modal-body">
        <p>新增规则可绑定短信/邮件通知，批量确认用于快速消除已处理告警。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showGuide = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showTrendInfo" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">趋势说明</div>
      <div class="modal-body">
        <p>柱子高度表示当日告警数量，可用于发现集中爆发的时间段。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showTrendInfo = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showTableInfo" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">表格提示</div>
      <div class="modal-body">
        <p>高等级告警默认需要立即处理，请使用“处理”按钮记录处理结果。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showTableInfo = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="detail" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">告警处理 - {{ detail.id }}</div>
      <div class="modal-body">
        <p>类型：{{ detail.type }}</p>
        <p>来源：{{ detail.source }}</p>
        <p>级别：{{ detail.level }}</p>
        <div class="form-group">
          <label>处理动作</label>
          <textarea rows="3" v-model="detail.action" placeholder="填写处理说明"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="secondary-btn" @click="detail = null">关闭</button>
        <button class="primary-btn" @click="confirmDetail">标记完成</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

const goodChip = { background: '#dcfce7', color: '#166534' };
const warnChip = { background: '#fff7ed', color: '#ea580c' };

const alerts = ref([
  { id: 'A-001', type: '链路异常', source: '核心路由', level: '高', time: '09:01', status: '未处理', action: '' },
  { id: 'A-002', type: '设备离线', source: '分支交换', level: '中', time: '09:12', status: '处理中', action: '' },
  { id: 'A-003', type: '流量激增', source: '出口防火墙', level: '高', time: '09:24', status: '未处理', action: '' },
  { id: 'A-004', type: '认证失败', source: '接入网关', level: '低', time: '09:35', status: '未处理', action: '' },
  { id: 'A-005', type: 'BGP抖动', source: '核心路由', level: '高', time: '09:42', status: '未处理', action: '' },
  { id: 'A-006', type: 'CPU过高', source: '监控节点', level: '中', time: '09:58', status: '处理中', action: '' },
  { id: 'A-007', type: '内存告警', source: '日志服务器', level: '中', time: '10:15', status: '未处理', action: '' },
  { id: 'A-008', type: '接口超时', source: '支付网关', level: '高', time: '10:26', status: '未处理', action: '' },
  { id: 'A-009', type: '磁盘告警', source: '报表中心', level: '中', time: '10:39', status: '处理中', action: '' },
  { id: 'A-010', type: '连接失败', source: '数据库集群', level: '高', time: '10:44', status: '未处理', action: '' },
  { id: 'A-011', type: '链路抖动', source: '云专线', level: '中', time: '10:58', status: '未处理', action: '' }
]);

const trend = ref([
  { name: '00-04', count: 80 },
  { name: '04-08', count: 60 },
  { name: '08-12', count: 140 },
  { name: '12-16', count: 90 },
  { name: '16-20', count: 110 }
]);

const rule = reactive({ name: '', threshold: '' });
const showRuleModal = ref(false);
const showProgress = ref(false);
const showGuide = ref(false);
const showTrendInfo = ref(false);
const showTableInfo = ref(false);
const detail = ref(null);
const progress = ref(20);

const openRule = () => (showRuleModal.value = true);

const saveRule = () => {
  showRuleModal.value = false;
  showGuide.value = true;
};

const openDetail = (item) => {
  detail.value = item;
};

const confirmDetail = () => {
  if (!detail.value) return;
  detail.value.status = '已处理';
  detail.value = null;
};

onMounted(() => {
  const timer = setInterval(() => {
    if (!showProgress.value) return;
    progress.value = Math.min(100, progress.value + 25);
    if (progress.value >= 100) {
      showProgress.value = false;
      progress.value = 20;
    }
  }, 400);
  return () => clearInterval(timer);
});
</script>
