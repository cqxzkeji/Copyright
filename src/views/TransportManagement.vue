<template>
  <section>
    <div class="page-header">
      <h2>Transport & Transfer Management</h2>
      <button class="button">Create Manifest</button>
    </div>
    <div class="card-grid">
      <div class="card">
        <h3>Schedule Pickup</h3>
        <form @submit.prevent="schedulePickup">
          <div>
            <label for="carrier">Approved Carrier</label>
            <select id="carrier" v-model="pickup.carrier" required>
              <option disabled value="">Select carrier</option>
              <option>CleanEarth Logistics</option>
              <option>EnviroTrans</option>
              <option>SafeCycle Partners</option>
            </select>
          </div>
          <div>
            <label for="date">Pickup Date</label>
            <input id="date" v-model="pickup.date" type="date" required />
          </div>
          <div>
            <label for="stream">Waste Stream</label>
            <select id="stream" v-model="pickup.stream" required>
              <option disabled value="">Select stream</option>
              <option>F001 - Spent solvent mix</option>
              <option>D002 - Acid solution</option>
              <option>P123 - Lab reagents</option>
            </select>
          </div>
          <button class="button" type="submit">Schedule</button>
        </form>
      </div>
      <div class="card">
        <h3>Active Transfers</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Manifest</th>
              <th>Carrier</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transfer in transfers" :key="transfer.id">
              <td>{{ transfer.id }}</td>
              <td>{{ transfer.carrier }}</td>
              <td><span class="status-chip" :class="transfer.color">{{ transfer.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const transfers = ref([
  { id: '0007123', carrier: 'EnviroTrans', status: 'In Transit', color: 'orange' },
  { id: '0007124', carrier: 'CleanEarth Logistics', status: 'Delivered', color: 'green' }
]);

const pickup = reactive({
  carrier: '',
  date: '',
  stream: ''
});

const schedulePickup = () => {
  transfers.value.push({
    id: (Math.random() * 1_000_000).toFixed(0),
    carrier: pickup.carrier,
    status: 'Scheduled',
    color: 'green'
  });
  Object.assign(pickup, { carrier: '', date: '', stream: '' });
};
</script>
