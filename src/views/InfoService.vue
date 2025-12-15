<template>
  <div class="container">
    <div class="flex">
      <div class="card" style="flex: 1 1 320px;">
        <h3>服务快速操作</h3>
        <div class="actions">
          <button @click="showPublish = true">推送资讯</button>
          <button class="ghost" @click="startBulletin">发布公告</button>
          <button @click="showPreview = true">预览客户端</button>
        </div>
        <p class="muted">所有按钮均以弹窗反馈，便于确认操作</p>
      </div>
      <div class="card" style="flex: 2 1 420px;">
        <h3>订阅分布</h3>
        <div class="bars">
          <div v-for="(item, idx) in audience" :key="idx" class="bar">
            <div class="bar-fill" :style="{ height: item.percent + '%' }"></div>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3>信息服务记录</h3>
          <p class="muted">至少 10 条记录，展示推送效果</p>
        </div>
        <button class="ghost" @click="showPreview = true">快速预览</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>标题</th>
            <th>频道</th>
            <th>覆盖量</th>
            <th>点击率</th>
            <th>状态</th>
            <th>发布时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in feeds" :key="item.title">
            <td>{{ item.title }}</td>
            <td>{{ item.channel }}</td>
            <td>{{ item.coverage }}</td>
            <td>{{ item.ctr }}</td>
            <td><span class="badge" :style="{ background: item.color }">{{ item.status }}</span></td>
            <td>{{ item.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <modal-dialog v-model="showPublish" title="推送资讯" width="520px">
      <div class="form-grid">
        <label>资讯标题<input placeholder="输入资讯标题" /></label>
        <label>目标频道<select><option>应用内</option><option>短信</option><option>邮件</option></select></label>
        <label>推送时间<input type="datetime-local" /></label>
      </div>
      <template #footer>
        <button class="ghost" @click="showPublish = false">取消</button>
        <button @click="showPublish = false; showPreview = true;">确认推送</button>
      </template>
    </modal-dialog>

    <modal-dialog v-model="showBulletin" title="公告发布中" width="480px">
      <p>正在向所有订阅端推送公告...</p>
      <div class="progress"><div class="progress-bar" :style="{ width: bulletinProgress + '%' }"></div></div>
    </modal-dialog>

    <modal-dialog v-model="showPreview" title="客户端预览">
      <div class="preview">
        <h4>示例推送</h4>
        <p>【热点】AI 数据治理趋势解读，点击查看详情。</p>
        <p>【公告】凌晨 1:30 进行数据仓库维护。</p>
      </div>
    </modal-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showPublish = ref(false);
const showBulletin = ref(false);
const showPreview = ref(false);
const bulletinProgress = ref(15);

const feeds = [
  { title: '金融风控周报', channel: '应用内', coverage: '18,200', ctr: '21%', status: '已发布', color: '#43a047', time: '10:05' },
  { title: '物流延误提醒', channel: '短信', coverage: '8,500', ctr: '18%', status: '已发布', color: '#43a047', time: '10:02' },
  { title: '节假日运营指引', channel: '邮件', coverage: '6,100', ctr: '15%', status: '审核中', color: '#fb8c00', time: '09:58' },
  { title: '数据安全通知', channel: '应用内', coverage: '22,400', ctr: '26%', status: '已发布', color: '#43a047', time: '09:55' },
  { title: 'AI 解读特刊', channel: '邮件', coverage: '5,800', ctr: '32%', status: '草稿', color: '#1e88e5', time: '09:50' },
  { title: '维护窗口提醒', channel: '短信', coverage: '9,240', ctr: '19%', status: '已发布', color: '#43a047', time: '09:48' },
  { title: '客户活动邀请', channel: '应用内', coverage: '11,300', ctr: '24%', status: '已发布', color: '#43a047', time: '09:45' },
  { title: '监控告警推送', channel: '短信', coverage: '7,400', ctr: '23%', status: '已发布', color: '#43a047', time: '09:40' },
  { title: '运营策略更新', channel: '邮件', coverage: '6,950', ctr: '17%', status: '审核中', color: '#fb8c00', time: '09:35' },
  { title: '月度报告', channel: '应用内', coverage: '14,600', ctr: '20%', status: '已发布', color: '#43a047', time: '09:30' },
  { title: '合规须知', channel: '邮件', coverage: '5,400', ctr: '14%', status: '草稿', color: '#1e88e5', time: '09:25' }
];

const audience = [
  { label: '移动端', percent: 72 },
  { label: '桌面端', percent: 56 },
  { label: '短信', percent: 38 },
  { label: '邮件', percent: 44 }
];

const startBulletin = () => {
  showBulletin.value = true;
  bulletinProgress.value = 15;
  const timer = setInterval(() => {
    bulletinProgress.value += 20;
    if (bulletinProgress.value >= 100) {
      clearInterval(timer);
      showBulletin.value = false;
      showPreview.value = true;
    }
  }, 320);
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

button.ghost {
  background: #eef2f7;
  color: #1f2933;
}

.bars {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  height: 180px;
}

.bar {
  flex: 1;
  background: #eef3fb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 6px;
  gap: 6px;
}

.bar-fill {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(180deg, #4fc3f7, #1e88e5);
  transition: height 0.3s ease;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.muted {
  margin: 0;
  color: #94a3b8;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input,
.form-grid select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d7deea;
}

.preview {
  background: #f7fbff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px #e5edff;
}
</style>
