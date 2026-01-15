<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h3>广告生产与内容制作</h3>
        <p>任务派发、素材加工、视频剪辑与合规校验。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('dispatch')">派发设计任务</button>
        <button class="outline" @click="openModal('adapt')">规格适配</button>
        <button class="outline" @click="openModal('video')">视频剪辑管理</button>
        <button class="ghost" @click="openModal('audit')">内容合规校验</button>
        <button class="ghost" @click="openModal('quality')">质量检查确认</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h4>生产进度看板</h4>
        <div class="progress-list">
          <div v-for="item in progress" :key="item.name">
            <div class="progress-title">
              <span>{{ item.name }}</span>
              <span>{{ item.value }}%</span>
            </div>
            <div class="progress">
              <div class="progress-bar" :style="{ width: item.value + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h4>制作任务清单</h4>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>任务名称</th>
              <th>规格</th>
              <th>状态</th>
              <th>负责人</th>
              <th>截止日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.title }}</td>
              <td>{{ task.size }}</td>
              <td>{{ task.status }}</td>
              <td>{{ task.owner }}</td>
              <td>{{ task.deadline }}</td>
              <td>
                <button class="link" @click="openModal('detail', task)">详情</button>
                <button class="link" @click="openModal('deliver', task)">交付</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'dispatch'">
        <label>
          任务名称
          <input v-model="form.title" placeholder="例如：618素材制作" />
        </label>
        <label>
          指派对象
          <select v-model="form.owner">
            <option>周成</option>
            <option>林晓</option>
            <option>韩雪</option>
            <option>王悦</option>
          </select>
        </label>
        <label>
          计划完成时间
          <input v-model="form.deadline" type="date" />
        </label>
      </template>

      <template v-else-if="activeModal === 'adapt'">
        <p>选择素材并设置多平台输出规格。</p>
        <label>
          素材批次
          <select v-model="form.batch">
            <option>抖音竖版</option>
            <option>朋友圈横版</option>
            <option>电梯屏竖版</option>
          </select>
        </label>
        <label>
          目标尺寸
          <input v-model="form.size" placeholder="如：1080x1920" />
        </label>
      </template>

      <template v-else-if="activeModal === 'video'">
        <p>视频剪辑与字幕同步</p>
        <label>
          视频片段
          <input v-model="form.clip" placeholder="如：品牌主片" />
        </label>
        <label>
          字幕模板
          <select v-model="form.subtitle">
            <option>简洁白底</option>
            <option>品牌蓝</option>
            <option>节奏加粗</option>
          </select>
        </label>
      </template>

      <template v-else-if="activeModal === 'audit'">
        <p>合规校验进度</p>
        <div class="progress">
          <div class="progress-bar" style="width: 78%"></div>
        </div>
        <p>敏感词扫描 100% · 法规校验 78%</p>
      </template>

      <template v-else-if="activeModal === 'quality'">
        <p>确认以下检查项后完成交付：</p>
        <ul>
          <li>画面清晰度与色彩</li>
          <li>平台尺寸与规范</li>
          <li>文件命名与版本一致</li>
        </ul>
      </template>

      <template v-else-if="activeModal === 'detail'">
        <p><strong>{{ selectedTask.title }}</strong></p>
        <p>规格：{{ selectedTask.size }} · 状态：{{ selectedTask.status }}</p>
        <p>负责人：{{ selectedTask.owner }} · 截止：{{ selectedTask.deadline }}</p>
      </template>

      <template v-else-if="activeModal === 'deliver'">
        <p>确认向渠道交付素材：{{ selectedTask.title }}</p>
        <label>
          交付备注
          <textarea v-model="form.note" rows="3" placeholder="填写交付说明"></textarea>
        </label>
      </template>

      <template #footer>
        <button class="ghost" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');
const selectedTask = ref({});
const form = ref({
  title: '',
  owner: '周成',
  deadline: '',
  batch: '抖音竖版',
  size: '',
  clip: '',
  subtitle: '简洁白底',
  note: ''
});

const progress = [
  { name: '任务派发', value: 92 },
  { name: '素材加工', value: 68 },
  { name: '视频剪辑', value: 54 },
  { name: '合规校验', value: 78 }
];

const tasks = Array.from({ length: 20 }, (_, index) => ({
  id: `PM-${String(index + 1).padStart(3, '0')}`,
  title: `平台素材制作 ${index + 1}`,
  size: ['1080x1920', '1200x628', '750x1334', '1920x1080'][index % 4],
  status: ['制作中', '校验中', '待交付', '已完成'][index % 4],
  owner: ['周成', '林晓', '韩雪', '王悦'][index % 4],
  deadline: `2024-06-${String((index % 28) + 1).padStart(2, '0')}`
}));

const openModal = (type, task) => {
  activeModal.value = type;
  selectedTask.value = task || {};
};

const closeModal = () => {
  activeModal.value = '';
};

const modalTitle = computed(() => {
  const titles = {
    dispatch: '设计任务派发',
    adapt: '素材规格适配',
    video: '视频剪辑与字幕管理',
    audit: '内容合规校验',
    quality: '生产质量检查',
    detail: '任务详情',
    deliver: '交付确认'
  };
  return titles[activeModal.value] || '操作';
});
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.page-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.outline {
  background: #fff;
  border: 1px solid #cbd5f5;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: #f8fafc;
  border: 1px dashed #cbd5f5;
  color: #475569;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.grid {
  display: grid;
  gap: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.progress-list {
  display: grid;
  gap: 12px;
}

.progress-title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #475569;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.link {
  background: transparent;
  border: none;
  color: #2563eb;
  cursor: pointer;
  margin-right: 8px;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}
</style>
