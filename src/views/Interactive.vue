<template>
  <div>
    <div class="section-header">
      <div>
        <p class="eyebrow">功能三 · 交互体验与学习</p>
        <h2>支持漫游、点击讲解、流程演示等多样互动方式，提升学习效果。</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="openProgress('自由漫游', 45)">启动漫游</button>
        <button class="accent" @click="openForm('交互脚本编排')">编排交互</button>
        <button class="ghost" @click="openInfo('教学提示', '已加载讲解词与方言字幕，语速 0.8x。')">教学提示</button>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="flow in flows" :key="flow.id" class="card">
        <h3>{{ flow.title }}</h3>
        <p class="meta">{{ flow.detail }}</p>
        <div class="tags">
          <span class="badge">{{ flow.mode }}</span>
          <span class="badge">{{ flow.device }}</span>
        </div>
        <div class="card-actions">
          <button class="ghost" @click="openInfo('流程说明', flow.guide)">流程演示</button>
          <button class="accent" @click="openProgress('下载离线资源', flow.progress)">离线包</button>
          <button class="primary" @click="openForm('采集反馈', flow.title)">采集反馈</button>
        </div>
      </div>
    </div>

    <BaseModal :show="modal.type === 'form'" :title="modal.title" width="520px" @close="closeModal">
      <div class="input-group">
        <input v-model="form.topic" placeholder="反馈/脚本主题" />
        <textarea v-model="form.body" rows="4" placeholder="描述体验过程中的优化建议"></textarea>
        <label class="checkbox">
          <input v-model="form.enableReminder" type="checkbox" /> 启用操作节点语音提醒
        </label>
      </div>
      <template #footer>
        <button class="ghost" @click="closeModal">取消</button>
        <button class="primary" @click="submitForm">提交</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'progress'" :title="modal.title" width="460px" @close="closeModal">
      <p>正在同步交互资源与动作捕捉数据…</p>
      <progress :value="modal.progress" max="100"></progress>
      <p class="progress-text">{{ modal.progress }}% 完成</p>
      <template #footer>
        <button class="primary" @click="closeModal">完成</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'info'" :title="modal.title" width="460px" @close="closeModal">
      <p>{{ modal.message }}</p>
      <template #footer>
        <button class="primary" @click="closeModal">确定</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const flows = reactive([
  {
    id: 1,
    title: '茶道礼仪分步演示',
    detail: '按动作点暂停讲解，并突出手势关键区域。',
    mode: '流程演示',
    device: 'PC/一体机',
    progress: 68,
    guide: '双击茶杯可查看水温与茶叶产地，右键呼出温馨提示。'
  },
  {
    id: 2,
    title: '鼓楼漫游学习',
    detail: '多语种字幕切换，支持语音提问与结构模型查看。',
    mode: '漫游讲解',
    device: 'VR 头显',
    progress: 52,
    guide: '凝视鼓楼顶部 2 秒自动弹出建筑节点介绍，按扳机键收起。'
  },
  {
    id: 3,
    title: '木雕刀法练习',
    detail: '根据力反馈调整刀锋角度，完成虚拟雕刻练习。',
    mode: '动作练习',
    device: 'VR 头显/手柄',
    progress: 61,
    guide: '按下抓握键即可锁定木坯，提示线条颜色代表力度等级。'
  },
  {
    id: 4,
    title: '龙舟鼓点协同',
    detail: '通过节奏指示条与震动反馈训练同步划桨。',
    mode: '多人协作',
    device: '移动端/PC',
    progress: 74,
    guide: '点击节奏条可预听下一段鼓点，进度条同步队伍平均节拍。'
  }
]);

const modal = reactive({ type: '', title: '', message: '', progress: 0 });
const form = reactive({ topic: '', body: '', enableReminder: true });

const openForm = (title, topic = '') => {
  modal.type = 'form';
  modal.title = title;
  form.topic = topic;
};

const openProgress = (title, start) => {
  modal.type = 'progress';
  modal.title = title;
  modal.progress = start;
  const timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 14);
    if (modal.progress >= 100) clearInterval(timer);
  }, 360);
};

const openInfo = (title, message) => {
  modal.type = 'info';
  modal.title = title;
  modal.message = message;
};

const submitForm = () => {
  closeModal();
  openInfo('提交成功', '已记录本次体验反馈，将同步给教研与开发团队。');
};

const closeModal = () => {
  modal.type = '';
  modal.title = '';
  modal.message = '';
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tags {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta {
  color: #4b5671;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.ghost {
  background: #f1f5ff;
  color: #1f2a44;
  border: 1px solid var(--border);
}

.accent {
  background: linear-gradient(120deg, #ffb347, #ffd966);
  color: #5c3100;
}
</style>
