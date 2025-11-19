<template>
  <div class="module">
    <header>
      <div>
        <h2>维修人员管理</h2>
        <p>合理调配值守班次，确保紧急任务有响应</p>
      </div>
      <button @click="dispatchModal = true">派工</button>
    </header>
    <section class="team">
      <article v-for="person in personnel" :key="person.id" class="person-card">
        <div class="head">
          <h3>{{ person.name }}</h3>
          <span>{{ person.skill }}</span>
        </div>
        <p>本周已完成 {{ person.tasks }} 项任务</p>
        <div class="tags">
          <span v-for="tag in person.tags" :key="tag">{{ tag }}</span>
        </div>
        <button @click="showRoster(person)">查看班次</button>
      </article>
    </section>
  </div>

  <BaseModal
    v-if="rosterPerson"
    :show="!!rosterPerson"
    title="人员排班"
    @close="rosterPerson = null"
  >
    <p>{{ rosterPerson?.name }} 今日班次：{{ rosterPerson?.shift }}，备份：{{ rosterPerson?.backup }}。</p>
  </BaseModal>

  <BaseModal
    v-if="dispatchModal"
    :show="dispatchModal"
    title="派工单"
    @close="dispatchModal = false"
  >
    <form class="dispatch-form" @submit.prevent="dispatch">
      <select v-model="dispatchForm.person" required>
        <option disabled value="">选择人员</option>
        <option v-for="person in personnel" :key="person.id" :value="person.name">{{ person.name }}</option>
      </select>
      <input v-model="dispatchForm.job" placeholder="任务描述" required />
      <button type="submit">生成派工单</button>
    </form>
  </BaseModal>

  <BaseModal
    v-if="dispatchResult"
    :show="!!dispatchResult"
    title="派工完成"
    @close="dispatchResult = null"
  >
    <p>{{ dispatchResult }}</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const personnel = ref([
  { id: 1, name: '王越', skill: '电气检修', tasks: 6, tags: ['PLC', '加硫线'], shift: '白班', backup: '刘超' },
  { id: 2, name: '陈露', skill: '液压维护', tasks: 5, tags: ['炼胶机', '油站'], shift: '夜班', backup: '孙岩' },
  { id: 3, name: '周涵', skill: '机械保全', tasks: 7, tags: ['压延', '换辊'], shift: '白班', backup: '宋琳' }
]);

const rosterPerson = ref(null);
const dispatchModal = ref(false);
const dispatchResult = ref(null);
const dispatchForm = ref({ person: '', job: '' });

const showRoster = (person) => {
  rosterPerson.value = person;
};

const dispatch = () => {
  dispatchResult.value = `${dispatchForm.value.person} 已接收任务：${dispatchForm.value.job}`;
  dispatchForm.value = { person: '', job: '' };
  dispatchModal.value = false;
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

button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background: #9333ea;
  color: #fff;
}

.team {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.person-card {
  flex: 1 1 240px;
  background: #f3e8ff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.head {
  display: flex;
  justify-content: space-between;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tags span {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(147, 51, 234, 0.2);
}

.dispatch-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dispatch-form input,
.dispatch-form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d8b4fe;
}
</style>
