/**
 * An array of routes that are public.
 * These routes do not require authentication.
 * @type {string[]}
 */

export const publicRoutes = ["/", "/auth/new-verification", "/search"];

/**
 * An array of routes that are used for authentication .
 * These routes will redirect logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The prefix for API webhooks routes.
 * Routes that start with this prefix are used for API webhooks purposes.
 * @type {string}
 */
export const apiWebhooksPrefix = "/api/webhooks";

/**
 * The prefix for API upload image routes.
 * Routes that start with this prefix are used for API uploadthing purposes.
 * @type {string}
 */
export const apiUploadthingPrefix = "/api/uploadthing";

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
export const DEFAULT_SETTINGS_REDIRECT = "/settings/profile";
