<template>
  <section>
    <div class="section-title">运行监控与告警联动</div>
    <div class="card-grid">
      <div class="card">
        <h3>CPU 平均利用</h3>
        <div class="metric">78%</div>
        <div class="badge">峰值 96%</div>
      </div>
      <div class="card">
        <h3>GPU 温度</h3>
        <div class="metric">71°C</div>
        <div class="badge">最高 82°C</div>
      </div>
      <div class="card">
        <h3>告警待处理</h3>
        <div class="metric">14</div>
        <div class="badge">已确认 6 条</div>
      </div>
      <div class="card">
        <h3>日志吞吐</h3>
        <div class="metric">2.4 GB/min</div>
        <div class="badge">聚合正常</div>
      </div>
    </div>

    <div class="actions">
      <button class="action-button" @click="modals.threshold = true">新建阈值</button>
      <button class="action-button secondary" @click="modals.linkage = true">联动规则</button>
      <button class="action-button secondary" @click="modals.confirm = true">确认告警</button>
      <button class="action-button secondary" @click="modals.export = true">导出日志</button>
      <button class="action-button secondary" @click="modals.info = true">按钮提示</button>
    </div>

    <div class="chart">
      <div class="section-title">关键指标趋势</div>
      <div v-for="metric in metrics" :key="metric.name" class="bar-row">
        <div class="bar-label">{{ metric.name }}</div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: metric.value + '%' }"></div>
        </div>
        <div>{{ metric.value }}%</div>
      </div>
    </div>

    <div class="table-wrap">
      <div class="section-title">告警列表</div>
      <table>
        <thead>
          <tr>
            <th>告警编号</th>
            <th>指标</th>
            <th>节点</th>
            <th>等级</th>
            <th>触发时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in alerts" :key="alert.id">
            <td>{{ alert.id }}</td>
            <td>{{ alert.metric }}</td>
            <td>{{ alert.node }}</td>
            <td>{{ alert.level }}</td>
            <td>{{ alert.time }}</td>
            <td>{{ alert.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal :show="modals.threshold" title="新建阈值规则" @close="modals.threshold = false">
    <div class="form-grid">
      <label>
        监控指标
        <select v-model="forms.threshold.metric">
          <option>CPU 利用率</option>
          <option>GPU 温度</option>
          <option>内存占用</option>
          <option>IO 延迟</option>
        </select>
      </label>
      <label>
        阈值条件
        <input v-model="forms.threshold.condition" placeholder="例如: > 85%" />
      </label>
      <label>
        通知渠道
        <select v-model="forms.threshold.channel">
          <option>短信 + 邮件</option>
          <option>企业 IM</option>
          <option>短信</option>
        </select>
      </label>
      <label>
        说明
        <textarea v-model="forms.threshold.note" rows="2" placeholder="阈值说明"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.linkage" title="联动规则配置" @close="modals.linkage = false">
    <div class="form-grid">
      <label>
        触发告警
        <input v-model="forms.linkage.trigger" placeholder="例如: GPU 温度超限" />
      </label>
      <label>
        执行动作
        <input v-model="forms.linkage.action" placeholder="例如: 自动迁移作业" />
      </label>
      <label>
        负责人
        <input v-model="forms.linkage.owner" placeholder="负责人" />
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.confirm" title="告警确认" @close="modals.confirm = false">
    <div class="form-grid">
      <label>
        告警编号
        <input v-model="forms.confirm.id" placeholder="例如: AL-1098" />
      </label>
      <label>
        处理意见
        <textarea v-model="forms.confirm.note" rows="2" placeholder="处理说明"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.export" title="导出日志" @close="modals.export = false">
    <p>正在导出近 24 小时日志并生成归档包。</p>
    <div class="progress">
      <span :style="{ width: '58%' }"></span>
    </div>
    <p>已完成 58%，预计 30 秒。</p>
  </BaseModal>

  <BaseModal :show="modals.info" title="提示信息" @close="modals.info = false">
    <p>告警确认后将自动进入闭环流程并同步到运维工单。</p>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modals = reactive({
  threshold: false,
  linkage: false,
  confirm: false,
  export: false,
  info: false
});

const forms = reactive({
  threshold: {
    metric: 'CPU 利用率',
    condition: '> 85%',
    channel: '短信 + 邮件',
    note: ''
  },
  linkage: {
    trigger: '',
    action: '',
    owner: ''
  },
  confirm: {
    id: '',
    note: ''
  }
});

const metrics = [
  { name: 'CPU', value: 78 },
  { name: 'GPU', value: 69 },
  { name: '内存', value: 74 },
  { name: 'IO', value: 57 }
];

const alerts = Array.from({ length: 22 }, (_, index) => {
  const id = index + 1001;
  return {
    id: `AL-${id}`,
    metric: index % 2 === 0 ? 'CPU 利用率' : 'GPU 温度',
    node: `node-${String((index % 12) + 1).padStart(2, '0')}`,
    level: index % 5 === 0 ? '严重' : index % 3 === 0 ? '警告' : '提示',
    time: `09:${String((index * 3) % 60).padStart(2, '0')}`,
    status: index % 4 === 0 ? '处理中' : '待确认'
  };
});
</script>
