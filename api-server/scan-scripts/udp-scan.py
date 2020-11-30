#!/usr/bin/env python3

import sys
from scapy.all import *

if __name__ == '__main__':
  ip = sys.argv[1]
  port = int(sys.argv[2])
  response = sr1(IP(dst = ip)/UDP(dport = port), timeout = 4, verbose = 0)
  time.sleep(1)
  if response == None:
    print(f'Found {port} Open / filtered with UDP')
  else:
    if response.haslayer(ICMP):
      print(f'{port} Closed')
    elif response.haslayer(UDP):
      print(f'Found {port} Open / filtered with UDP')
    else:
      print(f'{port} Unknown')
      print(response.summary())
