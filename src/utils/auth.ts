import { ref } from "vue";
import { api } from "./axios";
import { type RouteLocationNormalized } from "vue-router";

export const fetched = ref(false)
export const fetching = ref(false)
export const user = ref(null)

export const fetchUser = async () => {
  try {
    if (fetching.value) return

    fetching.value = true

    const res = await api.get('/user', {
      meta: {
        silent: true
      }
    })
    user.value = res.data;
  } catch (err) {
    user.value = null
  } finally {
    fetched.value = true
    fetching.value = false
  }
}

export const authGuard = (to: RouteLocationNormalized, router: any) => {
  if (to.meta.requiresAuth && !user.value) {
    router.push('/auth/Login')
  } else if (to.meta.guestOnly && user.value) {
    router.push('/products/ShowAll')
  }

  fetched.value = false
}
