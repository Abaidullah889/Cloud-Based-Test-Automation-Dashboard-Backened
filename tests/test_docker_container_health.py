#!/bin/bash

container_name="backend"

health=$(docker inspect --format='{{.State.Health.Status}}' $container_name 2>/dev/null)

if [ "$health" == "healthy" ]; then
    echo "PASS"
    echo "Container $container_name is healthy"
    exit 0
elif [ "$health" == "unhealthy" ]; then
    echo "FAIL"
    echo "Container $container_name is unhealthy"
    exit 1
else
    echo "FAIL"
    echo "Container $container_name not found or no health check defined"
    exit 1
fi
