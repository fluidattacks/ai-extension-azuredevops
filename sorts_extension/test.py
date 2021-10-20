from typing import List
import sys
import subprocess
import os
import requests
import base64
import urllib.request
import git
from git.cmd import Git

USERPASS = sys.argv[1]


def http_get(url: str, return_json: bool = True) -> str:
    b64 = base64.b64encode(USERPASS.encode()).decode()
    headers = {"Authorization" : "Basic %s" % b64} 
    response = requests.get(url=url, headers=headers)

    return response.json() if return_json else response.text


def get_commit_files(url: str, file_paths: List[str]) -> None:
    for path in file_paths:
        url = url.replace("$path", path)
        response = http_get(url, return_json=False)
        file_name = f"resp_text.{str(path.split('.')[-1])}"
        with open(file_name, "w") as file:
            file.write(response)


def get_repositories_log(repo_path: str) -> None:
    git_repo: Git = git.Git(repo_path)
    git_log: str = git_repo.log(
        "--no-merges", "--numstat", "--pretty=%n%H,%ae,%aI%n"
    ).replace("\n\n\n", "\n")
    with open(f"{os.path.basename(repo_path)}.log", "w", encoding="utf8") as log_file:
        log_file.write(git_log)
    print(git_log)


def get_repository_id(url: str) -> str:
    response = http_get(url)

    return response["value"][0]["id"]


def get_commit_files_paths(url) -> List[str]:
    response = http_get(url)

    return response["changes"][0]["item"]["path"]


if __name__ == "__main__":
    organization = sys.argv[2]
    project_name = sys.argv[3]
    commit_id = sys.argv[4]
    repo_url = sys.argv[5]
    repo_local_url = sys.argv[6]
    print("git test")
    print(repo_local_url)

    get_repositories_log(repo_local_url)
    
    repository_url = f"https://dev.azure.com/{organization}/{project_name}/_apis/git/repositories?api-version=6.1-preview.1"
    repository_id = get_repository_id(repository_url)

    commit_info_url = f"https://dev.azure.com/{organization}/{project_name}/_apis/git/repositories/{repository_id}/commits/{commit_id}/changes?api-version=6.1-preview.1"
    get_commit_files_paths(commit_info_url)

    commit_files_url = f"https://dev.azure.com/{organization}/{project_name}/_apis/git/repositories/{repository_id}/items?scopePath=$path&api-version=6.1-preview.1"
    get_commit_files(commit_files_url, [path])

    file_name = f"resp_text.{str(path.split('.')[-1])}"
    print(f"check file: {file_name}")
    with open(file_name, "r") as file:
            print(file.read())
