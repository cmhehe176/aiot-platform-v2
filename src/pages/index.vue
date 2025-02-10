<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  onMounted(() => useRouter().push({ name: 'alert' }))
</script>
