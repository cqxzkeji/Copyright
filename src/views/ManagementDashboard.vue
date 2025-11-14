<template>
  <section class="panel">
    <header>
      <div>
        <h3>展示管理与后台系统</h3>
        <p>配置展项、排期演示、审核内容与系统守护</p>
      </div>
      <button @click="togglePublish">一键发布</button>
    </header>
    <div class="management-grid">
      <article>
        <h4>展项排期</h4>
        <ul>
          <li v-for="item in schedule" :key="item.title">
            {{ item.title }} - {{ item.time }}
            <button class="secondary" @click="reschedule(item)">调整</button>
          </li>
        </ul>
      </article>
      <article>
        <h4>内容审核</h4>
        <ul>
          <li v-for="audit in audits" :key="audit.id">
            {{ audit.title }} - {{ audit.status }}
            <button class="secondary" @click="openAudit(audit)">查看</button>
          </li>
        </ul>
      </article>
      <article>
        <h4>系统守护</h4>
        <p>各节点运行正常，GPU 占用 63%，网络延迟 19ms。</p>
        <button @click="showGuardModal = true">查看详情</button>
      </article>
    </div>
    <ModalDialog v-model="publishModal" title="发布结果">
      <p>{{ publishMessage }}</p>
    </ModalDialog>
    <ModalDialog v-model="auditModal" :title="activeAudit?.title ?? '审核详情'">
      <p>状态：{{ activeAudit?.status }}</p>
      <p>说明：{{ activeAudit?.desc }}</p>
    </ModalDialog>
    <ModalDialog v-model="guardModal" title="系统守护状态">
      <p>核心节点实时监测开启，异常将推送短信与钉钉告警。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const publishModal = ref(false);
const auditModal = ref(false);
const guardModal = ref(false);
const showGuardModal = guardModal;
const publishMessage = ref('');
const activeAudit = ref(null);

const schedule = [
  { title: '古琴雅集导览', time: '09:30' },
  { title: '木版水印体验', time: '11:00' },
  { title: '活字印刷直播', time: '14:00' }
];

const audits = [
  { id: 1, title: '宋代点茶短片', status: '待审核', desc: '需确认版权授权范围。' },
  { id: 2, title: '藏戏面具雕刻', status: '已通过', desc: '专家审核完毕，可发布。' }
];

const togglePublish = () => {
  publishMessage.value = '新展项与排期已同步至云端，已通知各地展厅。';
  publishModal.value = true;
};

const reschedule = (item) => {
  publishMessage.value = `${item.title} 已调整为 ${item.time}，请留意现场播控。`;
  publishModal.value = true;
};

const openAudit = (audit) => {
  activeAudit.value = audit;
  auditModal.value = true;
};
</script>

<style scoped>
.panel {
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.management-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

article {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem;
}

button {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  background: #f97316;
  color: white;
}

button.secondary {
  background: #e2e8f0;
  color: #0f172a;
  margin-left: 0.5rem;
}
</style>
