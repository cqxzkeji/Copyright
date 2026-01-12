<template>
  <div>
    <section class="panel">
      <h2>结果展示与决策支持</h2>
      <div class="grid two">
        <div class="card">
          <h3>决策指标</h3>
          <p>修复优先级：高</p>
          <p>建议养护窗口：72 小时</p>
          <p>资源调配完成度：66%</p>
        </div>
        <div class="card">
          <h3>可视化展示</h3>
          <img :src="railImage" alt="结果可视化" style="width: 100%; border-radius: 12px;" />
        </div>
      </div>
    </section>

    <section class="panel">
      <h2>检测结果清单</h2>
      <div class="actions">
        <button class="btn" @click="openModal('visual')">更新可视化面板</button>
        <button class="btn secondary" @click="openModal('report')">生成决策报告</button>
        <button class="btn ghost" @click="openModal('monitor')">系统运行监控</button>
        <button class="btn secondary" @click="openModal('share')">报告共享</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>断口编号</th>
              <th>灰斑等级</th>
              <th>建议措施</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in results" :key="item.id">
              <td>{{ item.index }}</td>
              <td>{{ item.id }}</td>
              <td>{{ item.level }}</td>
              <td>{{ item.action }}</td>
              <td>{{ item.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal" class="modal-mask">
      <div class="modal">
        <h3>{{ modalTitle }}</h3>
        <div v-if="activeModal === 'visual'">
          <form>
            <select>
              <option>多维度图表</option>
              <option>地图分布视图</option>
              <option>灰斑热力图</option>
            </select>
            <input placeholder="刷新频率（分钟）" />
          </form>
          <div class="progress-bar" style="margin-top: 10px;">
            <span :style="{ width: '70%' }"></span>
          </div>
        </div>
        <div v-else-if="activeModal === 'report'">
          <form>
            <input placeholder="报告名称" />
            <select>
              <option>PDF</option>
              <option>Word</option>
              <option>HTML</option>
            </select>
            <textarea rows="3" placeholder="报告摘要"></textarea>
          </form>
        </div>
        <div v-else-if="activeModal === 'monitor'">
          <p>监控服务运行正常，当前负载 46%。</p>
          <div class="progress-bar">
            <span :style="{ width: '46%' }"></span>
          </div>
        </div>
        <div v-else>
          <form>
            <input placeholder="共享对象邮箱" />
            <select>
              <option>只读权限</option>
              <option>可编辑权限</option>
            </select>
            <textarea rows="3" placeholder="共享说明"></textarea>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeModal">关闭</button>
          <button class="btn" @click="closeModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import railImage from "../assets/rail-sample.svg";

const activeModal = ref("");

const results = Array.from({ length: 20 }, (_, index) => ({
  index: index + 1,
  id: `RJ-${7000 + index}`,
  level: index % 3 === 0 ? "严重" : index % 3 === 1 ? "中等" : "轻微",
  action: index % 3 === 0 ? "立即更换" : index % 3 === 1 ? "计划养护" : "持续监控",
  time: `2024-09-${(index % 28) + 1} 0${index % 9}:20`
}));

const modalTitleMap = {
  visual: "更新可视化面板",
  report: "生成决策报告",
  monitor: "系统运行监控",
  share: "报告共享"
};

const modalTitle = computed(() => modalTitleMap[activeModal.value]);

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = "";
};
</script>
