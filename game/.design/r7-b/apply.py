import re, sys, json
# replace the whole object literal whose id matches, in the given island file
def rep(path, id_, body):
    s = open(path).read()
    i = s.index('id: "%s"' % id_)
    start = s.rindex('  {', 0, i)
    end = s.index('`,\n  },', i) + len('`,\n  },')
    s = s[:start] + body.rstrip() + s[end:]
    open(path, 'w').write(s)
specs = json.load(open(sys.argv[1]))
for p, id_, body in specs:
    rep(p, id_, body)
    print("ok", id_)
