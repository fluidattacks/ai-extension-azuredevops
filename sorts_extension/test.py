from typing import List, Tuple
import sys
import subprocess
import os
import requests
import base64
import urllib.request
import git
from git.cmd import Git
import pandas as pd
from pandas import (
    DataFrame,
)

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


def get_repository_id(url: str) -> str:
    response = http_get(url)

    return response["value"][0]["id"]


def get_commit_files_paths(url) -> List[str]:
    response = http_get(url)

    return response["changes"][0]["item"]["path"]


def get_repositories_log(repo_path: str) -> None:
    git_repo: Git = git.Git(repo_path)
    git_log: str = git_repo.log(
        "--no-merges", "--numstat", "--pretty=%n%H,%ae,%aI%n"
    ).replace("\n\n\n", "\n")
    with open(f"{os.path.basename(repo_path)}.log", "w", encoding="utf8") as log_file:
        log_file.write(git_log)
    print(git_log)


def read_allowed_names() -> Tuple[List[str], ...]:
    allowed_names: List[List[str]] = []
    for name in ["extensions.lst", "composites.lst"]:
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), name)) as file:
            content_as_list = file.read().split("\n")
            allowed_names.append(list(filter(None, content_as_list)))

    return (allowed_names[0], allowed_names[1])


def get_subscription_files_df(repository_path: str) -> DataFrame:
    print("get_subscription_files_df")
    files: List[str] = []
    extensions, composites = read_allowed_names()
    ignore_dirs: List[str] = [".git"]
    repo_files = [
        os.path.join(path, filename).replace(
            f"{os.path.dirname(repository_path)}/", ""
        )
        for path, _, files in os.walk(repository_path)
        for filename in files
        if all(  # pylint: disable=use-a-generator
            [dir_ not in path for dir_ in ignore_dirs]
        )
    ]
    print(repo_files)
    allowed_files = list(
        filter(
            lambda ext: (
                ext in composites or ext.split(".")[-1].lower() in extensions
            ),
            repo_files,
        )
    )
    print(allowed_files)
    files_df: DataFrame = pd.DataFrame(allowed_files, columns=["file"])
    files_df["repo"] = files_df["file"].apply(
        lambda x: os.path.join(repository_path, x.split("/")[0])
    )
    print(files_df)

    return files_df


if __name__ == "__main__":
    organization = sys.argv[2]
    project_name = sys.argv[3]
    commit_id = sys.argv[4]
    repo_url = sys.argv[5]
    repo_local_url = sys.argv[6]
    print("git test")
    print(repo_local_url)
    get_repositories_log(repo_local_url)
    predict_df = get_subscription_files_df(repo_local_url)
    """
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
    """
