import { useAuthStore } from '@/modules/stores/auth';

  //////////////////////////////////////////////////////////
export const isAuthenticated = (to, from) => {
  const auth = useAuthStore();

  if (!auth.isLogin) {
    return { name: 'login', query: { next: to.name } };
  }
};
  //////////////////////////////////////////////////////////
