#!/usr/bin/env python3
import socket

host = "localhost"
port = 5000

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    result = s.connect_ex((host, port))
    if result == 0:
        print("PASS")
        print(f"Port {port} is open and backend is reachable")
        exit(0)
    else:
        print("FAIL")
        print(f"Port {port} is not reachable")
        exit(1)
