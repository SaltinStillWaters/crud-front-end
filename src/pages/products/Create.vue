<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-card class="pa-4" max-width="500" width="100%">
      <v-card-title>Create Product</v-card-title>
      <v-card-text>
        <ProductForm @submit-form="createProduct" :loading="loading" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ProductForm from '@/components/ProductForm.vue';
import { api } from '@/utils/axios';
import { useSnackbarStore } from '@/utils/snackbar';

export default {
  data: () => ({
    loading: false,
    queue: [],
  }),
  components: {
    ProductForm,
  },
  computed: {
    snackbar() {
      return useSnackbarStore();
    }
  },
  methods: {
    async createProduct(data) {
      try {
        this.loading = true
        await api.post('/products', data);

        this.snackbar.success('Product Added!')
        this.$router.push(`/products/showall`)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
