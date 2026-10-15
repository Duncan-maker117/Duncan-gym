// Product-facing name. Keep storage keys and import/export formats unchanged so existing
// training records remain readable after the rebrand.
export const APP_NAME = 'Duncan gym'
export const REPOSITORY_URL = 'https://github.com/Duncan-maker117/Duncan-gym'

// Locale source keys still say openGym. Replacing the rendered name keeps all existing
// translations usable without changing their lookup keys. Actual backup folder paths
// such as Documents/openGym are intentionally left as they are.
export const brandText = value => value.replace(/(?<![\w/])openGym/g, APP_NAME)

// The bundled exercise images and clips are licensed separately from the source code.
// A fork needs its own media licence before it can enable them in a public build.
export const BUILTIN_MEDIA_ENABLED = import.meta.env?.VITE_BUILTIN_MEDIA === '1' || import.meta.env?.MODE === 'test'
