import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// Public client for unauthenticated data access (no auth header)
export const base44Public = createClient({
  appId,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl,
  // No token provided - anonymous access
});