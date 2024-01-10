// Forked from https://github.com/histoire-dev/histoire/blob/main/packages/histoire-plugin-screenshot/src/index.ts 9f92721
// MIT License

import type { FileOptions } from 'capture-website'
import captureWebsite from 'capture-website'
import { defu } from 'defu'
import fs from 'fs-extra'
import type { Plugin } from 'histoire'
import path from 'pathe'

interface ScreenshotPresets {
  /**
   * Screenshot width.
   */
  width?: number
  /**
   * Screenshot height.
   */
  height?: number
}

export interface ScreenshotPluginOptions {
  /**
   * Folder were screenshots will be saved.
   */
  saveFolder?: string
  /**
   * Ignored stories.
   */
  ignored?: (payload: {
    file: string
    story: { title: string }
    variant: { id: string; title: string }
  }) => boolean
  /**
   * Presets for each screenshot.
   */
  presets?: ScreenshotPresets[]
  /**
   * Args for puppeteer
   */
  launchOptionsArgs?: string[]
}

const defaultOptions: ScreenshotPluginOptions = {
  saveFolder: '.histoire/screenshots',
  presets: [],
}

export function HstScreenshot(options: ScreenshotPluginOptions = {}): Plugin {
  const finalOptions: ScreenshotPluginOptions = defu(options, defaultOptions)
  if (!finalOptions.presets!.length) {
    finalOptions.presets!.push({
      width: 1280,
      height: 800,
    })
  }
  return {
    name: '@histoire/plugin-screenshot',

    onBuild: async (api) => {
      await fs.ensureDir(finalOptions.saveFolder!)

      api.onPreviewStory(async ({ file, story, variant, url }) => {
        if (
          finalOptions.ignored?.({
            file,
            story: {
              title: story.title,
            },
            variant: {
              id: variant.id,
              title: variant.title,
            },
          })
        ) {
          return
        }
        console.log(
          'Rendering screenshot for',
          file,
          'title:',
          story.title,
          'variant:',
          variant.id,
          'title:',
          variant.title
        )
        for (const preset of finalOptions.presets!) {
          const launchOptions = finalOptions.launchOptionsArgs
            ? {
                args: finalOptions.launchOptionsArgs,
              }
            : {}
          const captureWebsiteFileOptions: FileOptions = {
            overwrite: true,
            width: preset.width,
            height: preset.height,
            fullPage: true,
            launchOptions,
            scaleFactor: 1, // Changed option
          }
          let group = story.id.split('-')[1]
          group =
            {
              poiscard: 'PoisCard',
              poisdetails: 'PoisDetails',
              poislist: 'PoisList',
              ui: 'UI',
            }[group] || group
          group = group.charAt(0).toUpperCase() + group.slice(1)
          await fs.ensureDir(
            path.join(finalOptions.saveFolder!, group, story.title)
          )
          await captureWebsite.file(
            url,
            path.join(
              finalOptions.saveFolder!,
              group,
              story.title,
              `${variant.title}.png`
            ),
            captureWebsiteFileOptions
          )
        }
      })
    },
  }
}
