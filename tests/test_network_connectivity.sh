#!/bin/bash
# Mock test script for network connectivity

echo "Testing network connectivity..."
sleep 1

# Mock ping test to Google DNS
PING_RESULT=$((RANDOM % 10))

if [ $PING_RESULT -lt 8 ]; then
    echo "PASS"
    echo "Network connectivity test successful"
    echo "Ping to 8.8.8.8: 12ms"
    exit 0
else
    echo "FAIL"
    echo "Network connectivity test failed"
    echo "Unable to reach external servers"
    exit 1
fi 