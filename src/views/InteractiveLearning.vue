<template>
  <div class="module learning">
    <div class="intro">
      <h2>交互学习与体验</h2>
      <p>结合非遗技艺教学与冰雪运动训练，提供任务化的互动环节。</p>
      <button class="primary" @click="openModal('已推送互动指令，学员终端收到新任务。')">推送任务</button>
    </div>
    <section class="missions">
      <article v-for="mission in missions" :key="mission.id">
        <header>
          <h3>{{ mission.title }}</h3>
          <span>{{ mission.duration }}</span>
        </header>
        <p>{{ mission.desc }}</p>
        <div class="controls">
          <label>
            难度
            <input type="range" min="1" max="5" v-model.number="mission.level" />
          </label>
          <button @click="openModal(`${mission.title} 难度已设为 ${mission.level} 级。`)">保存设置</button>
        </div>
      </article>
    </section>
    <section class="quiz">
      <h3>即时问答</h3>
      <p>{{ question }}</p>
      <div class="options">
        <button v-for="option in options" :key="option" @click="checkAnswer(option)">
          {{ option }}
        </button>
      </div>
    </section>
    <BaseModal v-model="showModal" title="互动提示">
      <p>{{ modalMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const missions = reactive([
  { id: 1, title: '古琴指法演练', duration: '15 分钟', desc: '指尖动作将同步到虚拟导师，实时纠错。', level: 3 },
  { id: 2, title: '冰壶线路规划', duration: '10 分钟', desc: '拖拽石壶预测轨迹，感受冰面摩擦。', level: 2 },
  { id: 3, title: '苗绣针法练习', duration: '12 分钟', desc: '虚拟面料反馈穿刺深度，辅助初学者。', level: 4 }
]);

const question = ref('“苗绣” 练习中调节针脚密度的滑杆，默认值为多少级？');
const options = ['1 级', '3 级', '5 级'];
const answer = '3 级';
const showModal = ref(false);
const modalMessage = ref('');

const openModal = (msg) => {
  modalMessage.value = msg;
  showModal.value = true;
};

const checkAnswer = (opt) => {
  if (opt === answer) {
    openModal('回答正确，系统将奖励 5 点互动积分。');
  } else {
    openModal('回答错误，可重新选择。');
  }
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.intro {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.missions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

article {
  flex: 1 1 260px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

header {
  display: flex;
  justify-content: space-between;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

input[type='range'] {
  flex: 1;
}

.primary,
button {
  border: none;
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
}

.quiz {
  background: #f1f5f9;
  border-radius: 16px;
  padding: 16px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.options button {
  flex: 1 1 120px;
}
</style>
