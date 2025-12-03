<template>
  <section>
    <div class="section-header">
      <div>
        <div class="section-title">报告生成</div>
        <div style="color: #6b7a99;">生成生产日报、客户版质量报告与能耗报表</div>
      </div>
      <div class="section-actions">
        <button class="primary-btn" @click="openProgress('正在生成班次报告...')">生成班次报告</button>
        <button class="secondary-btn" @click="openEmail">邮件发送</button>
        <button class="secondary-btn" @click="openProgress('整理历史数据包...')">导出数据</button>
      </div>
    </div>

    <div class="card-grid" style="margin: 16px 0;">
      <div class="card">
        <h3>产量与良率</h3>
        <div class="inline-chart">
          <div v-for="entry in yieldChart" :key="entry.label" class="chart-bar" :style="{ '--bar-height': entry.height + 'px' }" :title="entry.label + ' 良率 ' + entry.yield">
          </div>
        </div>
      </div>
      <div class="card">
        <h3>报告模板</h3>
        <ul style="padding-left: 18px; color: #3a4b6a; line-height: 1.6;">
          <li>生产日报：设备、质量、节拍一体化</li>
          <li>客户报告：包含缺陷图片与整改措施</li>
          <li>能耗报表：机台能耗、单件能耗对比</li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <div class="section-title" style="font-size: 18px;">报告记录</div>
        <div class="section-actions">
          <button class="secondary-btn" @click="openProgress('正在刷新报告列表...')">刷新</button>
          <button class="secondary-btn" @click="openProgress('归档至文件服务器...')">归档</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>日期</th>
            <th>班次</th>
            <th>类型</th>
            <th>负责人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reports" :key="item.date + item.shift + item.type">
            <td>{{ item.date }}</td>
            <td>{{ item.shift }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.owner }}</td>
            <td><span class="chip" :class="item.status === '完成' ? 'success' : 'warning'">{{ item.status }}</span></td>
            <td>
              <button class="text-btn" @click="openPreview(item)">预览</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 邮件 -->
    <div v-if="showEmail" class="modal-overlay" @click.self="showEmail = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">发送报告</div>
          <button class="text-btn" @click="showEmail = false">关闭</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="label">收件人</label>
              <input v-model="email.to" placeholder="qa@company.com" />
            </div>
            <div>
              <label class="label">报告类型</label>
              <select v-model="email.type">
                <option value="生产日报">生产日报</option>
                <option value="客户质量报告">客户质量报告</option>
                <option value="能耗报表">能耗报表</option>
              </select>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <label class="label">附言</label>
            <textarea v-model="email.note" rows="2" placeholder="请查阅今日班次报告..." />
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showEmail = false">取消</button>
          <button class="primary-btn" @click="sendEmail">发送</button>
        </div>
      </div>
    </div>

    <!-- 预览 -->
    <div v-if="preview" class="modal-overlay" @click.self="preview = null">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">报告预览 - {{ preview.type }}</div>
          <button class="text-btn" @click="preview = null">关闭</button>
        </div>
        <div class="modal-body">
          <p style="color: #3a4b6a;">班次：{{ preview.shift }} | 日期：{{ preview.date }} | 负责人：{{ preview.owner }}</p>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: preview.percent + '%' }"></div>
          </div>
          <p style="color: #3a4b6a; margin-top: 10px;">包含 10+ 张质检图片、机台稼动曲线以及产出统计。</p>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="preview = null">关闭</button>
          <button class="primary-btn" @click="openProgress('正在导出 PDF...')">导出 PDF</button>
        </div>
      </div>
    </div>

    <!-- 进度 -->
    <div v-if="progressMessage" class="modal-overlay" @click.self="progressMessage = ''">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">处理中</div>
          <button class="text-btn" @click="progressMessage = ''">关闭</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 10px;">{{ progressMessage }}</div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const reports = reactive([
  { date: '2024-05-01', shift: '早班', type: '生产日报', owner: '林工', status: '完成', percent: 100 },
  { date: '2024-05-01', shift: '中班', type: '质量报告', owner: '陈工', status: '生成中', percent: 60 },
  { date: '2024-05-01', shift: '晚班', type: '生产日报', owner: '赵工', status: '生成中', percent: 40 },
  { date: '2024-04-30', shift: '早班', type: '质量报告', owner: '林工', status: '完成', percent: 100 },
  { date: '2024-04-30', shift: '中班', type: '能耗报表', owner: '陈工', status: '完成', percent: 100 },
  { date: '2024-04-30', shift: '晚班', type: '客户报告', owner: '赵工', status: '完成', percent: 100 },
  { date: '2024-04-29', shift: '早班', type: '生产日报', owner: '林工', status: '完成', percent: 100 },
  { date: '2024-04-29', shift: '中班', type: '质量报告', owner: '陈工', status: '完成', percent: 100 },
  { date: '2024-04-29', shift: '晚班', type: '能耗报表', owner: '赵工', status: '完成', percent: 100 },
  { date: '2024-04-28', shift: '早班', type: '客户报告', owner: '林工', status: '完成', percent: 100 }
]);

const yieldChart = [
  { label: '早班', yield: '98.6%', height: 120 },
  { label: '中班', yield: '97.8%', height: 112 },
  { label: '晚班', yield: '97.2%', height: 108 }
];

const showEmail = ref(false);
const email = reactive({ to: 'qa@company.com', type: '生产日报', note: '' });
const preview = ref(null);
const progressMessage = ref('');
const progress = ref(12);

const openProgress = (msg) => {
  progressMessage.value = msg;
  progress.value = 12;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 22);
    if (progress.value >= 100) clearInterval(timer);
  }, 420);
};

const openEmail = () => {
  showEmail.value = true;
};

const sendEmail = () => {
  showEmail.value = false;
  openProgress('邮件发送中...');
};

const openPreview = (item) => {
  preview.value = { ...item };
};
</script>
