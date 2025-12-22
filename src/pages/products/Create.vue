<template>
    <v-container>
        <v-snackbar-queue v-model="queue"></v-snackbar-queue>
        <v-card class="pa-4" outlined>
            <v-card-title>Create Product</v-card-title>
            <v-card-text>
                <ProductForm @submit-form="createProduct" :loading="loading" />
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import ProductForm from '@/components/ProductForm.vue';
import api from '@/utils/axios';

export default {
    data: () => ({
        loading: false,
        queue: [],
    }),
    components: {
        ProductForm,
    },

    methods: {
        async createProduct(data) {
            try {
                this.loading = true
                const res = await api.post('/products', data);

                this.queue = []
                this.queue.push({
                    text: 'Product added!',
                    color: 'success'
                })
                this.$router.push(`/products/showall`)
            } catch (err) {
              console.error(err)
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
    }
}
</script>
