import re, sys, json
def replace(path, oid, new):
    s = open(path).read()
    i = s.index(f'id: "{oid}"')
    a = s.rindex("\n  {\n", 0, i) + 1
    b = s.index("\n  },\n", i) + len("\n  },\n")
    s = s[:a] + new.rstrip("\n") + "\n" + s[b:]
    open(path, "w").write(s)
def obj(oid, title, palette, role, mech, aha, art, smudge=None, crack=None):
    extra = ""
    if smudge: extra += f" smudge: {json.dumps(smudge)},"
    if crack: extra += f" crack: {json.dumps(crack)},"
    return (f'  {{\n    id: "{oid}", title: {json.dumps(title)}, palette: {palette}, role: "{role}", mechanics: {json.dumps(mech)},{extra}\n'
            f'    aha: {json.dumps(aha)},\n    art: `\n{art.strip()}`,\n  }},\n')
