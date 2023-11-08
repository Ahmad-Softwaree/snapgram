import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appWriteConfig = {
  url: import.meta.env.VITE_APP_WRITE_URL,
  projectId: import.meta.env.VITE_APP_WRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APP_WRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APP_WRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APP_WRITE_USERS_COLLECTION_ID,
  postCollectionId: import.meta.env.VITE_APP_WRITE_POSTS_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APP_WRITE_SAVES_COLLECTION_ID,
};

export const client = new Client();

client.setProject(appWriteConfig.projectId);
client.setEndpoint(appWriteConfig.url);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
