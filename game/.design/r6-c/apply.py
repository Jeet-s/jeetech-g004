import re,sys
def rep(path, id_, new_block):
    s=open(path).read()
    i=s.index('{id: "%s"'%id_) if ('{id: "%s"'%id_) in s else s.index('id: "%s"'%id_)
    # find start of object: last '{' before i
    st=s.rfind('{',0,i+1) if s[i]!='{' else i
    # find end: matching "`,\n  }," after
    en=s.index('},',s.index('`,',s.index('art: `',i)+6))+2
    s=s[:st]+new_block+s[en:]
    open(path,'w').write(s)
