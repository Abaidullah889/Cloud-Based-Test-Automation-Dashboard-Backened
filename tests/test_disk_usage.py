#!/usr/bin/env python3
import shutil
import sys

total, used, free = shutil.disk_usage("/")
usage_percent = (used / total) * 100

print(f"Disk usage: {usage_percent:.2f}%")
if usage_percent < 85:
    print("PASS")
    print("Disk usage is healthy")
    sys.exit(0)
else:
    print("FAIL")
    print("Disk usage is critically high")
    sys.exit(1)
