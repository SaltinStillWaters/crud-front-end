<template>
  <v-data-table :columns="columns" :items="products" :custom-filter="filterName" :search="search" :loading="loading">
    <template #top>
      <v-text-field v-model="search" label="Search" variant="outlined" hide-details single-line
        prepend-inner-icon="mdi-magnify"></v-text-field>
    </template>
    <template #item.actions="{ item }">
      <v-btn icon size="small" color="white" variant="tonal" @click.stop="editItem(item)">
        <v-icon icon="mdi-pencil" />
      </v-btn>

      <v-divider vertical class="mx-1" />

      <v-btn icon size="small" color="red" variant="tonal" @click.stop="deleteItem(item)">
        <v-icon icon="mdi-trash-can" />
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { api } from "@/utils/axios";
import { useSnackbarStore } from "@/utils/snackbar";
import { VDataTable } from "vuetify/components";

export default {
  components: {
    VDataTable,
  },
  data() {
    return {
      columns: [
        { title: 'Id', key: 'id' },
        { title: 'Name', key: 'name' },
        { title: 'Quantity', key: 'quantity' },
        { title: 'Price', key: 'price' },
        { title: 'Actions', key: 'actions', sortable: false},
      ],
      products: [],
      search: '',
      loading: false,
    };
  },
  mounted() {
    this.fetchItems();
  },
  computed: {
    snackbar() {
      return useSnackbarStore()
    }
  },
  methods: {
    editItem(item) {
      console.log({ ...item })
      this.loading = true
      this.$router.push(`/products/update/${item.id}`)
    },
    async deleteItem(item) {
      console.log({ item })
      if (!confirm('Delete Product?')) return

      try {
        this.loading = true
        const res = await api.delete(`/products/${item.id}`)
        console.log(res)
        this.snackbar.success('Product Deleted!')
        await this.fetchItems()
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    filterName(value, search, item) {
      if (!search) return true
      return item.columns.name.toLowerCase().includes(search.toLowerCase())
    },
    async fetchItems() {
      this.loading = true;
      try {
        const res = await api.get('/products');
        this.products = res.data.map(p => ({
          ...p,
          actions: null
        }))

      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
