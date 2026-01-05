<template>
  <div>
    <div class="section-header">
      <div>
        <p class="eyebrow">功能二 · VR 场景再现展示</p>
        <h2>基于资源库快速生成传统技艺、民俗活动与历史环境的沉浸式场景。</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="openProgress('场景渲染', 55)">重建场景</button>
        <button class="accent" @click="openForm('新建 VR 场景')">新建场景</button>
        <button class="ghost" @click="openInfo('设备校验', '头显、手柄与全景相机连接正常。')">设备检查</button>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="scene in scenes" :key="scene.id" class="card">
        <div class="scene-cover" :style="{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35)), url(${scene.cover})` }"></div>
        <h3>{{ scene.title }}</h3>
        <p class="meta">时长 {{ scene.duration }} · 传承人 {{ scene.mentor }}</p>
        <div class="tags">
          <span class="badge">{{ scene.type }}</span>
          <span class="badge">{{ scene.region }}</span>
        </div>
        <div class="card-actions">
          <button class="ghost" @click="openInfo('场景说明', scene.description)">讲解</button>
          <button class="primary" @click="openProgress('发布进度', scene.progress)">发布</button>
          <button class="accent" @click="openInfo('预览地址', previewText(scene))">预览</button>
        </div>
      </div>
    </div>

    <BaseModal :show="modal.type === 'form'" :title="modal.title" width="520px" @close="closeModal">
      <div class="input-group">
        <input v-model="form.title" placeholder="场景名称：如古城夜游 VR" />
        <input v-model="form.region" placeholder="所属地区：如云南大理" />
        <select v-model="form.type">
          <option value="技艺演示">技艺演示</option>
          <option value="节庆巡游">节庆巡游</option>
          <option value="历史重现">历史重现</option>
        </select>
        <textarea v-model="form.description" rows="3" placeholder="场景亮点与互动方式"></textarea>
      </div>
      <template #footer>
        <button class="ghost" @click="closeModal">取消</button>
        <button class="primary" @click="submitForm">保存配置</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'progress'" :title="modal.title" width="480px" @close="closeModal">
      <p>正在处理光照、声场与导航网格…</p>
      <progress :value="modal.progress" max="100"></progress>
      <p class="progress-text">{{ modal.progress }}% 完成</p>
      <template #footer>
        <button class="primary" @click="closeModal">完成</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'info'" :title="modal.title" width="480px" @close="closeModal">
      <p>{{ modal.message }}</p>
      <template #footer>
        <button class="primary" @click="closeModal">我已记录</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const scenes = reactive([
  {
    id: 1,
    title: '苗绣针法传习工坊',
    region: '贵州凯里',
    type: '技艺演示',
    mentor: '潘秀英',
    duration: '12 分钟',
    progress: 76,
    description: '穿针引线、挑花收尾全流程展示，支持放大针脚与步骤讲解。',
    cover:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    title: '侗寨鼓楼夜话',
    region: '贵州黎平',
    type: '历史重现',
    mentor: '吴传河',
    duration: '9 分钟',
    progress: 52,
    description: '鼓楼建造技艺结合夜话场景再现，支持多人协同观看。',
    cover:
      'https://images.unsplash.com/photo-1521292270410-a8c2e04a0db2?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    title: '藏戏面具工坊',
    region: '西藏日喀则',
    type: '技艺演示',
    mentor: '丹增',
    duration: '7 分钟',
    progress: 64,
    description: '手工雕塑、敷彩、晾晒三维重建，支持 AR 合成分享。',
    cover:
      'https://images.unsplash.com/photo-1582719478145-bb44a0b96c74?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    title: '木版年画上色体验',
    region: '天津杨柳青',
    type: '技艺演示',
    mentor: '张师傅',
    duration: '10 分钟',
    progress: 48,
    description: '用户可自定义配色，观看油墨渗透与压印的细节动画。',
    cover:
      'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    title: '龙舟竞渡沉浸式演练',
    region: '湖南汨罗',
    type: '节庆巡游',
    mentor: '周师傅',
    duration: '15 分钟',
    progress: 82,
    description: '加入动态水波和鼓点同步震动，模拟真实竞渡节奏。',
    cover:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    title: '古城夜游历史漫步',
    region: '云南丽江',
    type: '历史重现',
    mentor: '李导览',
    duration: '11 分钟',
    progress: 71,
    description: '多分支路线选择，加入 NPC 讲解与方言字幕。',
    cover:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80'
  }
]);

const modal = reactive({ type: '', title: '', message: '', progress: 0 });
const form = reactive({ title: '', region: '', type: '技艺演示', description: '' });

const openForm = (title) => {
  modal.type = 'form';
  modal.title = title;
};

const openProgress = (title, start) => {
  modal.type = 'progress';
  modal.title = title;
  modal.progress = start;
  const timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 12);
    if (modal.progress >= 100) clearInterval(timer);
  }, 420);
};

const openInfo = (title, message) => {
  modal.type = 'info';
  modal.title = title;
  modal.message = message;
};

const submitForm = () => {
  scenes.unshift({
    id: scenes.length + 1,
    title: form.title || '未命名场景',
    region: form.region || '待定',
    type: form.type,
    mentor: '待确认',
    duration: '8 分钟',
    progress: 20,
    description: form.description || '等待补充亮点描述',
    cover:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80'
  });
  closeModal();
  openProgress('自动渲染新场景', 25);
};

const previewText = (scene) => `${scene.title} 预览地址：vr://scene/${scene.id}`;

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

.scene-cover {
  height: 160px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  margin-bottom: 12px;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta {
  color: #4b5671;
}

.tags {
  display: flex;
  gap: 8px;
  margin: 8px 0;
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
