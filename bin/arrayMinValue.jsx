var aa_ar = [];

aa_ar[0] = 3.5;
aa_ar[1] = 1;
aa_ar[3] = -5.65;
aa_ar[4] = 0;

// Make copy of original array before sort
aa_bb = aa_ar.slice();

// Find minimum sum
aa_ar.sort();
min_sum = aa_ar[0];

// Find corresponding index
var res_index;
for (i=0; i<aa_ar.length;i++) {
	if (aa_bb[i] == min_sum) {
		res_index=i;
		}
	}

