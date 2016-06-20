var container = document.getElementById("jsoneditor");
var editor = new JSONEditor(container, {});
window.e = editor;

document.getElementById("i").onclick = inb;
document.getElementById("o").onclick = outb;

function inb() {
    var s = document.getElementById("in").value;
    var j = inc(s, "a");
    window.e.set(JSON.parse(j));
}

function outb() {
    var s = window.e.get();
    var j = outc(JSON.stringify(s), "a");
    document.getElementById("in").value = j;
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
