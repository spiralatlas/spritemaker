function download() {
  //download values of all variables that define current character into a json file
  //from https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
  var data = "";
  var filename = "dollmaker_save.json";
  var type = "";

  var current_defining_objects = [];
  for(let i = 0; i < defining_objects.length; i++){
    m = defining_objects[i];

    current_defining_objects.push({name: m.name, value_list:m.value_list,colour1: m.colour1,colour2: m.colour2,patterncolour: m.patterncolour,pattern: m.pattern})
  }

  var load_variables = {
    currently_editing: currently_editing,current_imageType: current_imageType,current_gender: current_gender, current_expression:current_expression,current_clothing:current_clothing,current_accessory: current_accessory,
    size: size,head_ratio_type: head_ratio_type, crop_height: crop_height,current_hairstyle: current_hairstyle, current_eyetype: current_eyetype, isWeirdOutfit: isWeirdOutfit,isWeirdBody: isWeirdBody, 
    current_defining_objects: current_defining_objects, 
  }    
  
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
    
    function setColour(input_string){

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