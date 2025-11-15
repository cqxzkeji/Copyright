<template>
  <section>
    <div class="page-header">
      <h2>Waste Registration & Classification</h2>
      <button class="button">Sync with EPA ID</button>
    </div>
    <div class="card">
      <h3>Register New Waste Stream</h3>
      <form @submit.prevent="registerWaste">
        <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
          <div>
            <label for="name">Stream Name</label>
            <input id="name" v-model="form.name" required placeholder="Spent solvent mix" />
          </div>
          <div>
            <label for="code">EPA Waste Code</label>
            <input id="code" v-model="form.code" required placeholder="F001" />
          </div>
          <div>
            <label for="category">Category</label>
            <select id="category" v-model="form.category" required>
              <option disabled value="">Select category</option>
              <option>Ignitable</option>
              <option>Corrosive</option>
              <option>Reactive</option>
              <option>Toxic</option>
            </select>
          </div>
          <div>
            <label for="quantity">Monthly Quantity (kg)</label>
            <input id="quantity" v-model.number="form.quantity" type="number" min="0" />
          </div>
        </div>
        <div>
          <label for="notes">Handling Notes</label>
          <textarea id="notes" rows="3" v-model="form.notes" placeholder="Storage temperature, compatibility restrictions, PPE requirements..." />
        </div>
        <button class="button" type="submit">Add Waste Stream</button>
      </form>
    </div>
    <div class="card" style="margin-top: 1.5rem;">
      <h3>Registered Streams</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Category</th>
            <th>Monthly Qty</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stream in streams" :key="stream.code">
            <td>{{ stream.name }}</td>
            <td>{{ stream.code }}</td>
            <td>{{ stream.category }}</td>
            <td>{{ stream.quantity }} kg</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const streams = ref([
  { name: 'Spent solvent mix', code: 'F001', category: 'Ignitable', quantity: 420 },
  { name: 'Electroplating sludge', code: 'F006', category: 'Toxic', quantity: 180 }
]);

const form = reactive({
  name: '',
  code: '',
  category: '',
  quantity: 0,
  notes: ''
});

const registerWaste = () => {
  streams.value.push({
    name: form.name,
    code: form.code,
    category: form.category,
    quantity: form.quantity
  });
  Object.assign(form, { name: '', code: '', category: '', quantity: 0, notes: '' });
};
</script>
