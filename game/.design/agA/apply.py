import json, re
S = json.load(open('.design/agA/specs.json'))
for isl, specs in S.items():
    path = f'src/game/islands/{isl}.ts'
    lines = open(path).read().split('\n')
    for sid, s in specs.items():
        start = next(i for i, l in enumerate(lines) if f'id: "{sid}"' in l)
        if isl == 'isl03':
            assert lines[start].lstrip().startswith('{id:')
            obj_start = start
        else:
            obj_start = start - 1
            assert lines[obj_start].strip() == '{', (sid, lines[obj_start])
        end = next(i for i in range(start, len(lines)) if lines[i] == '  },')
        art = '\n'.join(s['art'])
        w = {len(r) for r in s['art']}; assert len(w) == 1, sid
        aha = json.dumps(s['aha'], ensure_ascii=False)
        mech = ', '.join(json.dumps(m) for m in s['mechanics'])
        if isl == 'isl03':
            pal = ', '.join(json.dumps(p) for p in s['palette'])
            new = [f'  {{id: "{sid}", title: {json.dumps(s["title"])}, palette: [{pal}], role: "{s["role"]}", mechanics: [{mech}], aha: {aha}, art: `'] + s['art'][:-1] + [s['art'][-1] + '`,', '  },']
        else:
            new = ['  {', f'    id: "{sid}", title: {json.dumps(s["title"])}, palette: [INK], role: "{s["role"]}", mechanics: [{mech}],', f'    aha: {aha},', '    art: `'] + s['art'][:-1] + [s['art'][-1] + '`,', '  },']
        lines[obj_start:end + 1] = new
    open(path, 'w').write('\n'.join(lines))
print('applied')
