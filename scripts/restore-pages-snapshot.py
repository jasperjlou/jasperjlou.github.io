"""Restore the immutable public HTTP snapshot; never restore server state/secrets."""
import hashlib
import json
from pathlib import Path, PurePosixPath
import sys
import tarfile

source, destination = map(Path, sys.argv[1:])
expected = {
    "site-live-before.tar": "c29de261f82ccf8cdd9b81ad3ce32054b0183facb0a2c67f0d78523a7d875ff4",
    "site-snapshot-files.json": "01ea206717e73dddef1bfbb9d62399c2d01bae2f74f7b46a13f51e7c16f61851",
}
for name, digest in expected.items():
    if hashlib.sha256((source / name).read_bytes()).hexdigest() != digest:
        raise ValueError(f"Snapshot hash mismatch: {name}")
manifest = json.loads((source / "site-snapshot-files.json").read_text())
if destination.exists() and any(destination.iterdir()):
    raise ValueError("Restore destination must be empty")
destination.mkdir(parents=True, exist_ok=True)
with tarfile.open(source / "site-live-before.tar") as archive:
    members = archive.getmembers()
    names = [member.name for member in members]
    if len(names) != len(set(names)) or set(names) != set(manifest):
        raise ValueError("Snapshot file manifest differs")
    for member in members:
        path = PurePosixPath(member.name)
        if not member.isfile() or path.is_absolute() or ".." in path.parts or "\\" in member.name:
            raise ValueError("Unsafe archive entry")
        data = archive.extractfile(member).read()
        if hashlib.sha256(data).hexdigest() != manifest[member.name]:
            raise ValueError(f"File hash mismatch: {member.name}")
        target = destination / member.name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
for name in ["index.html", "admin/index.html", "projects/index.html", "notes/index.html", "about/index.html", "robots.txt", "rss.xml", "sitemap-index.xml"]:
    if not (destination / name).is_file():
        raise ValueError(f"Required published file missing: {name}")
# GitHub Pages custom domain remains the same when deploying the preserved artifact.
(destination / "CNAME").write_text("jasperjlou.me\n")
print(f"Verified and restored {len(manifest)} public files; custom domain preserved.")
