import { getGraphClient, SHAREPOINT_SITE_ID } from './client';

/**
 * SharePoint List Operations using Microsoft Graph API
 */

export interface SharePointListItem {
  id: string;
  fields: Record<string, unknown>;
  createdDateTime: string;
  lastModifiedDateTime: string;
}

/**
 * Get all items from a SharePoint list
 */
export async function getListItems(listName: string): Promise<SharePointListItem[]> {
  const client = getGraphClient();
  
  try {
    const response = await client
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${listName}/items`)
      .expand('fields')
      .get();
    
    return response.value;
  } catch (error) {
    console.error(`Error fetching list items from ${listName}:`, error);
    throw error;
  }
}

/**
 * Get a single item from a SharePoint list by ID
 */
export async function getListItem(listName: string, itemId: string): Promise<SharePointListItem> {
  const client = getGraphClient();
  
  try {
    const response = await client
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${listName}/items/${itemId}`)
      .expand('fields')
      .get();
    
    return response;
  } catch (error) {
    console.error(`Error fetching item ${itemId} from ${listName}:`, error);
    throw error;
  }
}

/**
 * Create a new item in a SharePoint list
 */
export async function createListItem(
  listName: string,
  fields: Record<string, unknown>
): Promise<SharePointListItem> {
  const client = getGraphClient();
  
  try {
    const response = await client
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${listName}/items`)
      .post({ fields });
    
    return response;
  } catch (error) {
    console.error(`Error creating item in ${listName}:`, error);
    throw error;
  }
}

/**
 * Update an existing item in a SharePoint list
 */
export async function updateListItem(
  listName: string,
  itemId: string,
  fields: Record<string, unknown>
): Promise<SharePointListItem> {
  const client = getGraphClient();
  
  try {
    const response = await client
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${listName}/items/${itemId}/fields`)
      .patch(fields);
    
    return response;
  } catch (error) {
    console.error(`Error updating item ${itemId} in ${listName}:`, error);
    throw error;
  }
}

/**
 * Delete an item from a SharePoint list
 */
export async function deleteListItem(listName: string, itemId: string): Promise<void> {
  const client = getGraphClient();
  
  try {
    await client
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${listName}/items/${itemId}`)
      .delete();
  } catch (error) {
    console.error(`Error deleting item ${itemId} from ${listName}:`, error);
    throw error;
  }
}
