<template>
  <v-navigation-drawer expand-on-hover rail v-if="user">
    <v-list density="compact" nav>
      <v-list-item to='/products/create' prepend-icon="mdi-package-variant-plus" title="Add Product" />
      <v-list-item to='/products/showall' prepend-icon="mdi-view-list" title="Product List" />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { user } from '@/utils/auth';

export default {
  computed: {
    user() {
      return user.value
    }
  }
}
</script>
