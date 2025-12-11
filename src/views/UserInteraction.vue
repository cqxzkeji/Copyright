<template>
  <div class="grid" style="grid-template-columns: 1.4fr 1fr; gap: 16px;">
    <section class="card">
      <div class="header">
        <h2>互动流</h2>
        <div class="actions">
          <button class="btn" @click="showReply = true">批量回复</button>
          <button class="btn secondary" @click="showMute = true">关键词屏蔽</button>
          <button class="btn" @click="showTips = true">提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>用户</th>
            <th>评论</th>
            <th>视频</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in interactions" :key="item.id">
            <td>{{ item.user }}</td>
            <td>{{ item.content }}</td>
            <td>{{ item.video }}</td>
            <td>
              <button class="btn secondary" @click="openFollow(item)">关注</button>
              <button class="btn" @click="openSend(item)">私信</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <div class="header">
        <h3>互动概览</h3>
        <button class="btn secondary" @click="showExport = true">导出</button>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
        <div v-for="stat in stats" :key="stat.label" class="stat">
          <div class="value">{{ stat.value }}</div>
          <div class="label">{{ stat.label }}</div>
        </div>
      </div>
      <div class="chart">
        <div v-for="item in trend" :key="item.day" class="point">
          <div class="dot" :style="{ height: item.value + 'px' }"></div>
          <span>{{ item.day }}</span>
        </div>
      </div>
    </section>
  </div>

  <Modal v-if="showReply" title="批量回复" @close="showReply = false">
    <form class="form-grid" @submit.prevent="showReply = false">
      <label>选择模板</label>
      <select>
        <option>感谢关注</option>
        <option>活动提醒</option>
        <option>客服转接</option>
      </select>
      <label>附带优惠券</label>
      <input placeholder="可选填写" />
      <button class="btn" type="submit">发送</button>
    </form>
  </Modal>

  <Modal v-if="showMute" title="关键词屏蔽" @close="showMute = false">
    <form class="form-grid" @submit.prevent="showMute = false">
      <label>新增关键词</label>
      <input placeholder="输入屏蔽词" />
      <label>生效范围</label>
      <select>
        <option>所有视频</option>
        <option>指定频道</option>
      </select>
      <button class="btn" type="submit">保存规则</button>
    </form>
  </Modal>

  <Modal v-if="showTips" title="互动提示" @close="showTips = false">
    <p>热门评论回复时间建议控制在 2 分钟内，优先评论完播率高的作品。</p>
    <button class="btn" @click="showTips = false">明白</button>
  </Modal>

  <Modal v-if="activeFollow" :title="`关注 ${activeFollow.user}`" @close="activeFollow = null">
    <p>关注后将优先推送该用户评论动态。</p>
    <button class="btn" @click="activeFollow = null">确认</button>
  </Modal>

  <Modal v-if="activeSend" :title="`私信 ${activeSend.user}`" @close="activeSend = null">
    <form class="form-grid" @submit.prevent="activeSend = null">
      <label>消息内容</label>
      <textarea rows="3" placeholder="输入关怀或客服信息"></textarea>
      <button class="btn" type="submit">发送消息</button>
    </form>
  </Modal>

  <Modal v-if="showExport" title="导出互动记录" @close="showExport = false">
    <p>正在整理最近 7 天互动数据...</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: exportProgress + '%' }"></div>
    </div>
  </Modal>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';

const showReply = ref(false);
const showMute = ref(false);
const showTips = ref(false);
const showExport = ref(false);
const exportProgress = ref(12);
const activeFollow = ref(null);
const activeSend = ref(null);

const interactions = reactive([
  { id: 1, user: '青柠汽水', content: '这音乐太好听了！', video: '街头音乐合集' },
  { id: 2, user: '北城', content: '求同款滤镜', video: '夜景延时摄影' },
  { id: 3, user: '花枝丸', content: '想看完整版', video: '森林露营 24 小时' },
  { id: 4, user: '南风知意', content: '下次试试近景', video: '咖啡拉花大师' },
  { id: 5, user: '小鲸鱼', content: '求开源脚本', video: '科技新品 30s 速览' },
  { id: 6, user: '夏日序曲', content: '这拍摄角度绝了', video: '滑板少年的一天' },
  { id: 7, user: '云上', content: '点赞了！', video: '萌宠日常混剪' },
  { id: 8, user: '灿烂', content: '转发到朋友圈了', video: '夜市烟火气记录' },
  { id: 9, user: '拾光', content: 'bgm 是啥？', video: '高铁疾驰窗景' },
  { id: 10, user: '枝桠', content: '求同款背包链接', video: '森林露营 24 小时' },
  { id: 11, user: '白鹭', content: '配色很高级', video: '手绘插画过程' },
  { id: 12, user: '三木', content: '太治愈了', video: '萌宠日常混剪' }
]);

const stats = reactive([
  { label: '昨日评论', value: '1,242' },
  { label: '新增粉丝', value: '328' },
  { label: '私信回复', value: '612' },
  { label: '置顶评论', value: '24' }
]);

const trend = reactive(
  ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, index) => ({
    day,
    value: 40 + index * 10
  }))
);

let timer;

onMounted(() => {
  timer = setInterval(() => {
    exportProgress.value = Math.min(100, exportProgress.value + 15);
    if (exportProgress.value >= 100) exportProgress.value = 12;
  }, 1000);
});

onUnmounted(() => clearInterval(timer));

const openFollow = (item) => {
  activeFollow.value = item;
};

const openSend = (item) => {
  activeSend.value = item;
};
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
.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  align-items: end;
  gap: 8px;
  margin-top: 16px;
}

.point {
  display: grid;
  justify-items: center;
  gap: 6px;
}

.dot {
  width: 36px;
  background: linear-gradient(135deg, #4ade80 0%, #bbf7d0 100%);
  border-radius: 10px;
}

.stat {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #f8fafc;
}

.value {
  font-size: 20px;
  font-weight: 800;
}

.label {
  color: #6b7280;
}
</style>
