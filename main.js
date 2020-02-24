var container = document.getElementById("jsoneditor");
var editor = new JSONEditor(container, {});
var input = document.querySelector('input');
var loadedSave = false;
var slot;
input.addEventListener('change', submitform);
window.e = editor;
var inputValue;
var jsonF;
document.getElementById("i").onclick = inb;
document.getElementById("o").onclick = outb;

function loadsave(n) {
  if (loadedSave){
    inputValue = jsonF.slots[n-1];
    document.getElementById("what save").innerHTML = "Slot loaded: "+n;
    slot = n;
  }
  else{
    textArea.value = jsonF.slots[n-1];
  }
	inb();
}

function submitform() {
	var file = document.getElementById("myFile").files[0];
	
	var reader = new FileReader();
	reader.onload = function (e) {
		jsonF = JSON.parse(e.target.result);
		inputValue = jsonF.slots[0];
		inb();
		var button;
		var i = 0;
    document.getElementById("o").innerHTML = "save";
    var inputButton = document.getElementById("i");
    var textArea = document.getElementById("input");
    inputButton.parentNode.removeChild(inputButton);
    textArea.parentNode.removeChild(textArea);
		document.getElementById("button").appendChild(document.createElement("br"));
		document.getElementById("button").appendChild(document.createElement("br"));
		for (var save of jsonF.slots){
			i++;
			button = document.createElement("button");
			button.setAttribute("onclick", "loadsave(" + i + ")");
			button.setAttribute("slot", i);
			button.innerHTML = i;
			button.style.display="block";
			document.getElementById("button").appendChild(button);
		}
		var p = document.createElement("p");
		slot = 1;
		p.innerHTML = "Slot loaded: "+1;
		p.setAttribute("id", "what save")
		document.getElementById("button").appendChild(p);
	};
	reader.readAsText(file);
	loadedSave = true;
}
function encode( s ) {
    var out = [];
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
}

function inb() {
    if (loadedSave){
      var s = inputValue;
    }
    else{
      var s = document.getElementById("in").value;
    }
    var j = inc(s, "a");
    window.e.set(JSON.parse(j));
}

function outb() {
    var s = window.e.get();
    var j = outc(JSON.stringify(s), "a");
	  if (loadedSave) {
		  jsonF.slots[slot-1] = j;
		  var data = encode( JSON.stringify(jsonF, null, 4) );
		  var blob = new Blob( [ data ], {
        type: 'application/octet-stream'
		  });
    
		  url = URL.createObjectURL( blob );
		  var link = document.createElement( 'a' );
		  link.setAttribute( 'href', url );
		  link.setAttribute( 'download', 'cc.save' );
    
		  var event = document.createEvent( 'MouseEvents' );
		  event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		  link.dispatchEvent( event );
	  }
    else{
      document.getElementById("in").value = j;
    }
}

function inc(a, b) {
    if (b = 75 * b + "0") b = ":_." + b;
    var c = window.CryptoJS,
        a = a.substr(9, a.length);
    return c.AES.decrypt(a, b).toString(c.enc.Utf8);
}


function outc(a, b) {
    var c;
    if (b = 75 * b + "0") b = ":_." + b;
    c = window.CryptoJS.AES.encrypt(a, b).toString();
    return "[-!_0_!-]" + c;
}
