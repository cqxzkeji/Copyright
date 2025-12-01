import { reactive } from 'vue';

const state = reactive({
  loggedIn: false,
  user: ''
});

export function useAuthStore() {
  const login = (name) => {
    state.loggedIn = true;
    state.user = name || '值班员';
  };

  const logout = () => {
    state.loggedIn = false;
    state.user = '';
  };

  return {
    state,
    login,
    logout
  };
}
