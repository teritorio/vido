<script>
// Monkey patch
// Change stategy of source image size
// Pass explicite size, not the default one based on view port size
import {
  useBaseImage,
  baseImageProps,
} from '@nuxt/image-edge/dist/runtime/components/_base.mjs'
import { h, defineComponent, computed } from 'vue'

import { getFileExtension } from '#image'
import { useImage, useHead } from '#imports'
export const pictureProps = {
  ...baseImageProps,
  legacyFormat: { type: String, default: null },
  imgAttrs: { type: Object, default: null },
  mediaSize: { type: String, required: true },
}
export default defineComponent({
  name: 'NuxtPicture',
  props: pictureProps,
  setup: (props, ctx) => {
    const $img = useImage()
    if (!$img) {
      // Without initialised Nuxt from Histoire, render a plain image
      return () => h('img', { src: props.src, ...props.imgAttrs })
    }
    const _base = useBaseImage(props)
    const isTransparent = computed(() =>
      ['png', 'webp', 'gif'].includes(originalFormat.value)
    )
    const originalFormat = computed(() => getFileExtension(props.src))
    const format = computed(() =>
      props.format || originalFormat.value === 'svg' ? 'svg' : 'webp'
    )
    const legacyFormat = computed(() => {
      if (props.legacyFormat) {
        return props.legacyFormat
      }
      const formats = {
        webp: isTransparent.value ? 'png' : 'jpeg',
        svg: 'png',
      }
      return formats[format.value] || originalFormat.value
    })
    const nSources = computed(() => {
      if (format.value === 'svg') {
        return [{ srcset: props.src }]
      }
      const formats =
        legacyFormat.value !== format.value
          ? [legacyFormat.value, format.value]
          : [format.value]
      return formats.map((format2) => {
        const { srcset, sizes, src } = $img.getSizes(props.src, {
          ..._base.options.value,
          sizes: props.sizes || $img.options.screens,
          modifiers: { ..._base.modifiers.value, format: format2 },
        })
        return { src, type: `image/${format2}`, sizes, srcset }
      })
    })
    if (props.preload) {
      const srcKey = nSources.value?.[1] ? 1 : 0
      const link = {
        rel: 'preload',
        as: 'image',
        imagesrcset: nSources.value[srcKey].srcset,
      }
      if (nSources.value?.[srcKey]?.sizes) {
        link.imagesizes = nSources.value[srcKey].sizes
      }
      useHead({ link: [link] })
    }
    const imgAttrs = { ...props.imgAttrs }
    for (const key in ctx.attrs) {
      if (key in baseImageProps && !(key in imgAttrs)) {
        imgAttrs[key] = ctx.attrs[key]
      }
    }
    // Get the smallest by default, not the biggest one
    const srcDefault = nSources.value[0].srcset.split(' ')[0] // Monkey path, add
    return () =>
      h('picture', { key: nSources.value[0].src }, [
        ...(nSources.value?.[1]
          ? [
              h('source', {
                type: nSources.value[1].type,
                sizes: props.mediaSize, // Monkey path, replace: nSources.value[1].sizes,
                srcset: nSources.value[1].srcset,
              }),
            ]
          : []),
        h('img', {
          ..._base.attrs.value,
          ...imgAttrs,
          // ...this.$attrs, // Monkey path, add
          // src: nSources.value[0].src,
          src: srcDefault, // Monkey path, replace: nSources.value[0].src,
          // sizes: nSources.value[0].sizes,
          sizes: props.mediaSize, // Monkey path, replace: nSources.value[0].sizes,
          srcset: nSources.value[0].srcset,
        }),
      ])
  },
})
</script>
