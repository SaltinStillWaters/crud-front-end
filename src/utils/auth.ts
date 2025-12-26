import { ref } from "vue";
import { api } from "./axios";

export const loading = ref(false)
export const user = ref(null)

export const fetchUser = async () => {
  try {
    if (loading.value) return
    
    loading.value = true

    const res = await api.get('/user', {
      meta: {
        silent: true
      }
    })
    user.value = res.data;
  } catch (err) {
    user.value = null
  } finally {
    loading.value = false
  }
}
