$(document).ready(function () {
    // variable
    var lvl = 1;

	// Missile Command
    missileCommand.initialize();
    missileCommand.setupListeners();

	// CodeMirror
    var editor = new Editor();
    editor.loadCode(lvl);

	// CodeMirror: addon Panel
	editor.addPanel("top");
	editor.addPanel("bottom");

	// CodeMirror: addon Autocomplete
	if (typeof Promise !== undefined) {
	  var comp = [
		["here", "hither"],
		["asynchronous", "nonsynchronous"],
		["completion", "achievement", "conclusion", "culmination", "expirations"],
		["hinting", "advive", "broach", "imply"],
		["function","action"],
		["provide", "add", "bring", "give"],
		["synonyms", "equivalents"],
		["words", "token"],
		["each", "every"],
	  ]

	  function synonyms(cm, option) {
		return new Promise(function(accept) {
		  setTimeout(function() {
			var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
			var start = cursor.ch, end = cursor.ch
			while (start && /\w/.test(line.charAt(start - 1))) --start
			while (end < line.length && /\w/.test(line.charAt(end))) ++end
			var word = line.slice(start, end).toLowerCase()
			for (var i = 0; i < comp.length; i++) if (comp[i].indexOf(word) != -1)
			  return accept({list: comp[i],
							 from: CodeMirror.Pos(cursor.line, start),
							 to: CodeMirror.Pos(cursor.line, end)})
			return accept(null)
		  }, 100)
		})
	  }
	}


    missileCommand.initialize();
    missileCommand.setupListeners();

    function execCode () {
        // leggi il codice dall'editor e sostituiscilo all'interno di missile command
        var line = editor.getCode();
        // eseguo la funzione
        line.foreach(function(element, index, array) {
            console.log(element);
            eval("with(missileCommand.this){" + element + "}");
        });

        // esegui la goal function per vedere se il livello puo' ritenersi superato
        ed.goalFunction(); // restituira un valore boleano che indica il superamento del livello
    }

    function resetCode () {
        editor.loadCode(lvl);
    }

    $("#ButtonExecCode").click(execCode);
    $("#ButtonResetCode").click(resetCode);

});
