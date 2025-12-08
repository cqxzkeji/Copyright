<template>
  <div class="module">
    <header class="section-title"><span class="icon">🎮</span>互动学习与实训</header>

    <div class="responsive-grid">
      <div class="info-card" v-for="scenario in scenarios" :key="scenario.title">
        <strong>{{ scenario.title }}</strong>
        <p>{{ scenario.desc }}</p>
        <div class="progress-track"><div class="progress-bar" :style="{ width: scenario.completion + '%' }"></div></div>
        <small>完成度 {{ scenario.completion }}%</small>
      </div>
    </div>

    <div class="table-card">
      <header class="table-header">
        <h3>互动任务</h3>
        <div class="actions">
          <button class="primary-button" @click="openModal('simulation')">启动仿真</button>
          <button class="secondary-button" @click="openModal('quiz')">提交测验</button>
          <button class="secondary-button" @click="openModal('hint')">获取提示</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>任务</th>
            <th>目标</th>
            <th>时长</th>
            <th>难度</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.name">
            <td>{{ task.name }}</td>
            <td>{{ task.goal }}</td>
            <td>{{ task.duration }}</td>
            <td>{{ task.difficulty }}</td>
            <td><span class="chip">{{ task.state }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'simulation'" title="仿真启动" @close="closeModal" :showFooter="false">
      <p>正在加载交互场景：风化石修补、导水槽调整、绿植点缀。</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: simulationProgress + '%' }"></div></div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'quiz'" title="测验提交" @close="closeModal" @confirm="submitQuiz">
      <div class="form-grid">
        <label>题目 1：稳固角度<input v-model="quiz.answers[0]" placeholder="写下角度" /></label>
        <label>题目 2：排水坡度<input v-model="quiz.answers[1]" placeholder="写下坡度" /></label>
        <label>题目 3：安全措施<textarea v-model="quiz.answers[2]" rows="2"></textarea></label>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'hint'" title="操作提示" @close="closeModal" :showFooter="false">
      <ul>
        <li>优先搭建主峰并保持辅峰与主峰比例 1:0.7。</li>
        <li>导水槽坡度维持 2% 保证水流稳定。</li>
        <li>打磨缝隙时避免一次性切削过深，留出余量再修整。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const scenarios = [
  { title: '水线调试', desc: '调整导水槽坡度并校验水流速度。', completion: 65 },
  { title: '石材落差修补', desc: '处理风化面，保持自然纹理。', completion: 82 },
  { title: '绿植点缀', desc: '选择适合阴湿环境的蕨类植物。', completion: 50 },
  { title: '夜景灯光', desc: '布设隐藏灯带并校验眩光。', completion: 40 }
];

const tasks = [
  { name: '吊装安全检查', goal: '确认吊带与吊环完好', duration: '10min', difficulty: '中', state: '未开始' },
  { name: '坡度测量', goal: '导水槽坡度 2%', duration: '8min', difficulty: '易', state: '进行中' },
  { name: '缝隙填砂', goal: '缝宽 8mm 均匀填充', duration: '12min', difficulty: '中', state: '进行中' },
  { name: '落石修补', goal: '破损处找平打磨', duration: '15min', difficulty: '难', state: '未开始' },
  { name: '喷泉调试', goal: '水柱高度均匀', duration: '10min', difficulty: '易', state: '未开始' },
  { name: '植被分层', goal: '阴阳面植被搭配', duration: '9min', difficulty: '中', state: '进行中' },
  { name: '排水暗沟', goal: '检查暗沟畅通', duration: '7min', difficulty: '易', state: '完成' },
  { name: '灯光校准', goal: '避免眩光直射', duration: '11min', difficulty: '中', state: '未开始' },
  { name: '踏步稳固', goal: '踏步摩擦系数达标', duration: '6min', difficulty: '易', state: '完成' },
  { name: '监测验收', goal: '提交全景报告', duration: '13min', difficulty: '难', state: '未开始' }
];

const activeModal = ref('');
const simulationProgress = ref(0);
const quiz = ref({ answers: ['', '', ''] });

const openModal = (type) => {
  activeModal.value = type;
  if (type === 'simulation') {
    simulationProgress.value = 0;
    const timer = setInterval(() => {
      simulationProgress.value = Math.min(simulationProgress.value + 25, 100);
      if (simulationProgress.value === 100) {
        clearInterval(timer);
      }
    }, 400);
  }
};

const closeModal = () => {
  activeModal.value = '';
};

const submitQuiz = () => {
  alert('测验答案已提交，系统将自动评分');
  closeModal();
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.form-grid input,
.form-grid textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
</style>
