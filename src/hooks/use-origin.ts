import { useIsClient } from 'usehooks-ts'

export const useOrigin = () => {
  const isClient = useIsClient()

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : ''

  if (!isClient) {
    return ''
  }

  return origin
}
