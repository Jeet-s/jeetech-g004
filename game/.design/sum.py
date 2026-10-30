import re,sys
rows=[]
for l in open(sys.argv[1]):
    m=re.match(r'L\s*(\d+)\s+(\S+)\s+\S+\s+(\S+)\s+k=\s*(\d+) casual ([\d.]+) \(target ([\d.]+)\) skilled ([\d.]+)',l)
    if m: rows.append(m.groups())
lo,hi=int(sys.argv[2]),int(sys.argv[3])
for r in rows:
    if lo<=int(r[0])<=hi: print(f"L{r[0]:>3} {r[1][:18]:18} {r[2]:9} k={r[3]:>4} c={r[4]} t={r[5]} s={r[6]}")
late=[float(r[4]) for r in rows[-40:]]; print("late mean",sum(late)/40)
