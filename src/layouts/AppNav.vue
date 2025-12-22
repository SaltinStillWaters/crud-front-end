<template>
      <v-navigation-drawer
        expand-on-hover
        rail
      >
        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item to='/products/create' prepend-icon="mdi-package-variant-plus" title="Add Product" value="addProduct"></v-list-item>
          <v-list-item to='/products/showall' prepend-icon="mdi-view-list" title="Product List" value="productList"></v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>
