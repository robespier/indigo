reply = "";
conn = new Socket();
conn.timeout = 1;
conn.encoding = "UTF-8";

var parcel = {
	ink: 36,
	roll: 2,
	template: "133400",
	print_list : ["One","Tw;?o","Два с половиной"]
};

if (conn.open ("indigo.aicdr.pro:8080")) {
	var jinson = parcel.toSource();
	jinson = '{"ink":36, "roll":2, "template":"133400", "print_list":["One", "Tw;?o", "\u0414\u0432\u0430 \u0441 \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u043E\u0439"]}';
	conn.writeln(jinson);
	reply = conn.read();
	conn.close();
}
