<template>
  <v-card class="mx-auto" max-width="344" title="User Registration">
    <v-form ref="formRef" @submit.prevent="submit">
      <v-text-field v-model="form.name" :rules="rules.name" color="primary" label="Product Name"
        variant="underlined"></v-text-field>

      <v-text-field v-model.number="form.quantity" :rules="rules.quantity" color="primary" label="Quantity"
        variant="underlined"></v-text-field>

      <v-text-field v-model.number="form.price" :rules="rules.price" color="primary" label="Price"
        variant="underlined"></v-text-field>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn v-if='showDelete' type='button' @click="onDelete" :loading="loading" :disabled="loading" color="red">
          <v-icon icon="mdi-trash-can" end></v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn type='submit' :loading="loading" :disabled="loading" color="success">
          Confirm
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { isNumber, minValue, required } from '@/utils/rules';
import { defineComponent } from 'vue';
import { VForm } from 'vuetify/components';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object as () => { name?: string; quantity?: number; price?: number },
      default: () => ({}),
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(newData) {
        Object.assign(this.form, {
          name: newData.name ?? '',
          quantity: newData.quantity ?? null,
          price: newData.price ?? null,
        })
      }
    },
  },
  data() {
    return {
      form: {
        name: this.data.name || '',
        quantity: this.data.quantity || null,
        price: this.data.price || null,
      },
      rules: {
        name: [required()],
        quantity: [required(), isNumber(), minValue(0)],
        price: [required(), isNumber(), minValue(0)],
      }
    };
  },
  methods: {
    async submit() {
      const form = this.$refs.formRef as VForm | undefined;
      if (!form) return

      const { valid } = await form.validate()
      if (!valid) return

      this.$emit('submit-form', this.form);
    },

    onDelete() {
      console.log('deleting')
      this.$emit('onDelete')
    }
  }
});
</script>
