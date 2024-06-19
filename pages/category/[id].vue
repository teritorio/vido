<script setup lang="ts">
//
// Validators
//
definePageMeta({
  validate({ params }) {
    return (
      typeof params.id === 'string' && /^[-\w:,]+$/.test(params.id)
    )
  },
})
</script>
