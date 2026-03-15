"""
Uploads a file to a Google Drive folder using a service account.
Keeps only the 30 most recent backups in the folder, deleting older ones.

Usage: python scripts/upload_backup_to_drive.py <filename>
"""

import json
import os
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ['https://www.googleapis.com/auth/drive.file']
KEEP_LAST_N = 30


def main():
    if len(sys.argv) < 2:
        print("Usage: upload_backup_to_drive.py <filename>")
        sys.exit(1)

    filename = sys.argv[1]
    if not os.path.exists(filename):
        print(f"File not found: {filename}")
        sys.exit(1)

    service_account_info = json.loads(os.environ['GOOGLE_SERVICE_ACCOUNT_JSON'])
    folder_id = os.environ['GOOGLE_DRIVE_FOLDER_ID']

    credentials = service_account.Credentials.from_service_account_info(
        service_account_info, scopes=SCOPES
    )
    service = build('drive', 'v3', credentials=credentials)

    # Upload new backup
    file_metadata = {'name': os.path.basename(filename), 'parents': [folder_id]}
    media = MediaFileUpload(filename, mimetype='application/gzip', resumable=True)
    uploaded = service.files().create(body=file_metadata, media_body=media, fields='id,name').execute()
    print(f"Uploaded: {uploaded['name']} (id: {uploaded['id']})")

    # List all backups in the folder, sorted oldest first
    response = service.files().list(
        q=f"'{folder_id}' in parents and trashed = false",
        orderBy='createdTime asc',
        fields='files(id, name, createdTime)',
        pageSize=100,
    ).execute()
    files = response.get('files', [])

    # Delete any beyond the retention limit
    if len(files) > KEEP_LAST_N:
        to_delete = files[:len(files) - KEEP_LAST_N]
        for f in to_delete:
            service.files().delete(fileId=f['id']).execute()
            print(f"Deleted old backup: {f['name']}")

    print(f"Done. {min(len(files), KEEP_LAST_N)} backups retained.")


if __name__ == '__main__':
    main()
