<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-card class="pa-4" max-width="500" width="100%">
      <template v-if="init">
        <v-skeleton-loader type="card" class="mb-4" width="100%" />
        <v-skeleton-loader type="text, text, button, button" class="mb-6" width="100%" style="min-height: 48px; border-radius: 8px" />
      </template>
      <template v-else>
        <v-card-title>Create Product</v-card-title>
        <v-card-text>
          <ProductForm @submit-form="createProduct" @onCancel="cancel" :loading="loading" />
        </v-card-text>
      </template>
    </v-card>
  </v-container>
</template>

<script>
import ProductForm from '@/components/ProductForm.vue';
import { authGuard, fetchUser } from '@/utils/auth';
import { api } from '@/utils/axios';
import { useSnackbarStore } from '@/utils/snackbar';

export default {
  async created() {
    await fetchUser()
    authGuard(this.$route, this.$router)
    this.init = false
  },
  data: () => ({
    init: true,
    loading: false,
    queue: [],
  }),
  components: {
    ProductForm,
  },
  methods: {
    async createProduct(data) {
      this.loading = true
      try {
        const snackbar = useSnackbarStore()
        await api.post('/products', data);

        snackbar.success('Product Added!')
        this.$router.push(`/products/showall`)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },

    async cancel() {
      this.loading = true
      await this.$router.push('/products/ShowAll')
    }
  }
}
</script>
