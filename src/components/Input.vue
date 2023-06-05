<template>
  <label class="form-label" :for="id"> {{ label }} </label>
  <input
    :value="modelValue"
    @input="(e) => $emit('update:modelValue', e.target.value)"
    class="form-control"
    :class="help && 'is-invalid'"
    :id="id"
    :type="type"
  />
  <span
    :class="help && 'invalid-feedback'"
    class="text-danger"
    :id="`validation-${label}`"
    v-if="help"
  >
    {{ help }}
  </span>
</template>

<script>
export default {
  name: "InputComponent",
  props: {
    label: String,
    id: String,
    type: {
      type: String,
      default: "text",
    },
    help: String,
    modelValue: String,
  },
};
</script>
