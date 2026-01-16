<template>
  <section>
    <div class="section-title">作业调度与队列管理</div>
    <div class="card-grid">
      <div class="card">
        <h3>排队作业</h3>
        <div class="metric">86</div>
        <div class="badge">等待平均 12 分钟</div>
      </div>
      <div class="card">
        <h3>运行作业</h3>
        <div class="metric">214</div>
        <div class="badge">利用率 91%</div>
      </div>
      <div class="card">
        <h3>队列/分区</h3>
        <div class="metric">12</div>
        <div class="badge">Slurm/PBS</div>
      </div>
      <div class="card">
        <h3>可抢占作业</h3>
        <div class="metric">28</div>
        <div class="badge">回填开启</div>
      </div>
    </div>

    <div class="actions">
      <button class="action-button" @click="modals.submit = true">提交作业</button>
      <button class="action-button secondary" @click="modals.queue = true">创建队列</button>
      <button class="action-button secondary" @click="modals.policy = true">调度策略</button>
      <button class="action-button secondary" @click="modals.backfill = true">回填预览</button>
      <button class="action-button secondary" @click="modals.info = true">按钮提示</button>
    </div>

    <div class="chart">
      <div class="section-title">队列负载趋势</div>
      <div v-for="item in queueLoad" :key="item.name" class="bar-row">
        <div class="bar-label">{{ item.name }}</div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: item.load + '%' }"></div>
        </div>
        <div>{{ item.load }}%</div>
      </div>
    </div>

    <div class="table-wrap">
      <div class="section-title">作业列表</div>
      <table>
        <thead>
          <tr>
            <th>作业 ID</th>
            <th>用户</th>
            <th>队列</th>
            <th>优先级</th>
            <th>资源申请</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id">
            <td>{{ job.id }}</td>
            <td>{{ job.user }}</td>
            <td>{{ job.queue }}</td>
            <td>{{ job.priority }}</td>
            <td>{{ job.resources }}</td>
            <td>{{ job.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal :show="modals.submit" title="提交作业" @close="modals.submit = false">
    <div class="form-grid">
      <label>
        作业名称
        <input v-model="forms.submit.name" placeholder="例如: climate-sim" />
      </label>
      <label>
        队列选择
        <select v-model="forms.submit.queue">
          <option>cpu-normal</option>
          <option>gpu-fast</option>
          <option>big-mem</option>
        </select>
      </label>
      <label>
        资源申请
        <input v-model="forms.submit.resources" placeholder="例如: 8 CPU / 1 GPU" />
      </label>
      <label>
        运行脚本
        <textarea v-model="forms.submit.script" rows="2" placeholder="脚本路径或指令"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.queue" title="创建队列" @close="modals.queue = false">
    <div class="form-grid">
      <label>
        队列名称
        <input v-model="forms.queue.name" placeholder="例如: ai-high" />
      </label>
      <label>
        并发上限
        <input v-model="forms.queue.limit" placeholder="例如: 120" />
      </label>
      <label>
        绑定分区
        <select v-model="forms.queue.partition">
          <option>AI 训练池</option>
          <option>核心科研池</option>
          <option>工业仿真池</option>
        </select>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.policy" title="调度策略管理" @close="modals.policy = false">
    <div class="form-grid">
      <label>
        策略模板
        <select v-model="forms.policy.template">
          <option>公平共享</option>
          <option>高优先级抢占</option>
          <option>夜间回填</option>
        </select>
      </label>
      <label>
        配额阈值
        <input v-model="forms.policy.quota" placeholder="例如: 80%" />
      </label>
      <label>
        生效窗口
        <input v-model="forms.policy.window" placeholder="例如: 08:00 - 20:00" />
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.backfill" title="回填评估进度" @close="modals.backfill = false">
    <p>正在计算可抢占窗口与可回填作业。</p>
    <div class="progress">
      <span :style="{ width: '65%' }"></span>
    </div>
    <p>预计 45 秒完成。</p>
  </BaseModal>

  <BaseModal :show="modals.info" title="提示信息" @close="modals.info = false">
    <p>调度策略修改将同步到 Slurm/PBS，并需要 1-2 分钟生效。</p>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modals = reactive({
  submit: false,
  queue: false,
  policy: false,
  backfill: false,
  info: false
});

const forms = reactive({
  submit: {
    name: '',
    queue: 'cpu-normal',
    resources: '',
    script: ''
  },
  queue: {
    name: '',
    limit: '120',
    partition: 'AI 训练池'
  },
  policy: {
    template: '公平共享',
    quota: '80%',
    window: '08:00 - 20:00'
  }
});

const queueLoad = [
  { name: 'cpu-normal', load: 72 },
  { name: 'gpu-fast', load: 88 },
  { name: 'big-mem', load: 55 },
  { name: 'short-test', load: 36 }
];

const jobs = Array.from({ length: 22 }, (_, index) => {
  const id = index + 3001;
  return {
    id: `JOB-${id}`,
    user: index % 3 === 0 ? 'lihua' : index % 3 === 1 ? 'wangqi' : 'chenyu',
    queue: index % 2 === 0 ? 'cpu-normal' : 'gpu-fast',
    priority: index % 5 === 0 ? '紧急' : '标准',
    resources: index % 4 === 0 ? '64 CPU / 2 GPU' : '16 CPU',
    status: index % 6 === 0 ? '排队' : '运行中'
  };
});
</script>
