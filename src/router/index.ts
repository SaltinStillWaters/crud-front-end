/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { fetchUser, loading, user } from '@/utils/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.getRoutes().forEach(route => {
  const path = route.path

  if (path.startsWith('/products')) {
    route.meta.requiresAuth = true
  } else if (path.startsWith('/auth')) {
    route.meta.guestOnly = true
  }
})

router.beforeEach(async (to) => {
  console.log({to, user, loading})

  if (!loading.value) {
    await fetchUser()
  }

  if (to.meta.requiresAuth && !user.value) {
    return '/auth/login'
  }

  if (to.meta.guestOnly && user.value) {
    return '/products/showall'
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
