const container = document.getElementById("jsoneditor");
const saveButton = document.querySelector('#save');
window.jsonFile = null;
let saveChanges = {
};
const editor = new JSONEditor(container, {
	onChangeText: function(data) {
		saveChanges[activeSlot] = data;
	}
});

let activeSlot = "";
const input = document.querySelector('input');
const button = document.querySelector('#button');
input.addEventListener('change', submitform);

function submitform() {
    var file = document.getElementById("myFile").files[0];

    var reader = new FileReader();
    reader.onload = function({target}) {
        const jsonF = JSON.parse(target.result);
		loadSaveFile(jsonF);
    };
    reader.readAsText(file);
    loadedSave = true;
}

const slotTemplate = document.querySelector("#slot");

function loadSaveFile(json) {
	saveButton.disabled =  false;
	saveChanges = {};
	window.jsonFile = json;
	let nodes = [];
	if (json.globals) {
		nodes.push(createGlobalsElement());
	}

	if (json.autoSlot) {
		nodes.push(createSlotElement(-1));
	} 

	const slots = json.slots;
	for (let i = 0; i < slots.length; i++) {
		nodes.push(createSlotElement(i));
	}

	for (const node of nodes) {
		button.appendChild(node);
	}
}

function createGlobalsElement() {
	const slot = slotTemplate.cloneNode();
	slot.setAttribute('slot', 'globals');
	slot.innerText = 'Globals';
	return slot;
}

function createSlotElement(slotIndex) {
	const slot = slotTemplate.cloneNode();
	slot.setAttribute('slot', slotIndex);
	if (slotIndex === -1) {
		slot.innerText = "Auto Save";
	} else if (slotIndex >= 0) {
		slot.innerText = "Save " + (slotIndex + 1);
	}
	return slot;
}

function loadSlot(slot){
	activeSlot = slot;
	let component = null;
	if (isFinite(slot)) {
		if (slot === "-1") {
			component = jsonFile["autoSlot"];
		} else {
			component = jsonFile.slots[slot];
		}
	} else {
		component = jsonFile[slot];
	}

	loadSaveComponent(slot, component);
}

function encode(s) {
    var out = [];
    for (var i = 0; i < s.length; i++) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array(out);
}

function loadSaveComponent(slot, data) {
	if (!saveChanges[slot]) {
		const decrypted = decrypt(data, "a");
		editor.set(JSON.parse(decrypted));
	} else {
		editor.set(JSON.parse(saveChanges[slot]));
	}

}


function compileChanges() {
	const jsonFileCopy = JSON.parse(JSON.stringify(jsonFile));
	for (const saveKey in saveChanges) {
		const savedChange = saveChanges[saveKey];
		const encryptedChange = encrypt(savedChange, "a");
		if (isFinite(saveKey)) {
			if (saveKey === "-1") {
				jsonFileCopy["autoSlot"] = encryptedChange;
			} else {
				const slotNumber = Number(slot);
				jsonFileCopy.slots[slotNumber] =  encryptedChange;
			}
		} else {
			jsonFileCopy[saveKey] = encryptedChange;
		}
	}
	return jsonFileCopy;
}

function exportSave() {
    if (jsonFile) {
        var data = encode(JSON.stringify(compileChanges(), null, 4));
        var blob = new Blob([data], {
            type: 'application/octet-stream'
        });

        url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'cc.save');

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }
}

function decrypt(data, key) {
    if (key = 75 * key + "0") key = ":_." + key;
    var c = window.CryptoJS,
	data = data.substr(9, data.length);
    return c.AES.decrypt(data, key).toString(c.enc.Utf8);
}


function encrypt(data, key) {
    var c;
    if (key = 75 * key + "0") key = ":_." + key;
    c = window.CryptoJS.AES.encrypt(data, key).toString();
    return "[-!_0_!-]" + c;
}