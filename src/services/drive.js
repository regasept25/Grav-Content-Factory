"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDriveService = void 0;
const googleapis_1 = require("googleapis");
const fs = __importStar(require("fs"));
const config_1 = require("../config");
class GoogleDriveService {
    drive;
    constructor() {
        const { clientId, clientSecret, redirectUri, refreshToken } = config_1.mediaConfig.googleDrive;
        if (clientId && clientSecret && refreshToken) {
            const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
            oauth2Client.setCredentials({
                refresh_token: refreshToken
            });
            this.drive = googleapis_1.google.drive({
                version: 'v3',
                auth: oauth2Client
            });
        }
    }
    async uploadFile(filePath, mimeType, customFileName) {
        if (!this.drive) {
            throw new Error('Google Drive API credentials not configured.');
        }
        const fileName = customFileName || filePath.split('/').pop() || 'upload';
        const fileMetadata = {
            name: fileName,
        };
        if (config_1.mediaConfig.googleDrive.folderId) {
            fileMetadata.parents = [config_1.mediaConfig.googleDrive.folderId];
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
exports.GoogleDriveService = GoogleDriveService;
//# sourceMappingURL=drive.js.map