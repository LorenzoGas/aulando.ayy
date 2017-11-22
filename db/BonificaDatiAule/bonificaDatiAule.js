fs = require('fs')
var output  = fs.createWriteStream('output.csv', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})
fs.readFile('dati.csv', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  var list = data.split('\n');
  list.forEach(function(element) {
      element = element.replace("\r", "")
      element = element.replace("  ", " ")
      var result = [];
      result.push(element);
      result.push(element);

      pulisci(result, element, ["Aula "]);
      pulisci(result, element, ["Aula pc "]);

      pulisci(result, element, [" - Andreatta", "Aula "]);
      pulisci(result, element, [" (SALA CONFERENZE)", "Aula "]);
      pulisci(result, element, [" piano terra", "Aula "]);
      pulisci(result, element, [" primo piano", "Aula "]);
      pulisci(result, element, [" piano terra", "Aula "]);
      pulisci(result, element, [" (spazio polifunzionale)", "Aula "]);
      pulisci(result, element, [" - 1Â° p.", "Aula "]);
      pulisci(result, element, [" - P.T.", "Aula "]);

     /* result.push(pulisci(element, [" - Andreatta", "Aula "]));
      result.push(pulisci(element, [" (SALA CONFERENZE)", "Aula "]));
      result.push(pulisci(element, [" piano terra", "Aula "]));
      result.push(pulisci(element, [" primo piano", "Aula "]));
      result.push(pulisci(element, [" piano terra", "Aula "]));
      result.push(pulisci(element, [" (spazio polifunzionale)", "Aula "]));
      result.push(pulisci(element, [" - 1Â° p.", "Aula "]));
      result.push(pulisci(element, [" - P.T.", "Aula "]));

      result.push(pulisci(element, ["Aula "]));
      result.push(pulisci(element, ["Aula pc "])); */


      var text = "";
      text += result[0]
      for(var i=1; i < result.length; i++){
        text += ", " + result[i]
      }
      text += "\n"
      output.write(text)
  });
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
