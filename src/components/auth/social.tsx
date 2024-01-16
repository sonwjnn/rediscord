'use client'

import { GithubIcon, GoogleIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

interface SocialProps {}

export const Social = ({}: SocialProps) => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  }

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        onClick={() => onClick('google')}
        size="lg"
        className="w-full"
        variant="outline"
      >
        <GoogleIcon size={28} />
      </Button>
      <Button
        onClick={() => onClick('github')}
        size="lg"
        className="w-full"
        variant="outline"
      >
        <GithubIcon size={36} />
      </Button>
    </div>
  )
}
