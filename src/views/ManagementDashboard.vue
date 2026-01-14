<template>
  <section class="management">
    <div class="card header">
      <div>
        <div class="badge">展示管理与后台系统</div>
        <h2>统一内容发布与系统维护</h2>
        <p>提供资源维护、用户管理与系统配置功能，支持持续更新。</p>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openModal('publish')">发布新内容</button>
        <button class="ghost-btn" @click="openModal('resource')">资源维护</button>
        <button class="ghost-btn" @click="openModal('user')">用户管理</button>
        <button class="ghost-btn" @click="openModal('settings')">系统配置</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="section-title">内容发布队列</div>
        <div class="list">
          <div v-for="item in publishQueue" :key="item.title" class="list-item">
            <div>
              <div class="list-title">{{ item.title }}</div>
              <p>{{ item.desc }}</p>
            </div>
            <button class="ghost-btn" @click="openQueue(item)">审核发布</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="section-title">系统状态</div>
        <div class="status-grid">
          <div class="status-item">
            <span>在线用户</span>
            <strong>128</strong>
          </div>
          <div class="status-item">
            <span>内容版本</span>
            <strong>v3.2.1</strong>
          </div>
          <div class="status-item">
            <span>资源占用</span>
            <strong>64%</strong>
          </div>
        </div>
        <button class="primary-btn" @click="openModal('progress')">维护进度</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">用户权限清单</div>
      <table class="table">
        <thead>
          <tr>
            <th>用户</th>
            <th>角色</th>
            <th>最后登录</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.name">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.lastLogin }}</td>
            <td>{{ user.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal
      v-if="activeModal"
      :title="activeModalTitle"
      @close="closeModal"
      @confirm="closeModal"
    >
      <template v-if="activeModal === 'publish'">
        <label>
          内容标题
          <input class="input" placeholder="请输入发布标题" />
        </label>
        <label>
          发布栏目
          <select class="input">
            <option>场景展示</option>
            <option>互动教学</option>
            <option>专题活动</option>
          </select>
        </label>
        <p>内容提交后将进入审核队列。</p>
      </template>
      <template v-else-if="activeModal === 'resource'">
        <label>
          资源类型
          <select class="input">
            <option>模型</option>
            <option>图像</option>
            <option>音频</option>
          </select>
        </label>
        <label>
          处理方式
          <input class="input" placeholder="如：更新纹理、替换文件" />
        </label>
        <p>系统将生成资源维护工单。</p>
      </template>
      <template v-else-if="activeModal === 'user'">
        <label>
          用户名
          <input class="input" placeholder="请输入用户名" />
        </label>
        <label>
          角色权限
          <select class="input">
            <option>管理员</option>
            <option>内容编辑</option>
            <option>数据分析师</option>
          </select>
        </label>
        <p>用户变更后将在下次登录生效。</p>
      </template>
      <template v-else-if="activeModal === 'settings'">
        <label>
          系统主题
          <select class="input">
            <option>亮色主题</option>
            <option>中性主题</option>
          </select>
        </label>
        <label>
          备份频率
          <input class="input" placeholder="如：每日 02:00" />
        </label>
        <p>配置将同步到服务器并立即生效。</p>
      </template>
      <template v-else-if="activeModal === 'queue'">
        <p>审核内容：{{ selectedQueue?.title }}</p>
        <label>
          审核意见
          <input class="input" placeholder="填写审核意见" />
        </label>
        <label>
          发布渠道
          <select class="input">
            <option>主站首页</option>
            <option>活动专区</option>
            <option>学术资源库</option>
          </select>
        </label>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>系统维护与数据备份正在执行。</p>
        <div class="progress-track">
          <div class="progress-value" :style="{ width: `${progress}%` }"></div>
        </div>
        <p>完成度：{{ progress }}%</p>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const publishQueue = [
  { title: "侗族鼓楼沉浸展", desc: "新增 3D 场景与互动讲解内容。" },
  { title: "苏州评弹互动课程", desc: "新增音乐素材与教学流程。" },
  { title: "非遗研学路线", desc: "整合线上研学任务与路线推荐。" }
];

const users = [
  { name: "李文博", role: "管理员", lastLogin: "2024-09-18 09:12", status: "在线" },
  { name: "周艺涵", role: "内容编辑", lastLogin: "2024-09-17 16:40", status: "离线" },
  { name: "张逸", role: "数据分析师", lastLogin: "2024-09-18 08:05", status: "在线" },
  { name: "陈静", role: "审核员", lastLogin: "2024-09-16 14:18", status: "离线" }
];

const activeModal = ref("");
const progress = ref(45);
const selectedQueue = ref(null);
let timer;

const openModal = (type) => {
  activeModal.value = type;
  if (type === "progress") {
    progress.value = 45;
    timer = window.setInterval(() => {
      progress.value = Math.min(progress.value + 11, 100);
    }, 450);
  }
};

const openQueue = (item) => {
  selectedQueue.value = item;
  activeModal.value = "queue";
};

const closeModal = () => {
  activeModal.value = "";
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
};

const activeModalTitle = computed(() => {
  const map = {
    publish: "内容发布",
    resource: "资源维护",
    user: "用户管理",
    settings: "系统配置",
    queue: "发布审核",
    progress: "维护进度"
  };
  return map[activeModal.value] || "后台管理";
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.management {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: grid;
  gap: 16px;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.list {
  display: grid;
  gap: 14px;
}

.list-item {
  background: #f8fafc;
  padding: 14px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.list-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.list-item p {
  color: #64748b;
  font-size: 13px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.status-item {
  background: #f1f5f9;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
</style>
