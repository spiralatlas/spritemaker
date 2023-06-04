function download() {
  //download values of all variables that define current character into a json file
  //from https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
  var data = "";
  var filename = "dollmaker_save.json";
  var type = "";

  var current_defining_objects = [];
  for(let i = 0; i < defining_objects.length; i++){
    m = defining_objects[i];
    temp_obj = {};
    transferObjectValues(temp_obj, defining_objects[i],defining_objects_defining_keys_list )
    current_defining_objects.push(temp_obj);
  }

  var load_variables = {current_defining_objects: current_defining_objects};
  transferObjectValues(load_variables, ui_variables_object,Object.keys(ui_variables_object) )
  transferObjectValues(load_variables, defining_variables_object,Object.keys(defining_variables_object) )
  
  data = JSON.stringify(load_variables);
  var file = new Blob([data], {type: type});
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
      var load_object = JSON.parse(txt);
      data_object = load_object;
      setVariables(load_object);
      Alpine.store('alpineData').fixAlpine();

    }   