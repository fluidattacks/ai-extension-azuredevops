import sys
import subprocess
import os
import requests
import base64
import urllib.request


def http_get(url, return_json=True):
    username = "mvaras"
    token = "z4grp7xjypzkpl34r2eaeiu773aw5qath2q4rgoksxdudoppstda"
    userpass = username + ":" + token
    b64 = base64.b64encode(userpass.encode()).decode()
    headers = {"Authorization" : "Basic %s" % b64} 
    response = requests.get(url=url, headers=headers)

    return response.json() if return_json else response.text


def get_commit_files(url, file_paths):
    for path in file_paths:
        url = url.replace("$path", path)
        response = http_get(url, return_json=False)
        file_name = f"resp_text.{str(path.split('.')[-1])}"
        with open(file_name, "w") as file:
            file.write(response)


if __name__ == "__main__":
    organization = sys.argv[1]
    project_name = sys.argv[2]
    commit_id = sys.argv[3]
    repository_url = f"https://dev.azure.com/{organization}/{project_name}/_apis/git/repositories?api-version=6.1-preview.1"
    response = http_get(repository_url)
    repository_id = response["value"][0]["id"]
    commit_info_url = f"https://dev.azure.com/{organization}/{project_name}/_apis/git/repositories/{repository_id}/commits/{commit_id}/changes?api-version=6.1-preview.1"
    response = http_get(commit_info_url)
    path = response["changes"][0]["item"]["path"]
    url = f"https://dev.azure.com/{organization}/{project_name}/_apis/git/repositories/{repository_id}/items?scopePath=$path&api-version=6.1-preview.1"
    get_commit_files(url, [path])
    file_name = f"resp_text.{str(path.split('.')[-1])}"
    print(f"check file: {file_name}")
    with open(file_name, "r") as file:
            print(file.read())
