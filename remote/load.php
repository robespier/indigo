<?php

require_once 'include/autoload.php';

/**
 * Intercept incoming GET's and POST's
 */
if (isset($_GET['do']) && $_GET['do'] == 'getJobs') {
	$db = getDb();
	$jobs = getJobs($db);
}

if (isset($_POST['resp'])) {
	$postcontent = $_POST['resp'];
	file_put_contents('/tmp/post.txt',$postcontent);
	update($postcontent);
}

/**
 * Get Db
 * @return \Database
 */
function getDb() {
	$db = new Database();
	$db->setup();
	$db->connOpen();
	return $db;
}

/**
 * Fixture
 * @param type $db
 */
function insert($db) {
	return;
	/**
	 * INSERT
	 * 1. Create Job record
	 * 2. Get Last Inserted ID
	 * 3. Create n Labels records with ID as Forigen Key
	 * 4. Check inserted rows
	 */
	$now = new DateTime();
	$dates = date('Y-m-d H:i:s', $now->getTimestamp());
	$jobName = $db->escape('Шпаклевка Клей 0.5, 1.5');
	$jobSQL = "INSERT INTO jobs (date_created,date_modified,name,roll,separations,template)
		VALUES ('$dates', '$dates', '$jobName' , 2, 'CMYK', '4090354')";
	$db->query($jobSQL);
	$link = $db->getLastId();

	$labels = array();
	$labels[] = 'Y:\d9\111\001\spaklevka_08_klei.eps';
	$labels[] = 'Y:\d9\111\002\spaklevka_1_5_klei.eps';
	$labels[] = 'Y:\d9\111\003\spaklevka_1_5_klei.eps';
	$labels[] = 'Y:\d9\111\004\spaklevka_08_klei.eps';
	$labels[] = 'Y:\d9\111\005\spaklevka_1_5_klei.eps';
	$labels[] = 'Y:\d9\111\006\spaklevka_08_klei.eps';
	$labels[] = 'Y:\d9\111\007\spaklevka_1_5_klei.eps';
	$labels[] = 'Y:\d9\111\008\spaklevka_08_klei.eps';

	$labelsSQL = "INSERT INTO labels (date_created,date_modified,name,fk_jobs) VALUES ";

	foreach ($labels as $l) {
		$path = "'" . $db->escape($l) . "'";
		$label = "('$dates', '$dates', $path, $link),";
		$labelsSQL .= $label;
	}
	$query = preg_replace('/,$/', ';', $labelsSQL);
	$db->query($query);

	$db->connClose();
}

/**
 * UPDATE
 */
function update($postcontent) {
	$postXML = new DOMDocument();
	$postXML->encoding = 'UTF-8';
	$postXML->formatOutput = TRUE;

	$postXML->loadXML($postcontent);
	$postXML->save('/tmp/post.xml');

	// Process status messages
	$statusesXPath = new DOMXPath($postXML);
	$statuses = $statusesXPath->query('//status');
	if ($statuses->length > 0) {
		$updateStatusSQL = array(); 
		$now = new DateTime();
		$dates = date('Y-m-d H:i:s', $now->getTimestamp());
		foreach ($statuses as $status) {
			$updateStatusSQL[] = "UPDATE jobs SET status = '$status->nodeValue', date_modified = '$dates' WHERE id = " . $status->getAttribute('jobid') . ";";
		}
	}
	$db = getDb();
	$db->query($updateStatusSQL);
	$db->connClose();
}
/**
 * DELETE
 */

/**
 * SELECT
 * 1. Select all jobs where status = 'go' and deleted = 0;
 * 2. Return XML
 * 3. Есть более простой способ, как в Microsoft SQL Server? Похоже, нет.
 *    http://stackoverflow.com/questions/7623308/does-mysql-have-xml-support-like-sql-server
 */
function getJobs($db) {
	$jobsSQL = "SELECT * FROM jobs WHERE status='go' AND deleted = 0;";
	$jobs = $db->query($jobsSQL);
	/**
	 * Create XML Response 
	 */
	$result = new DOMDocument();
	$result->encoding = 'UTF-8';
	$result->formatOutput = TRUE;
	$result->appendChild(new DOMElement('joblist'));
	if (count($jobs) > 0) {
		$updateStatus = array();
		foreach ($jobs as $job) {
			$jobid = $job['id'];
			$updateStatus[] = $jobid;
			$jobNode = $result->createElement('job');
			$jobNode->setAttribute('job_id', $jobid);
			$jobNode->appendChild(new DOMElement('hotfolder',$job['separations']));
			$jobNode->appendChild(new DOMElement('rollnumber',$job['roll']));
			$jobNode->appendChild(new DOMElement('template',$job['template']));
			$print_list = $jobNode->appendChild(new DOMElement('printlist'));
			/**
			 * Fetch print-list's
			 */
			$labelsSQL = "SELECT * FROM labels WHERE fk_jobs = $jobid AND deleted = 0;";
			$print_list_files = $db->query($labelsSQL);
			foreach ($print_list_files as $plf) {
				$print_list->appendChild(new DOMElement('label',$plf['name']));
			}
			/**
			 * Get job sequence
			 */
			$sequenceSQL = "SELECT sequence FROM job_sequences WHERE id = " . $job['fk_sequence'] . ";";
			$sequence = $db->query($sequenceSQL);
			// Only one row expected:
			$jobNode->appendChild(new DOMElement('sequence',$sequence[0]['sequence']));
			/**
			 * Finish jobNode
			 */
			$result->documentElement->appendChild($jobNode);
		}
		$updateStatusSQL = "UPDATE jobs SET status = 'processing' WHERE id in (" . implode(',', $updateStatus) . ");";
		$db->query($updateStatusSQL);
	}
	//$result->save('/tmp/job.xml');
	header("Content-Type: text/xml; charset=UTF-8");
	echo $result->saveXML(); 
	$db->connClose();
}

//update('none');
// Enaf!  $db = getDb(); insert($db);
//getJobs(getDb());
?>
