import authConfig from '@/auth.config'
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  apiUploadthingPrefix,
  apiWebhooksPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth(req => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isApiWebhooksRoute = nextUrl.pathname.startsWith(apiWebhooksPrefix)
  const isApiUploadthingRoute =
    nextUrl.pathname.startsWith(apiUploadthingPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute || isApiWebhooksRoute || isApiUploadthingRoute) {
    return NextResponse.next()
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
