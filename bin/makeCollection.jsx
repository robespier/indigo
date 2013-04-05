#target Illustrator-15

var makeLayout = {

	// ========== Properties: ========== //

	// TODO: Use Folder objects
	// TODO: Потому что на маке разделитель другой
	work_root: 'W:\\', 
	template_path: 'W:\\docs\\template\\',
	jobs_path: 'W:\\docs\\jobcontainer\\',
	output_path: 'W:\\output\\',
	ill: null,			// Illustrator Application object
	template: null,		// Document object
	print_list: null,	// Array
	cutLayerName: 'cut',
	landingPoint: [], 
	landingLayer: null,	// Layer object
	labelStyle: null,	// GraphicStyle object

	error: [],			// Error messages array
	warnings: [],		// Warning messages array
	info: [],			// Info messages array
	strictLayerCount: 3, // Exact number of layers in template
	strictLayerNames: ['mark','cut'], // Order of elements is critical
	strictStyleName: 'dup', // TODO: Name of style to apply; n.b.: 'dup' is a Polish 'ass'
	templateValid: false, // Flag indicates what template is safe to use

	// ========== Functions: ========== //

	/*
	 * Возвращает массив с именами фалов этикеток 
	 * @return array
	 */
	getPrintList: function () {
		// TODO: Stub
		// get aray from real source (plain text, xml, database)
		p = this.getJobName();
		pl = [p+'label_one.eps',p+'label_two.eps',p+'label_three.eps',p+'label_four.eps'];
		return pl;
	},

	/*
	 * Возвращает папку с этикетками 
	 * @return string
	 */
	getJobName: function () {
		// TODO: Stub
		// return real job name;
		fakeName = this.jobs_path + "d1234567\\";
		return fakeName;
	},

	/*
	 * Возварщает имя файла шаблона
	 * @return string
	 */
	getTemplateName: function () {
		// TODO: Stub
		// return real template;
		fakeName = "1064003.ai";
		result = this.template_path + fakeName;
		return result;
	},

	/*
	 * Открыть шаблон и вернуть ссылку на него
	 * @return Document object
	 */
	getTemplateDoc: function() {
		var template_file_name = this.getTemplateName();
		try {
			var template_file = new File (template_file_name);
			var app = this.ill;
			var template = app.open (template_file);
			return template;
		}
		catch (exc) {
			// TODO: catch exception
		}
	},

	/*
	 * Валидация шаблона
	 * @return boolean
	 */
	checkTemplate: function() {
		this.checkLayers();
		this.checkStyles();
		this.templateValid = true;
		return true;
	},

	/*
	 * Проверка слоев в шаблоне на соответствие соглашениям:
	 * должно быть ровно 3 слоя
	 * 1: имя "mark"
	 * 2: имя "cut", TODO: не печатается
	 * 3: произволное имя
	 * @return boolean
	 */
	checkLayers: function() {
		if (this.template.layers.length !== this.strictLayerCount) {
			//TODO: add error[] explanation
			throw "Wrong layers count";
		}
		for (var i=0; i < this.strictLayerNames.length; i++) {
			if (this.strictLayerNames[i] !== this.template.layers[i].name) {
			//TODO: add error[] explanation
			throw "Wrong layers names or layer order";
			}
		}
		// by the way, from this point we absolutely sure about unnamed
		// layer for placing eps'es - its template.layers[2]
		return true;
	},
	
	/*
	 * Проверка стилей в шаблоне на соответствие соглашениям:
	 * TODO: Должен быть стиль с именем например dup 
	 * @return boolean
	 */
	checkStyles: function() {
		sn = '[' + this.strictStyleName + ']';
		return true;
		// TODO:
		try {
			style = this.template.graphicStyles.getByName(sn);
			this.labelStyle = style;
			}
		catch (e) {
			// TODO: always pass
			}
		if (this.labelStyle === null) {
			throw "no style";
			}
		return true;
	},

	/*
	 * Сбросить начало координат на левый нижний угол
	 * @return void
	 */
	resetOrigin: function() {
		this.template.rulerOrigin = [0,0];
	},

	/*
	 * Установить координаты первоначального плейса
	 * @param array position top left [x,y]
	 * @return void
	 */
	setLandingPoint: function(position) {
		// TODO: add check some process logic
		// this test always pass now
		if ((position[0] > 0) && (position[1] > 0)) {
			this.landingPoint = position;
		} else {
			//TODO: add error[] explanation
			throw "target out of artboard";
		}
	},

	/*
	 * Возвращает слой высечки
	 * @return Layer object
	 */

	getCutLayer: function() {
		layers = this.template.layers;
		cut_layer = layers.getByName(this.cutLayerName);
		// TODO: add check on undefined
		return cut_layer;
	},

	/*
	 * Возвращает нижний элемент слоя
	 * @param layer object
	 * @return pathItem object
	 */

	getCutLowerest: function(cutLayer) {
		pathItems = cutLayer.pathItems;
		ic = pathItems.length;
		if (ic > 0) {
			comparsion = pathItems[0];
			for (var i=0; i < ic; i++) {
				originCandidate = pathItems[i];
				// check position properties (in [x,y] form) of pathItem's
				// pathItem.position[0] : left
				// pathItem.position[1] : top 
				if (originCandidate.position[1] < comparsion.position[1]) {
					comparsion = originCandidate;
				}
			}
		} else {
			//TODO: add error[] explanation
			throw "empty cut layer";
		}
		// Here, lowerest pathItem element of cut layer;
		return originCandidate.position;
	},

	/*
	 * Возвращает слой с этикеткой
	 * @see checkLayers
	 * @return Layer object
	 */
	getLandingLayer: function() {
		if (this.templateValid) {
			return this.template.layers[2];
		}
		//TODO: make alternative search landing layer
	},

	/*
	 * Устанавливает стиль для этикетки
	 * (предполагается, что их в шаблоне всего 3
	 * и он последний)
	 * @return void
	 */
	setLabelStyle: function() {
		// TODO: select by style name
		// see checkStyles above for details
		this.labelStyle = this.template.graphicStyles[2];
	},

	/*
	 * Инициализацая переменных
	 * @param object Illustrator Application
	 * @return object this
	 */
	setup: function(app) {
		this.ill = app;
		//открыть файл $шаблона (template.ai);
		this.template = this.getTemplateDoc();
		// optional:
		this.checkTemplate();
		// сбросить 0
		this.resetOrigin();
		//считать из файла массив этикеток $print_list;
		this.print_list = this.getPrintList();
		//получить ссылку на слой cut файла шаблона;
		cutLayer = this.getCutLayer();
		//найти самый нижний элемент слоя cut;
		//сохранить $координаты самого нижнего элемента слоя cut;
		this.setLandingPoint(this.getCutLowerest(cutLayer));
		//получить ссылку на слой $Layer файла шаблона;
		this.landingLayer = this.getLandingLayer();
		//получить ссылку на коллекцию стилей в шаблоне;
		//выбрать $стиль, который будет применяться к этикетке;
		this.setLabelStyle();

		return this;
	},
}

pill = makeLayout.setup(app);
