#!/bin/bash
SERVICES=("docker" "nginx" "sshd")

fail=0
for svc in "${SERVICES[@]}"; do
    systemctl is-active --quiet $svc
    if [ $? -eq 0 ]; then
        echo "$svc: active"
    else
        echo "$svc: FAILED"
        fail=1
    fi
done

if [ $fail -eq 0 ]; then
    echo "PASS"
    echo "All essential services are active"
    exit 0
else
    echo "FAIL"
    echo "One or more services are inactive"
    exit 1
fi
