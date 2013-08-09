headers = {
//	job : '[({roll_number:"2", hot_folder:"CMYK", template:"4090354", dbid:"1", print_list:["Y:\\d9\\111\\001\\spaklevka_08_klei.eps", "Y:\\d9\\111\\002\\spaklevka_1_5_klei.eps"], sequence:"assembly;matching;achtung", errors:[]}), ({roll_number:"2", hot_folder:"CMYK", template:"brokenTemplate", dbid:"2", print_list:["Y:\\d9\\111\\001\\spaklevka_08_klei.eps", "Y:\\d9\\111\\002\\spaklevka_1_5_klei.eps"], sequence:"assembly;matching;achtung", errors:[]}), ({roll_number:"2", hot_folder:"CMYK", template:"missingTemplate", dbid:"3", print_list:["Y:\\d9\\111\\001\\spaklevka_08_klei.eps", "Y:\\d9\\111\\002\\spaklevka_1_5_klei.eps"], sequence:"assembly;matching;achtung", errors:[]}), ({roll_number:"2", hot_folder:"CMYK", template:"4090354", dbid:"4", print_list:["Y:\\d9\\111\\001\\oops.eps"], sequence:"assembly;matching;achtung", errors:[]})]',
	job : '[({roll_number:"2", hot_folder:"CMYK", template:"4090354", dbid:"4", print_list:["Y:\\d9\\111\\001\\oops.eps"], sequence:"assembly;matching;achtung", errors:[]})]',
}

message = {
	headers: headers,
	body: "EMPTY",
	sender: "bridge-2.0",
	target: "illustrator-13.0-ru_ru",
	timeout: "600",
	type: "ExtendScript",
}

AsyncTest = {
	done: false,
	message: message,
	loadMessage : function() {
		// Reconstruct BridgeTalkMessage
		return;
	},
}

#include Dispatch.jsx
