<template>
  <section>
    <div class="page-header">
      <h2>Welcome Back</h2>
      <p>Sign in to continue monitoring hazardous waste operations.</p>
    </div>
    <div class="card" style="max-width: 480px; margin: 0 auto;">
      <h3>Secure Access Portal</h3>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" required placeholder="compliance@facility.com" />
        </div>
        <div>
          <label for="password">Password</label>
          <input id="password" v-model="form.password" type="password" required placeholder="••••••" />
        </div>
        <div>
          <label>
            <input type="checkbox" v-model="form.mfa" /> Enable multifactor authentication
          </label>
        </div>
        <button class="button" type="submit">Log in</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  email: '',
  password: '',
  mfa: true
});

const handleLogin = () => {
  router.push('/dashboard');
};
</script>
