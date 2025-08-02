#!/usr/bin/env python3
import os
import sys

files = ["/src/server.ts","/src/controllers/testController.ts"]

missing = [f for f in files if not os.path.exists(f)]
if not missing:
    print("PASS")
    print("All critical files are present")
    exit(0)
else:
    print("FAIL")
    print(f"Missing files: {', '.join(missing)}")
    exit(1)
