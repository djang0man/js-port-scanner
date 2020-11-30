#!/usr/bin/env python3

import sys
from scapy.all import *

if __name__ == '__main__':
  ip = sys.argv[1]
  port = int(sys.argv[2])
  response = sr1(IP(dst = ip)/TCP(dport = port, flags = 'S'), timeout = 1, verbose = 0)
  if response == None:
    pass
  else:
    if response.haslayer(TCP) and response.getlayer(TCP).flags == 'SA':
      print(f'Found Port {port} with SYN')
