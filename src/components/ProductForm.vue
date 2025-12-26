<template>
  <v-form ref="formRef" @submit.prevent="submit" :loading="loading">
    <v-text-field v-model="form.name" :rules="rules.name" label="Product Name" variant="underlined" />
    <v-text-field v-model.number="form.quantity" :rules="rules.quantity" label="Quantity" variant="underlined" />
    <v-text-field v-model.number="form.price" :rules="rules.price" label="Price" variant="underlined" />

    <v-divider class="my-4" />

    <v-card-actions>
      <v-btn v-if="showDelete" color="red" @click="onDelete" :loading="loading">
        <v-icon icon="mdi-trash-can" />
      </v-btn>

      <v-spacer />

      <v-btn @click="onCancel" color="tonal" :loading="loading">
        Cancel
      </v-btn>
      <v-btn type="submit" color="success" :loading="loading">
        Confirm
        <v-icon icon="mdi-chevron-right" end />
      </v-btn>
    </v-card-actions>
  </v-form>
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
    },
    onCancel() {
      console.log('canceling')
      this.$emit('onCancel')
    }
  }
});
</script>
