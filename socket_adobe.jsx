reply = "";
conn = new Socket();
conn.timeout = 1;
if (conn.open ("indigo.aicdr.pro:8080")) {
	reply = conn.read();
	conn.close();
}