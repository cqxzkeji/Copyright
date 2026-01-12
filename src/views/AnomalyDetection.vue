<template>
  <div>
    <section class="panel">
      <h2>异常检测与预警</h2>
      <div class="grid two">
        <div class="card">
          <h3>检测状态</h3>
          <p>在线阈值：0.72</p>
          <p>实时告警：2 条</p>
          <p>异常缓存：18 条</p>
        </div>
        <div class="card">
          <h3>告警分布</h3>
          <img :src="railImage" alt="异常检测图" style="width: 100%; border-radius: 12px;" />
        </div>
      </div>
    </section>

    <section class="panel">
      <h2>异常记录</h2>
      <div class="actions">
        <button class="btn" @click="openModal('detect')">执行灰斑异常检测</button>
        <button class="btn secondary" @click="openModal('alert')">预警规则设置</button>
        <button class="btn ghost" @click="openModal('report')">异常报告生成</button>
        <button class="btn secondary" @click="openModal('archive')">异常数据归档</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>记录编号</th>
              <th>位置坐标</th>
              <th>异常等级</th>
              <th>触发时间</th>
              <th>处理状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in anomalies" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.location }}</td>
              <td>{{ item.level }}</td>
              <td>{{ item.time }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal" class="modal-mask">
      <div class="modal">
        <h3>{{ modalTitle }}</h3>
        <div v-if="activeModal === 'detect'">
          <p>选择检测批次并启动实时分析。</p>
          <form>
            <input placeholder="检测批次编号" />
            <select>
              <option>全线路扫描</option>
              <option>重点区段扫描</option>
              <option>近期报警复核</option>
            </select>
          </form>
          <div class="progress-bar" style="margin-top: 10px;">
            <span :style="{ width: '58%' }"></span>
          </div>
          <p style="margin-top: 6px; color: #4b5a78;">分析中 58%</p>
        </div>
        <div v-else-if="activeModal === 'alert'">
          <form>
            <input placeholder="异常阈值 0.72" />
            <select>
              <option>短信通知</option>
              <option>系统弹窗</option>
              <option>邮件推送</option>
            </select>
            <textarea rows="3" placeholder="报警说明"></textarea>
          </form>
        </div>
        <div v-else-if="activeModal === 'report'">
          <p>异常报告已汇总，可生成 PDF 与图表。</p>
          <div class="progress-bar">
            <span :style="{ width: '84%' }"></span>
          </div>
        </div>
        <div v-else>
          <form>
            <input placeholder="归档编号" />
            <select>
              <option>归档至本地</option>
              <option>归档至云端</option>
            </select>
            <textarea rows="3" placeholder="备注信息"></textarea>
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

const anomalies = Array.from({ length: 20 }, (_, index) => ({
  id: `AL-${500 + index}`,
  location: `K${12 + index}.${index * 4} + ${20 + index * 2}m`,
  level: index % 4 === 0 ? "红色" : index % 4 === 1 ? "橙色" : "黄色",
  time: `2024-09-${(index % 28) + 1} 1${index % 9}:40`,
  status: index % 3 === 0 ? "已通知" : "处理中"
}));

const modalTitleMap = {
  detect: "执行灰斑异常检测",
  alert: "预警规则设置",
  report: "异常报告生成",
  archive: "异常数据归档"
};

const modalTitle = computed(() => modalTitleMap[activeModal.value]);

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = "";
};
</script>
