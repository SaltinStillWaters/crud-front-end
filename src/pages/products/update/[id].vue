<template>
  <v-container>
    <v-snackbar-queue v-model="queue"></v-snackbar-queue>
    <v-card class="pa-4" outlined>
      <v-card-title>Update Product</v-card-title>
      <v-card-text>
        <ProductForm :showDelete="true" @submit-form="updateProduct" @onDelete="deleteProduct" :data="form" :loading="loading" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ProductForm from "@/components/ProductForm.vue";
import api from "@/utils/axios";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  data: () => ({
    form: {
      name: '',
      quantity: null,
      price: null,
    },
    loading: false,
    queue: [],
    productId: null,
  }),
  components: {
    ProductForm,
  },
  mounted() {
  const route = useRoute()
    this.productId = route.params.id
    this.fetchProduct()
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
        this.fetchProduct()

        this.queue = []
        this.queue.push({
          text: 'Updated Successfully!',
          color: 'success'
        })
        this.$router.push(`/products/showall`)
      } catch (err) {
        const errors = err?.response?.data?.errors

        if (errors) {
          this.queue = []
          Object.values(errors).forEach(error => {
            error.forEach(err => {
              this.queue.push({
                text: err,
                color: 'error'
              })
            })
          })
        } else {
          this.queue.push({
            text: 'Something went wrong',
            color: 'error'
          })
        }
      } finally {
        this.loading = false
      }
    }
  },
  name: 'UpdateProduct',
})


</script>
