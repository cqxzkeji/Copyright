<template>
  <div class="grid" style="grid-template-columns: 1fr;">
    <section class="card">
      <div class="header">
        <div>
          <h2>精选短视频</h2>
          <p class="muted">浏览频道流视频，支持批量调度与预览</p>
        </div>
        <div class="actions">
          <button class="btn" @click="showUpload = true">上传视频</button>
          <button class="btn" @click="showBatch = true">批量发布</button>
          <button class="btn secondary" @click="showNotice = true">提醒</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
        <div v-for="video in videos" :key="video.id" class="video-card">
          <div class="thumb" :style="{ backgroundImage: `url(${video.cover})` }"></div>
          <div class="meta">
            <div class="title">{{ video.title }}</div>
            <div class="row">
              <span class="badge">{{ video.tag }}</span>
              <span>{{ video.views }} 次播放</span>
            </div>
            <div class="row small">
              <span>{{ video.duration }}</span>
              <span>曝光 {{ video.exposure }}%</span>
            </div>
            <div class="row">
              <button class="btn secondary" @click="openSchedule(video)">加入排期</button>
              <button class="btn" @click="openPreview(video)">预览</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="header">
        <h3>内容分发表</h3>
        <span class="chip">共 {{ schedule.length }} 条</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>标题</th>
            <th>渠道</th>
            <th>发布时间</th>
            <th>预算</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in schedule" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.channel }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.budget }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
            <td>
              <button class="btn secondary" @click="openEdit(item)">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <Modal v-if="showUpload" title="上传视频" @close="showUpload = false">
      <form class="form-grid" @submit.prevent="submitUpload">
        <div>
          <label>视频标题</label>
          <input v-model="form.title" required />
        </div>
        <div>
          <label>所属频道</label>
          <select v-model="form.channel">
            <option>热点</option>
            <option>城市</option>
            <option>搞笑</option>
          </select>
        </div>
        <div>
          <label>封面链接</label>
          <input v-model="form.cover" required />
        </div>
        <button class="btn" type="submit">确认上传</button>
      </form>
    </Modal>

    <Modal v-if="showBatch" title="批量发布进度" @close="showBatch = false">
      <p>正在分发 12 条视频至全渠道...</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: batchProgress + '%' }"></div>
      </div>
      <p class="muted">预计完成时间：3 分钟</p>
    </Modal>

    <Modal v-if="showNotice" title="提示" @close="showNotice = false">
      <p>推荐在高峰时段发布：12:00、18:00，预计曝光提升 23%。</p>
      <button class="btn" @click="showNotice = false">知道了</button>
    </Modal>

    <Modal v-if="activePreview" :title="activePreview.title" @close="activePreview = null">
      <p>预览封面</p>
      <div class="thumb preview" :style="{ backgroundImage: `url(${activePreview.cover})` }"></div>
      <button class="btn" @click="activePreview = null">关闭</button>
    </Modal>

    <Modal v-if="activeSchedule" title="加入排期" @close="activeSchedule = null">
      <form class="form-grid" @submit.prevent="activeSchedule = null">
        <div>
          <label>渠道</label>
          <select>
            <option>快搜</option>
            <option>视频号</option>
            <option>首页推荐</option>
          </select>
        </div>
        <div>
          <label>发布时间</label>
          <input type="datetime-local" />
        </div>
        <button class="btn" type="submit">保存排期</button>
      </form>
    </Modal>

    <Modal v-if="activeEdit" title="编辑发布" @close="activeEdit = null">
      <form class="form-grid" @submit.prevent="activeEdit = null">
        <label>预算 (元)</label>
        <input type="number" min="0" step="100" />
        <label>备注</label>
        <textarea rows="3"></textarea>
        <button class="btn" type="submit">保存修改</button>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';

const showUpload = ref(false);
const showBatch = ref(false);
const showNotice = ref(false);
const batchProgress = ref(36);
const activePreview = ref(null);
const activeSchedule = ref(null);
const activeEdit = ref(null);
const form = reactive({ title: '', channel: '热点', cover: '' });

