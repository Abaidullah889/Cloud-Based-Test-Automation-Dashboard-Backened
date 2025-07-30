#!/usr/bin/env python3
"""
Mock test script for CPU usage monitoring
"""
import time
import random

def test_cpu_usage():
    """Test CPU usage and return PASS/FAIL"""
    # Simulate test execution time
    time.sleep(1)
    
    # Mock CPU usage check
    cpu_usage = random.randint(10, 90)
    print(f"CPU usage: {cpu_usage}%")
    
    if cpu_usage < 80:
        print("PASS")
        print("CPU usage is within acceptable range")
        return True
    else:
        print("FAIL") 
        print("CPU usage is too high")
        return False

if __name__ == "__main__":
    success = test_cpu_usage()
    exit(0 if success else 1) 