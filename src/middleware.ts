import authConfig from '@/auth.config'
import {
	apiAuthPrefix,
	apiUploadthingPrefix,
	apiWebhooksPrefix,
	authRoutes,
	DEFAULT_LOGIN_REDIRECT,
	publicRoutes,
} from '@/routes'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
	const { nextUrl } = req
	const isLoggedIn = !!req.auth

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
	const isApiWebhooksRoute = nextUrl.pathname.startsWith(apiWebhooksPrefix)
	const isApiUploadthingRoute = nextUrl.pathname.startsWith(
		apiUploadthingPrefix,
	)
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
	const isAuthRoute = authRoutes.includes(nextUrl.pathname)

	const response = NextResponse.next()
	
	if (isLoggedIn && req.auth) {
    // console.log("req.auth", req.auth.user)
		const encodedUser = Buffer.from(JSON.stringify(req.auth.user)).toString('base64')
		response.headers.set('x-auth-user', encodedUser)
	}

	if (isApiAuthRoute || isApiWebhooksRoute || isApiUploadthingRoute) {
		return response
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
		}
		return response
	}

	if (!isLoggedIn && !isPublicRoute) {
		let callbackUrl = nextUrl.pathname
		if (nextUrl.search) {
			callbackUrl += nextUrl.search
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl)

		return Response.redirect(
			new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
		)
	}

	return response
})

export const config = {
	matcher: [
		'/((?!.+\\.[\\w]+$|_next).*)',
		'/',
		'/(api|trpc)(.*)',
	],
}
