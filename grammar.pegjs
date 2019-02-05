body = EOL* title:line_of_text desc:mlines rest:item+ {
  return {
     type: "body",
     title: title,
     summary: desc,
     entries: rest
  
  }
}

global_summary "Summary" = mlines

item = item_full / item_name

item_full = LIST_MARKER name:name description:loc_description {
  return {
    type: "entry",
    name: name,
    description: description
  };
} 

item_name = LIST_MARKER name:name? {
  return {
    type: "entry",
    name: name
  };
}


name "Name, Address or Point-of-interest" = line_of_text

loc_description "Location description" =  mlines / line_of_text


mlines "paragraph" = EOL* ls:line_of_text* {
  var z = ls.map(l => l.value);
  return {
    type: "p",
    value: z
  }
}

line_of_text "line" = ws:word* EOL+ {
   return {
     type: "line",
     value: ws.join('') 
   }
}

words = ws:word* {
  var s = ws.join(" ");
  return ws;
}
word = c:[a-zA-Z\u1D400-\u1D419,!@#\$%\^&\*\(\)\+\.\/\? ]  {
return c;
}

LIST_MARKER "List marker character --" = EOL* "--" EOL+

EOL "a new line" = "\r\n" / "\r" / "\n" {
return "lb";
}

ws = [ \t]

_ = ws*