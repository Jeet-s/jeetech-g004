import re,sys
p="src/game/islands/isl02.ts"
s=open(p).read()
def block(id_):
    i=s.index(f'id: "{id_}"'); a=s.rindex("  {\n",0,i); b=s.index("\n  },\n",i)+len("\n  },\n"); return a,b
def setblock(id_, text):
    global s
    a,b=block(id_); s=s[:a]+text+s[b:]
def setaha(id_, aha):
    global s
    a,b=block(id_); blk=s[a:b]
    blk=re.sub(r'aha: ".*?",\n', lambda m: 'aha: '+__import__("json").dumps(aha)+',\n', blk, count=1, flags=re.S)
    s=s[:a]+blk+s[b:]
exec(open(sys.argv[1]).read())
open(p,"w").write(s)
