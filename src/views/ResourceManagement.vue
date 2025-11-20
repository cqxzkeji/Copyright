<template>
  <div class="module">
    <header>
      <div>
        <h2>文化资源管理</h2>
        <p>集中维护场地、演职人员及合作方资源。</p>
      </div>
      <div class="header-actions">
        <button @click="syncResources">同步资源库</button>
        <button class="ghost" @click="openModal('共享提示', '资源链接已生成，可在项目管理中一键调取。')">生成共享链接</button>
      </div>
    </header>

    <section class="filters">
      <label v-for="option in categories" :key="option">
        <input type="radio" name="category" :value="option" v-model="activeCategory" />
        {{ option }}
      </label>
      <button class="secondary" @click="activeCategory = '全部'">重置筛选</button>
    </section>

    <section class="resource-grid">
      <article v-for="item in filteredResources" :key="item.id" class="card">
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <div class="meta">
          <span class="tag">{{ item.type }}</span>
          <button @click="markUsed(item)">{{ item.used ? '取消调用' : '立即调用' }}</button>
        </div>
      </article>
    </section>

    <div v-if="modal.visible" class="modal-mask">
      <div class="modal-box">
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <button @click="modal.visible = false">好的</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const categories = ['全部', '场地', '演职人员', '合作方'];
const activeCategory = ref('全部');
const resources = ref([
  { id: 1, name: '非遗体验馆', desc: '可容纳300人，具备沉浸式投影。', type: '场地', used: false },
  { id: 2, name: '国风舞团', desc: '擅长民族舞演绎与多媒体互动。', type: '演职人员', used: false },
  { id: 3, name: '文创市集品牌联盟', desc: '40家原创品牌组成的联展资源。', type: '合作方', used: true },
  { id: 4, name: '城市书房', desc: '小型新书发布与沙龙场地，配套直播设备。', type: '场地', used: false }
]);

const modal = reactive({ visible: false, title: '', message: '' });

const filteredResources = computed(() =>
  activeCategory.value === '全部'
    ? resources.value
    : resources.value.filter((item) => item.type === activeCategory.value)
);

const markUsed = (item) => {
  item.used = !item.used;
  openModal('操作成功', `${item.name}${item.used ? '已加入调用清单' : '已移出调用清单'}。`);
};

const syncResources = () => {
  const time = new Date().toLocaleString();
  openModal('同步完成', `资源库已与云端对齐，时间：${time}`);
};

const openModal = (title, message) => {
  modal.title = title;
  modal.message = message;
  modal.visible = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

button {
  border: none;
  border-radius: 0.8rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  background: #4f7bff;
  color: #fff;
}

button.ghost {
  background: transparent;
  border: 1px solid #aeb7d9;
  color: #4f7bff;
}

button.secondary {
  background: #fff;
  color: #4f7bff;
  border: 1px solid #4f7bff;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}

.filters label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: #f2f4ff;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}

.resource-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 260px;
  border: 1px solid #e2e7fb;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag {
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: #eef1ff;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(19, 24, 46, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  width: min(360px, 90%);
  background: #fff;
  padding: 1.2rem;
  border-radius: 1rem;
  text-align: center;
}
</style>
