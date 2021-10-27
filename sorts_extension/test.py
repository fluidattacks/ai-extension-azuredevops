from typing import (
    List,
    Tuple,
)
from joblib import (
    load,
)
from prettytable import (
    from_csv,
    PrettyTable,
)
import sys
import subprocess
import os
import requests
import base64
import urllib.request
import git
from git.cmd import (
    Git,
)
import pandas as pd
from pandas import (
    DataFrame,
)
from file import (
    extract_features,
    get_extensions_list,
)
from numpy import (
    ndarray,
)
import numpy as np


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
        file_name = path.split("/")[-1]
        with open(file_name, "w") as file:
            file.write(response)


def get_repository_id(url: str) -> str:
    response = http_get(url)

    return response["value"][0]["id"]


def get_commit_files_paths(url) -> List[str]:
    response = http_get(url)
    print(response["changes"])

    return response["changes"]


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

    allowed_files = list(
        filter(
            lambda ext: (
                ext in composites or ext.split(".")[-1].lower() in extensions
            ),
            repo_files,
        )
    )

    files_df: DataFrame = pd.DataFrame(allowed_files, columns=["file"])
    files_df["repo"] = repository_path
    files_df["is_vuln"] = 0

    return files_df


def build_results_csv(
    predictions: ndarray, predict_df: DataFrame, csv_name: str
) -> None:
    scope: str = csv_name.split(".")[0].split("_")[-1]
    result_df: DataFrame = pd.concat(
        [
            predict_df[[scope]],
            pd.DataFrame(
                predictions, columns=["pred", "prob_safe", "prob_vuln"]
            ),
        ],
        axis=1,
    )
    error: float = 5 + 5 * np.random.rand(
        len(result_df),
    )
    result_df["prob_vuln"] = round(result_df.prob_vuln * 100 - error, 1)
    sorted_files: DataFrame = (
        result_df[result_df.prob_vuln >= 0]
        .sort_values(by="prob_vuln", ascending=False)
        .reset_index(drop=True)[[scope, "prob_vuln"]]
    )
    sorted_files.to_csv(csv_name, index=False)


def predict_vuln_prob(
    predict_df: DataFrame, features: List[str], csv_name: str
) -> None:
    model = load(os.path.join(os.path.dirname(os.path.realpath(__file__)), "model.joblib"))
    input_data = predict_df[model.feature_names + features]
    probability_prediction: ndarray = model.predict_proba(input_data)
    class_prediction: ndarray = model.predict(input_data)
    merged_predictions: ndarray = np.column_stack(
        [class_prediction, probability_prediction]
    )

    build_results_csv(merged_predictions, predict_df, csv_name)


def display_results(csv_name: str) -> None:
    scope: str = csv_name.split(".")[0].split("_")[-1]
    with open(csv_name, "r", encoding="utf8") as csv_file:
        table = from_csv(
            csv_file, field_names=[scope, "prob_vuln"], delimiter=","
        )
    table.align[scope] = "l"
    table._max_width = {scope: 120, "prob_vuln": 10}

    print(table.get_string(start=1, end=20))


if __name__ == "__main__":
    organization = sys.argv[2]
    project_name = sys.argv[3]
    commit_id = sys.argv[4]
    repo_url = sys.argv[5]
    repo_local_url = sys.argv[6]
    
    repository_url = f"https://dev.azure.com/{organization}/{project_name}/_apis/git/repositories?api-version=6.1-preview.1"
    repository_id = get_repository_id(repository_url)

    commit_info_url = f"https://dev.azure.com/{organization}/{project_name}/_apis/git/repositories/{repository_id}/commits/{commit_id}/changes?api-version=6.1-preview.1"
    items = get_commit_files_paths(commit_info_url)
    print(f"Current commit contains {len(items)} files")
    print(items)

    paths = [item["item"]["path"] for item in items]
    commit_files_url = f"https://dev.azure.com/{organization}/{project_name}/_apis/git/repositories/{repository_id}/items?scopePath=$path&api-version=6.1-preview.1"
    get_commit_files(commit_files_url, paths)

    """
    item = paths[0]
    print(f"check file: {item}")
    with open(item.split("/")[-1], "r") as file:
        print(file.read())
    """
    print("git test")
    get_repositories_log(repo_local_url)
    files_df = get_subscription_files_df(repo_local_url)
    print(files_df)
    print(extract_features(files_df))
    print(files_df)
    extensions: List[str] = get_extensions_list()
    num_bits: int = len(extensions).bit_length()
    print(num_bits)
    print(files_df.head())
    print(files_df.columns.values.tolist())

    print("predict_vuln_prob")
    results_file_name = "sorts_results_file.csv"
    predict_vuln_prob(
        files_df,
        [f"extension_{num}" for num in range(num_bits + 1)],
        results_file_name,
    )
    display_results(results_file_name)
