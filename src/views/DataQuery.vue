<template>
  <div class="module">
    <header>
      <div>
        <h2>数据查询与检索</h2>
        <p>支持空间范围、标签与更新时间的组合检索。</p>
      </div>
      <button class="ghost" @click="showHistory = !showHistory">历史检索</button>
    </header>

    <section class="query-form">
      <label>
        关键字
        <input v-model="filters.keyword" placeholder="土地利用" />
      </label>
      <label>
        数据标签
        <select multiple v-model="filters.tags">
          <option>土地</option>
          <option>水系</option>
          <option>交通</option>
          <option>人口</option>
        </select>
      </label>
      <label>
        更新时间
        <input type="date" v-model="filters.date" />
      </label>
      <label>
        覆盖城市
        <input v-model="filters.city" placeholder="成都" />
      </label>
      <button @click="runQuery">执行查询</button>
    </section>

    <section class="results">
      <h3>匹配结果（{{ results.length }} 条）</h3>
      <div class="result" v-for="item in results" :key="item.id">
        <div>
          <strong>{{ item.name }}</strong>
          <p>{{ item.desc }}</p>
        </div>
        <button @click="openDetail(item)">详情</button>
      </div>
    </section>

    <ModalDialog v-if="detail" :title="detail.name" @close="detail = null">
      <p>{{ detail.desc }}</p>
      <p>最近更新：{{ detail.date }}</p>
      <p>覆盖城市：{{ detail.city }}</p>
    </ModalDialog>

    <ModalDialog v-if="showHistory" title="历史检索" @close="showHistory = false">
      <ul>
        <li v-for="item in history" :key="item">{{ item }}</li>
      </ul>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const allData = [
  { id: 1, name: '成都土地利用 2024Q1', desc: '土地利用精细分类图斑，分辨率 2m。', tags: ['土地'], city: '成都', date: '2024-03-05' },
  { id: 2, name: '珠三角水系普查', desc: '流域水系矢量数据，附带流量监测。', tags: ['水系'], city: '广州', date: '2024-02-18' },
  { id: 3, name: '京津冀交通态势', desc: '实时交通状态与道路等级整合。', tags: ['交通'], city: '天津', date: '2024-04-02' }
];

const filters = reactive({ keyword: '', tags: [], date: '', city: '' });
const results = ref(allData);
const detail = ref(null);
const showHistory = ref(false);
const history = ref([]);

const runQuery = () => {
  history.value.unshift(`${filters.keyword || '全部'} - ${new Date().toLocaleString('zh-CN')}`);
  history.value = history.value.slice(0, 6);
  results.value = allData.filter((item) => {
    const matchKeyword = filters.keyword ? item.name.includes(filters.keyword) : true;
    const matchTags = filters.tags.length ? filters.tags.some((tag) => item.tags.includes(tag)) : true;
    const matchCity = filters.city ? item.city.includes(filters.city) : true;
    const matchDate = filters.date ? item.date >= filters.date : true;
    return matchKeyword && matchTags && matchCity && matchDate;
  });
};

const openDetail = (item) => {
  detail.value = item;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.query-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.query-form label {
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
input,
select {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}
select[multiple] {
  min-height: 120px;
}
.results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
}
button {
  padding: 10px 18px;
  border-radius: 12px;
  background: linear-gradient(120deg, #ff8a5c, #f6d365);
  color: #111;
  font-weight: 600;
}
.ghost {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
