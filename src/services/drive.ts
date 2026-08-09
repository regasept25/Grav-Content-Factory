import { google } from 'googleapis';
import * as fs from 'fs';
import { mediaConfig } from '../config';

export class GoogleDriveService {
  private drive: any;

  constructor() {
    const { clientId, clientSecret, redirectUri, refreshToken } = mediaConfig.googleDrive;
    
    if (clientId && clientSecret && refreshToken) {
      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

      oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      this.drive = google.drive({
        version: 'v3',
        auth: oauth2Client
      });
    }
  }

  async uploadFile(filePath: string, mimeType: string, customFileName?: string): Promise<string> {
    if (!this.drive) {
      throw new Error('Google Drive API credentials not configured.');
    }

    const fileName = customFileName || filePath.split('/').pop() || 'upload';
    const fileMetadata: any = {
      name: fileName,
    };

    if (mediaConfig.googleDrive.folderId) {
      fileMetadata.parents = [mediaConfig.googleDrive.folderId];
    }

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath),
    };

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    // Make shareable link public for easy viewing/downloads
    await this.drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return response.data.webViewLink || '';
  }
}
