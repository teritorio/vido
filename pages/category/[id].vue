<script setup lang="ts">
import { regexForCategoryIds } from '~/composables/useIdsResolver'

//
// Validators
//
definePageMeta({
  validate({ params }) {
    return !!params.id && regexForCategoryIds.test(params.id.toString())
  },
})
</script>
