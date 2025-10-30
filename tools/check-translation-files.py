#!/usr/bin/env python3

import argparse
import json
import os
import sys
from typing import Any, Dict, List, Set


def read_json_file(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def flatten_keys(data: Any, parent_key: str = "") -> Set[str]:
    keys: Set[str] = set()
    if isinstance(data, dict):
        for k, v in data.items():
            new_key = f"{parent_key}.{k}" if parent_key else k
            keys.add(new_key)
            keys.update(flatten_keys(v, new_key))
    elif isinstance(data, list):
        # Treat list presence as a terminal key; do not index into arrays for i18n
        # but still return the parent key path as present (already added by caller)
        pass
    else:
        # Primitive value; terminal key already recorded by caller
        pass
    return keys


def compare_keys(en_path: str, fr_path: str) -> int:
    try:
        en = read_json_file(en_path)
        fr = read_json_file(fr_path)
    except FileNotFoundError as e:
        print(f"Error: file not found: {e}")
        return 2
    except json.JSONDecodeError as e:
        print(f"Error: invalid JSON in one of the files: {e}")
        return 2

    en_keys = flatten_keys(en)
    fr_keys = flatten_keys(fr)

    missing_in_fr = sorted(list(en_keys - fr_keys))
    missing_in_en = sorted(list(fr_keys - en_keys))

    issues: List[str] = []
    if missing_in_fr:
        issues.append("Keys present in en.json but missing in fr.json:")
        issues.extend([f"  - {k}" for k in missing_in_fr])

    if missing_in_en:
        issues.append("Keys present in fr.json but missing in en.json:")
        issues.extend([f"  - {k}" for k in missing_in_en])

    if issues:
        print("Translation key mismatch detected:\n")
        print("\n".join(issues))
        print("\nExplanation: All translation keys must exist in both files. "
              "Add the missing keys to keep the locales in sync.")
        return 1

    print("OK: en.json and fr.json have matching keys.")
    return 0


def main() -> None:
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    default_en = os.path.join(repo_root, "src", "assets", "i18n", "en.json")
    default_fr = os.path.join(repo_root, "src", "assets", "i18n", "fr.json")

    parser = argparse.ArgumentParser(
        description="Compare translation keys between en.json and fr.json"
    )
    parser.add_argument("--en", dest="en_path", default=default_en,
                        help=f"Path to en.json (default: {default_en})")
    parser.add_argument("--fr", dest="fr_path", default=default_fr,
                        help=f"Path to fr.json (default: {default_fr})")
    args = parser.parse_args()

    exit_code = compare_keys(args.en_path, args.fr_path)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()


