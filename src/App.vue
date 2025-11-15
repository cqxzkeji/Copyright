<template>
  <div class="app-shell">
    <aside class="sidebar">
      <h1>Hazardous Waste</h1>
      <nav class="nav-links">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ active: $route.path === link.to }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </aside>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
const links = [
  { label: 'Login', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Waste Registration', to: '/waste-registration' },
  { label: 'Transport Management', to: '/transport-management' },
  { label: 'Storage Management', to: '/storage-management' },
  { label: 'Compliance Report', to: '/compliance' },
  { label: 'Analytics', to: '/analytics' }
];
</script>
