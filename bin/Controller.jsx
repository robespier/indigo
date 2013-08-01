#target bridge-2.0

/**
 * Enable Web Access Library
 * Copy/paste form "JavaScript Tools Guide CS3.pdf", page 160
 */
if ( webaccesslib == undefined ) {
	if( Folder.fs == "Windows" ) {
		var pathToLib = Folder.startup.fsName + "/webaccesslib.dll";
	} else {
		var pathToLib = Folder.startup.fsName + "/webaccesslib.bundle";
		// verify that the path is valid
	}
	var libfile = new File( pathToLib );
	var webaccesslib = new ExternalObject("lib:" + pathToLib );
}

/**
 * Get Jobs Array from remote
 */
function getJobs() {
	var http = new HttpConnection("http://indigo.aicdr.pro/") ;
	http.response = new File("/d/work/print_list/jobs.txt") ;
	// Get is the default method
	http.execute() ;
	http.response.close() ;
}

enableWebAccess();
getJobs();
