function human_readable_object(obj){
    let output = ""
    for (let i = 0; i < Object.keys(obj).length; i += 1){
        output+="//"+Object.keys(obj)[i]+": "+obj[Object.keys(obj)[i]]+"\n";
    }
    return output
}

function human_readable_list(obj_list){
    let output = ""
    for (let i = 0; i < obj_list.length; i += 1){
        output+=human_readable_object(obj_list[i]);
    }
    return output
}

function human_readable(vars){
    //vars is an object containing lists of objects
    //output is a comment string describing the content of vars
    output = "// *** HUMAN READABLE SUMMARY ***\n"
    for (i = 0; i < Object.keys(vars).length; i += 1){
        obj_name = Object.keys(vars)[i];
        switch(obj_name){
            case "current_defining_objects":
                output+="//Body and Outfit:\n";
                output+=human_readable_list(vars["current_defining_objects"])
                break;
            case "ui_variables_object":
                output+="//User interface:\n";
                output+=human_readable_object(vars["ui_variables_object"])
                break; 
            case "defining_variables_object":
                output+="//Other:\n";
                output+=human_readable_object(vars["defining_variables_object"])
                break;           
        }
        output+="\n"
    }
    output+="// *** END SUMMARY ***\n"
    return output
}

function download() {
  //download values of all variables that define current character into a json file
  //from https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
  var data = "";
  var filename = "dollmaker_save.json";
  var type = "";

  var load_variables = {current_defining_objects: createDefininglistSubset(defining_objects), ui_variables_object: ui_variables_object, defining_variables_object: defining_variables_object};
    
  data = JSON5.stringify(load_variables);
  comment_data = human_readable(load_variables);
  var file = new Blob([comment_data+data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}

//https://stackoverflow.com/questions/13709482/how-to-read-text-file-in-javascript

var reader; //GLOBAL File Reader object

    /**
     * Check for the various File API support.
     */
    function checkFileAPI() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            reader = new FileReader();
            return true; 
        } else {
            alert('The File APIs are not fully supported by your browser. Fallback required.');
            return false;
        }
    }

    /**
     * read text input
     */
    function readText(filePath,data_object) {
        var output = ""; //placeholder for text output
        reader.onload = function (e) {
            output = e.target.result;
            loadContents(output,data_object);
          };//end onload()
        reader.readAsText(filePath);
        return true;
    }  

    /**
     * load user selected file
     */
    function loadContents(txt,data_object) {
      var load_object = JSON5.parse(txt);
      data_object = load_object;
      setVariables(load_object);
      Alpine.store('alpineData').fixAlpine();

    }   