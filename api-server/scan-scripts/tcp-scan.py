#!/usr/bin/env python3

import sys
import socket 

if __name__ == '__main__':
  ip = sys.argv[1]
  port = int(sys.argv[2])
  try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    socket.setdefaulttimeout(1)
    result = s.connect_ex((ip, port))
    if result == 0:
      print(f'Found Port {port} with TCP')
  except: 
    print(f'Cannot resolve {ip}')
    sys.exit()
  finally:
    s.close()
