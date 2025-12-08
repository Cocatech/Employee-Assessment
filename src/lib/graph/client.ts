import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

/**
 * Microsoft Graph API Client Configuration
 * Uses Azure AD App Registration for authentication
 */

const credential = new ClientSecretCredential(
  process.env.AZURE_AD_TENANT_ID!,
  process.env.AZURE_AD_CLIENT_ID!,
  process.env.AZURE_AD_CLIENT_SECRET!
);

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default'],
});

/**
 * Get an authenticated Microsoft Graph client instance
 */
export function getGraphClient(): Client {
  return Client.initWithMiddleware({
    authProvider,
  });
}

/**
 * SharePoint site ID from environment
 */
export const SHAREPOINT_SITE_ID = process.env.SHAREPOINT_SITE_ID!;
