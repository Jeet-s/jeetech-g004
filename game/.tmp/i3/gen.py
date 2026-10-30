# mutate base: try single-cell flips on lower rows, report search for unique ones
import subprocess,sys,itertools
base=open(sys.argv[1]).read().split()
rows=[int(x) for x in sys.argv[2].split(',')]
cands=[]
for r in rows:
  for c in range(len(base[0])):
    for ch in '.ab':
      if base[r][c]==ch: continue
      g=[list(x) for x in base]; g[r][c]=ch
      cands.append(((r,c,ch),'\n'.join(''.join(x) for x in g)))
inp='\n\n'.join(a for _,a in cands)
out=subprocess.run(['npx','tsx','scripts/try-art.ts','2'],input=inp,capture_output=True,text=True).stdout
res=[l for l in out.split('\n') if l and l[0].isdigit()]
sc=[]
for (k,_),l in zip(cands,res):
  if ' OK ' in l: sc.append((float(l.split('search ')[1].split()[0]),k,l))
sc.sort(reverse=True)
for s in sc[:15]: print(s)
