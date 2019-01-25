body = header:paragraph EOL+ rest:item+ {
  return {
     type: "body",
     header: header,
     rest: rest
  
  }
}

item = item_full / item_name_addr / item_name

item_full = LIST_MARKER EOL+ name:paragraph EOL address:paragraph EOL description:paragraph EOL+ {
  return {
    type: "entry",
    name: name,
    address: address,
    description: description
  };
} 

item_name = LIST_MARKER EOL+ name:paragraph EOL {
  return {
    type: "entry",
    name: name
  };
}

item_name_addr = LIST_MARKER EOL name:paragraph EOL+ address:paragraph EOL+ {
  return {
    type: "entry",
    name: name,
    address: address
  };
}

paragraph "paragraph" = _ p:word+ _ {
  return { 
     type: "paragraph",
     value: p.join("")
  };
}

word = [a-zA-Z\u1D400-\u1D419 ]

LIST_MARKER "List marker character --" = "--"

EOL "END_OF_LINE" = "\r\n" / "\r" / "\n" {
return "<lb>";
}

ws = [ \t]

_ = ws*