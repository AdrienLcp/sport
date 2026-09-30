import { Result } from '@adrienlcp/result'

/** The browser's own save dialog. No library, no server, no account. */
export const downloadTextFile = ({
  name,
  text,
  type
}: {
  name: string
  text: string
  type: string
}): Result<void, 'unavailable'> => {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }))
    const link = document.createElement('a')
    link.href = url
    link.download = name
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    return Result.success()
  } catch {
    return Result.failure('unavailable')
  }
}

export const readFileText = async (
  file: File
): Promise<Result<string, 'unreadable'>> => {
  try {
    return Result.success(await file.text())
  } catch {
    return Result.failure('unreadable')
  }
}

/** A fresh load: the one recovery for a page whose code failed to arrive. */
export const reloadPage = (): void => {
  window.location.reload()
}

/** The languages the browser says the reader reads, most preferred first. */
export const preferredLocales = (): readonly string[] => navigator.languages

/** Opened from the home screen or an app window, rather than in a browser tab. */
export const isStandaloneDisplay = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in navigator && navigator.standalone === true)

/**
 * iPhone and iPad install from the Share menu and never fire an install
 * prompt. iPadOS reports itself as a Mac, so a touch screen is what tells.
 */
export const isAppleMobile = (): boolean =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1)

/** A full load of `path`: what resets every plate that read its numbers on opening. */
export const loadPage = (path: string): void => {
  window.location.assign(path)
}
