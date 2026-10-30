# usage: smtry.py K artfile -> emits blocks for each row r (from list) x col c, stamping crossing
import sys
K=sys.argv[1]; art=open(sys.argv[2]).read().split("\n"); art=[l for l in art if l.strip()]
rs=[int(x) for x in sys.argv[3].split(",")]; cs=[int(x) for x in sys.argv[4].split(",")]
for r in rs:
  for c in cs:
    g=[list(l) for l in art]
    ch=g[r][c]
    g[r][c]= ',' if ch=='.' else ch.upper()
    print(f"{K} r{r},c{c}"); print("\n".join("".join(l) for l in g)); print()