const videos = reactive([
  {
    id: 1,
    title: '夜市烟火气记录',
    tag: '城市',
    views: '23.4k',
    duration: '00:43',
    exposure: 74,
    cover: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: '滑板少年的一天',
    tag: '运动',
    views: '18.1k',
    duration: '00:38',
    exposure: 62,
    cover: 'https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: '咖啡拉花大师',
    tag: '生活',
    views: '31.2k',
    duration: '00:28',
    exposure: 80,
    cover: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: '森林露营 24 小时',
    tag: '旅行',
    views: '14.2k',
    duration: '00:51',
    exposure: 55,
    cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: '科技新品 30s 速览',
    tag: '数码',
    views: '27.7k',
    duration: '00:30',
    exposure: 73,
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    title: '街头音乐合集',
    tag: '音乐',
    views: '21.9k',
    duration: '00:36',
    exposure: 69,
    cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 7,
    title: '30 秒职场表达技巧',
    tag: '干货',
    views: '17.3k',
    duration: '00:30',
    exposure: 60,
    cover: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 8,
    title: '萌宠日常混剪',
    tag: '宠物',
    views: '45.1k',
    duration: '00:29',
    exposure: 91,
    cover: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 9,
    title: '手绘插画过程',
    tag: '艺术',
    views: '12.6k',
    duration: '00:33',
    exposure: 47,
    cover: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 10,
    title: '健身 3 招燃脂',
    tag: '健康',
    views: '29.8k',
    duration: '00:26',
    exposure: 77,
    cover: 'https://images.unsplash.com/photo-1506220926022-cc5c12acdb35?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 11,
    title: '夜景延时摄影',
    tag: '摄影',
    views: '20.0k',
    duration: '00:40',
    exposure: 64,
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 12,
    title: '高铁疾驰窗景',
    tag: '旅拍',
    views: '15.4k',
    duration: '00:31',
    exposure: 58,
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
  }
]);

const schedule = reactive([
  { id: 1, title: '夜市烟火气记录', channel: '首页推荐', time: '18:00', budget: '¥5000', status: '审核中' },
  { id: 2, title: '滑板少年的一天', channel: '同城', time: '19:00', budget: '¥4200', status: '排期' },
  { id: 3, title: '咖啡拉花大师', channel: '兴趣流', time: '20:00', budget: '¥6200', status: '投放中' },
  { id: 4, title: '森林露营 24 小时', channel: '户外', time: '10:30', budget: '¥3200', status: '排期' },
  { id: 5, title: '科技新品 30s 速览', channel: '数码', time: '12:00', budget: '¥7200', status: '审核中' },
  { id: 6, title: '街头音乐合集', channel: '音乐', time: '14:00', budget: '¥2800', status: '投放中' },
  { id: 7, title: '30 秒职场表达技巧', channel: '职场', time: '09:00', budget: '¥2400', status: '排期' },
  { id: 8, title: '萌宠日常混剪', channel: '萌宠', time: '17:00', budget: '¥8100', status: '投放中' },
  { id: 9, title: '手绘插画过程', channel: '艺术', time: '21:00', budget: '¥2600', status: '审核中' },
  { id: 10, title: '健身 3 招燃脂', channel: '健康', time: '07:30', budget: '¥5300', status: '排期' },
  { id: 11, title: '夜景延时摄影', channel: '摄影', time: '23:00', budget: '¥3000', status: '备份' },
  { id: 12, title: '高铁疾驰窗景', channel: '旅拍', time: '16:00', budget: '¥3500', status: '投放中' }
]);

const submitUpload = () => {
  videos.unshift({ ...form, id: Date.now(), views: '0', duration: '待定', exposure: 0 });
  showUpload.value = false;
};

const openPreview = (video) => {
  activePreview.value = video;
};

const openSchedule = (video) => {
  activeSchedule.value = video;
};

const openEdit = (item) => {
  activeEdit.value = item;
};

onMounted(() => {
  const timer = setInterval(() => {
    batchProgress.value = Math.min(100, batchProgress.value + 8);
    if (batchProgress.value >= 100) {
      batchProgress.value = 16;
    }
  }, 800);
  onUnmounted(() => clearInterval(timer));
});
</script>

<script>
const Modal = {
  name: 'Modal',
  props: ['title'],
  emits: ['close'],
  template: `
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <h3 style="margin:0;">{{ title }}</h3>
          <button class="btn secondary" @click="$emit('close')">关闭</button>
        </div>
        <slot />
      </div>
    </div>
  `
};

export default {
  components: { Modal }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.video-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.thumb {
  height: 150px;
  background-size: cover;
  background-position: center;
}

.thumb.preview {
  height: 240px;
  border-radius: 12px;
}

.meta {
  padding: 12px;
  display: grid;
  gap: 8px;
}

.title {
  font-weight: 700;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.row.small {
  color: #6b7280;
  font-size: 13px;
}
</style>
