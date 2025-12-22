<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-card class="pa-4" max-width="500" width="100%">
      <v-card-title>Update Product</v-card-title>
      <v-card-text>
        <ProductForm :showDelete="true" @submit-form="updateProduct" @onDelete="deleteProduct" :data="form"
          :loading="loading" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ProductForm from "@/components/ProductForm.vue";
import api from "@/utils/axios";
import { useSnackbarStore } from "@/utils/snackbar";
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({
    form: {
      name: '',
      quantity: null,
      price: null,
    },
    loading: false,
    productId: null,
  }),
  components: {
    ProductForm,
  },
  mounted() {
    this.productId = this.$route.params.id
    this.fetchProduct()
  },
  computed: {
    snackbar() {
      return useSnackbarStore()
    }
  },
  methods: {
    async fetchProduct() {
      try {
        this.loading = true
        const res = await api.get(`/products/${this.productId}`)
        console.log(res)
        this.form = res.data
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async deleteProduct() {
      console.log('deleting')
      if (!confirm('Delete Product?')) return

      try {
        this.loading = true
        const res = await api.delete(`/products/${this.productId}`)
        console.log(res)
        this.snackbar.success('Product deleted!')
        this.$router.push(`/products/showall`)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async updateProduct(data) {
      try {
        this.loading = true
        const res = await api.patch(`/products/${this.productId}`, data)
        this.snackbar.success('Product updated!')
        this.$router.push(`/products/showall`)
      } catch (err) {
        console.error({err})
      } finally {
        this.loading = false
      }
    }
  },
  name: 'UpdateProduct',
})


</script>
