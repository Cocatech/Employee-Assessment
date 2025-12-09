import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

/**
 * Microsoft Graph API Client Configuration
 * Uses Azure AD App Registration for authentication
 * Lazy initialization to avoid errors when Azure credentials are not set
 */

let graphClient: Client | null = null;

/**
 * Get an authenticated Microsoft Graph client instance
 */
export function getGraphClient(): Client {
  // ถ้าใช้ Mock API ให้ throw error แทน
  if (process.env.USE_MOCK_API === 'true') {
    throw new Error('Graph API is not available in Mock API mode. Use employeeAdapter instead.');
  }

  // Lazy initialization
  if (!graphClient) {
    // Validate required environment variables
    if (!process.env.AZURE_AD_TENANT_ID || 
        !process.env.AZURE_AD_CLIENT_ID || 
        !process.env.AZURE_AD_CLIENT_SECRET) {
      throw new Error('Azure AD credentials are not configured. Please set AZURE_AD_TENANT_ID, AZURE_AD_CLIENT_ID, and AZURE_AD_CLIENT_SECRET in .env.local');
    }

    const credential = new ClientSecretCredential(
      process.env.AZURE_AD_TENANT_ID,
      process.env.AZURE_AD_CLIENT_ID,
      process.env.AZURE_AD_CLIENT_SECRET
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default'],
    });

    graphClient = Client.initWithMiddleware({
      authProvider,
    });
  }

  return graphClient;
}

/**
 * SharePoint site ID from environment
 */
export const SHAREPOINT_SITE_ID = process.env.SHAREPOINT_SITE_ID!;
