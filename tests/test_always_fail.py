#!/usr/bin/env python3
"""
Mock test script that always fails - for testing error handling
"""
import time

def test_always_fail():
    """A test that always fails"""
    time.sleep(0.5)
    
    print("Running critical system test...")
    print("Checking database connection...")
    print("Database connection timeout!")
    print("FAIL")
    print("Critical error: Unable to connect to database")
    return False

if __name__ == "__main__":
    success = test_always_fail()
    exit(1)  # Always exit with error code 