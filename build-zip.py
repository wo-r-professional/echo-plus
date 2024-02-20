#
# This was made to simplify the process to create the zip and tar files for the "Releases" section
# of github. It reads "extension/", while ignoring "stylesheet" inside of it.
#

import os
import zipfile
import tarfile
import json

def zip_dir(source_dir, output_dir, zip_name):
    zip_path = os.path.join(output_dir, zip_name + '.zip')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                if "stylesheet" not in file_path:
                    arcname = os.path.relpath(file_path, start=source_dir)
                    zipf.write(file_path, arcname)

def tar_dir(source_dir, output_dir, tar_name):
    with tarfile.open(os.path.join(output_dir, tar_name + '.tar.gz'), "w:gz") as tar:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                if "stylesheet" not in file_path:
                    tar.add(file_path, arcname=os.path.relpath(file_path, start=source_dir))

if not os.path.exists("build"):
    os.makedirs("build")

def manifest_version():
    with open("extension/manifest.json", 'r') as manifest_file:
        manifest_data = json.load(manifest_file)
        return manifest_data.get('version')

zip_dir("extension", "build", f"chrome_v{manifest_version()}")
tar_dir("extension", "build", f"chrome_v{manifest_version()}")