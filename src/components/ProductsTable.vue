<template>
  <v-data-table :items="products" :custom-filter="filterName" :search="search" @click:row='onRowClick' :loading="loading">
    <template #top>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>
  </v-data-table>
</template>

<script>
import api from "@/utils/axios";

export default {
  data() {
    return {
      products: [],
      search: '',
      loading: false,
    };
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    onRowClick(event, row) {
      console.log({...row})
        this.$router.push(`/products/update/${row.item.id}`)
    },
    filterName(value, search, item) {
        if (!search) return true
        return item.columns.name.toLowerCase().includes(search.toLowerCase())
    },
    async fetchItems() {
      this.loading = true;
      try {
        const res = await api.get('/products');
        this.products = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>