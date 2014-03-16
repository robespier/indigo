db_name = 'db_emulation';
tempFolder = new Folder('D:\\work\\temp');
tempFile = new File(tempFolder + '\\' + db_name + '.txt');
tempFile.open('r');
data = tempFile.read();
dataInput = eval(data);
tempFile.close;

