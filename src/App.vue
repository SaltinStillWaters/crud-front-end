<template>
  <v-app>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" location="top">
      {{  snackbar.text  }}
    </v-snackbar>
    <v-layout>
      <AppHeader />
      <AppNav />
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import AppHeader from './layouts/AppHeader.vue';
import AppNav from './layouts/AppNav.vue';
import { useSnackbarStore } from './utils/snackbar';


export default {
  components: {
    AppHeader,
    AppNav,
  },
  computed: {
    snackbar() {
      return useSnackbarStore();
    }
  },
}
</script>
