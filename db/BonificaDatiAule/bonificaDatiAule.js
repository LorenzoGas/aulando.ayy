fs = require('fs')
var output  = fs.createWriteStream('dati.json', {
  //flags: 'a' // 'a' means appending (old data will be preserved)
})
fs.readFile('dati.csv', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  var list = data.split('\n');

  var result = [
    {
      entries: [],
      name: "Aula"
    }
  ];

  list.forEach(function(element) {
      element = element.replace("\r", "")
      element = element.replace("  ", " ")
      element = element.replace('"', '')
      element = element.replace('"', '')
      var synonyms = [];     

      synonyms.push(element);

      pulisci(synonyms, element, ["Aula "]);
      pulisci(synonyms, element, ["Aula pc "]);

      pulisci(synonyms, element, [" - Andreatta", "Aula "]);
      pulisci(synonyms, element, [" (SALA CONFERENZE)", "Aula "]);
      pulisci(synonyms, element, [" piano terra", "Aula "]);
      pulisci(synonyms, element, [" primo piano", "Aula "]);
      pulisci(synonyms, element, [" piano terra", "Aula "]);
      pulisci(synonyms, element, [" (spazio polifunzionale)", "Aula "]);
      pulisci(synonyms, element, [" - 1Â° p.", "Aula "]);
      pulisci(synonyms, element, [" - P.T.", "Aula "]);

      var entries = 
            {
              "synonyms": synonyms,
              "value": synonyms[0]
            }

      if(entries.value != "")
        result[0].entries.push(entries)
  });

  output.write(JSON.stringify(result))
});


function pulisci(list, valore, sporco){
    var result = valore;
    sporco.forEach(function(macchia) {
      result = result.replace(macchia, "");
    });  
    
    if(!search(list, result)){
      list.push(result)
    }
}

function search(list, valore){
  var result = false;
  if(list == null)
    return result;
  list.forEach(function(a){
    if(a.toString() == valore.toString()){
      result = true;
    }
  })
  return result;
}
