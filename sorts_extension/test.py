import sys
import subprocess
import os


# git diff-tree --no-commit-id --name-only -r $(Build.SourceVersion)
print("python code")
print(os.environ)
print(sys.argv[1])
print(sys.argv[2])
print(subprocess.run(f"git log"))
print(subprocess.run(f"git diff-tree --no-commit-id --name-only -r {sys.argv[2]}"))
