import re, json, sys
def esc(s): return json.dumps(s, ensure_ascii=False)
def set_field(src, lid, field, value_code):
    # find the object starting at id: "lid"
    i = src.index(f'id: "{lid}"')
    j = src.index('\n  },', i)
    block = src[i:j]
    if field == 'art':
        nb = re.sub(r'art: `[^`]*`', 'art: `' + value_code + '`', block)
    elif field == 'aha':
        nb = re.sub(r'aha: "(?:[^"\\]|\\.)*"', 'aha: ' + esc(value_code), block)
    else:
        pat = rf'{field}: (\[[^\]]*\]|"[^"]*")'
        if re.search(pat, block): nb = re.sub(pat, f'{field}: {value_code}', block, count=1)
        else: nb = block.replace('role:', f'{field}: {value_code}, role:', 1) if field=='title' else re.sub(r'(mechanics: \[[^\]]*\])', r'\1, ' + f'{field}: {value_code}', block, count=1)
    return src[:i] + nb + src[j:]
def remove_field(src, lid, field):
    i = src.index(f'id: "{lid}"'); j = src.index('\n  },', i); block = src[i:j]
    nb = re.sub(rf',? ?{field}: \[[^\]]*\]', '', block)
    return src[:i] + nb + src[j:]
