'use client'

import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import * as React from 'react'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  const onChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Switch onCheckedChange={onChange} checked={theme === 'dark'}>
      {theme}
    </Switch>
  )
}
