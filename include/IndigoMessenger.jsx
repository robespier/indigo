///#target bridge

/**
 * Статический объект Indigo.Messenger. Пуляет json-ами через Soket.
 *
 * Переопределить его - будет писать в файл, смски 
 * слать на телефон или ещё чего экзотичного
 */
Indigo.Messenger = {

	socket : null,
	remote: 'indigo.aicdr.pro:8080',

	/**
	 * Создание сокета.
	 *
	 * @protected
	 * @return {Socket} conn
	 */
	setupSocket : function() {
		var socket = new Socket();
		socket.timeout = 1;
		socket.encoding = "UTF-8";
		this.socket = socket;
		return socket;
	},

	/**
	 * Закрытие сокета.
	 *
	 * @return {void}
	 */
	closeSocket : function() {
		if ((this.socket !== null) && this.socket.connected) {
			this.socket.close();
		}
	},

	/**
	 * Получение ссылки на сокет
	 * Это, типа, синглтон.
	 *
	 * @protected
	 * @return {Socket} socket
	 */
	getSocket : function() {
		if (this.socket === null)  {
			this.setupSocket();
		}
		if (this.socket.connected) {
			return this.socket;
		} else {
			try {
				this.socket.open(this.remote);
				return this.socket;
			} catch (e) {
				$.writeln('Socket cannot be opened. Reason :' + e.message);
				throw {
					message: this.remote + ': [eq Dfv!', 
					severity: 'fatal',
				};
			}
		}
	},

	/**
	 * Отправка уведомления о событии, получение ответа
	 *
	 * @param {object} message Объект
	 * @return {object} r
	 */
	emit : function(message) {
		var s = this.getSocket();
		//todo: Фи! Не хардкодить датаброкера!!!
		var broker = new Indigo.JsonBroker();
		var parcel = broker.encode(message);
		s.write(parcel);
		var r = broker.decode(s.read());
		return r;
	},

	/**
	 * Создание тестового объекта
	 *
	 * @return {object} Тестовый объект
	 */
	getTestObject : function() {
		var parcel = {
			ink: 36,
			roll: 2,
			template: "133400",
			print_list : ["One","Tw;?o","Два с половиной"]
		};
		return parcel;
	},

	/**
	 * Тест
	 */
	testConn : function() {
		var conn = this.getSocket();
		var parcel = this.getTestObject();
		var jb = new Indigo.JsonBroker();
		var jinson = jb.encode(parcel);
		conn.write(jinson);
		var jsonReply = jb.decode(this.conn.read());
		conn.close();
	}
};
