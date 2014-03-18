
/*
 * GET home page.
 */

exports.data = function(req,res) {
	console.log('Here');
	var parcel = {
			sizeX: 69,
			sizeY: 185,
			diam: false,
			designer: "Сергеев Р.",
			manager: "Исламов Р.",
			name: "Мед цветочный Абрико 500 г",
			customer: "Пищехимпродукт ООО",
			task: "3160068",
			order: "114Ц00370",
			lak_select: false,
			lak_solid: true,
			klei: false,
			tis_hot: false,
			tis: false,
			kongrev: false,
			ink_0: false,
			ink_1: true,
			ink_2: true,
			ink_3: true,
			ink_4: true,
			ink_5: false,
			ink_6: false
		};
	var json = JSON.stringify(parcel);

	res.json( 200, [{ 
		action: 'BlankComposer',
		data: parcel }]
	);
	res.end();
};
