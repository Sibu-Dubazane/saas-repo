"""Utilities to help manage API version folders."""

from __future__ import annotations

import shutil
from dataclasses import dataclass
from importlib import import_module
from pathlib import Path
from typing import Iterable, Set

from fastapi import APIRouter
from fastapi.routing import APIRoute

API_DIR = Path(__file__).resolve().parents[1] / "app" / "api"


def clone_version(source: str, target: str, *, overwrite: bool = False) -> Path:
    """Copy the entire API version folder to bootstrap a new version."""
    src = API_DIR / source
    dest = API_DIR / target
    if not src.exists():
        raise FileNotFoundError(f"Source version folder {src} not found")
    if dest.exists():
        if not overwrite:
            raise FileExistsError(
                f"Target version folder {dest} already exists. "
                "Pass overwrite=True to replace it."
            )
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
    return dest


def load_router(version: str) -> APIRouter:
    """Import the router exported by app.api.<version>."""
    module = import_module(f"app.api.{version}")
    router = getattr(module, "router", None)
    if router is None:
        raise AttributeError(f"Version {version} does not expose a router")
    return router


@dataclass(frozen=True)
class RouteSignature:
    method: str
    path: str
    name: str


def collect_signatures(router: APIRouter) -> Set[RouteSignature]:
    """Collect normalized method/path/name tuples for comparison."""
    signatures: Set[RouteSignature] = set()
    for route in router.routes:
        if not isinstance(route, APIRoute):
            continue
        for method in route.methods or []:
            signatures.add(
                RouteSignature(
                    method=method.upper(),
                    path=str(route.path),
                    name=route.name or route.endpoint.__name__,
                )
            )
    return signatures


def diff_versions(base_version: str, candidate_version: str) -> dict[str, Set[RouteSignature]]:
    """Compare two routers and highlight missing or extra endpoints."""
    base_router = load_router(base_version)
    candidate_router = load_router(candidate_version)
    base_signatures = collect_signatures(base_router)
    candidate_signatures = collect_signatures(candidate_router)
    missing = base_signatures - candidate_signatures
    added = candidate_signatures - base_signatures
    return {"missing": missing, "added": added}


__all__ = [
    "clone_version",
    "collect_signatures",
    "diff_versions",
    "load_router",
    "RouteSignature",
]

