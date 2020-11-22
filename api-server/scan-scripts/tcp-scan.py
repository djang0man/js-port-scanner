#!/usr/bin/env python3

import sys
import socket 

if __name__ == '__main__':
  address = sys.argv[1]
  port = int(sys.argv[2])
  try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    socket.setdefaulttimeout(1)
    result = s.connect_ex((address, port))
    if result == 0:
      print(f'Port {port} is open')
  except: 
    print(f'Cannot resolve {address}')
    sys.exit()
  finally:
    s.close()
