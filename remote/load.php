<?php

require_once 'include/autoload.php';

$db = new Database();
$db->setup();
$db->connOpen();
/**
 * INSERT
 * 1. Create Job record
 * 2. Get Last Inserted ID
 * 3. Create n Labels records with ID as Forigen Key
 * 4. Check inserted rows
 */
$now = new DateTime();
$dates = date('Y-m-d H:i:s', $now->getTimestamp());
$jobSQL = "INSERT INTO jobs (date_created,date_modified,roll,separations,template)
	VALUES ('$dates', '$dates', 2, 'CMYK', '4090354')";
$db->query($jobSQL);
$link = $db->getLastId();

$labels=array();
$labels[]='Y:\d00\001\spaklevka_08_klei.eps';
$labels[]='Y:\d00\002\spaklevka_1_5_klei.eps';
$labels[]='Y:\d00\003\spaklevka_1_5_klei.eps';
$labels[]='Y:\d00\004\spaklevka_08_klei.eps';
$labels[]='Y:\d00\005\spaklevka_1_5_klei.eps';
$labels[]='Y:\d00\006\spaklevka_08_klei.eps';
$labels[]='Y:\d00\007\spaklevka_1_5_klei.eps';
$labels[]='Y:\d00\008\spaklevka_08_klei.eps';

$labelsSQL = "INSERT INTO labels (date_created,date_modified,path,fk_jobs) VALUES ";

foreach ($labels as $l) {
	$path = "'" . $db->escape($l) . "'";
	$label = "('$dates', '$dates', $path, $link),";
	$labelsSQL .= $label;
}
$query = preg_replace('/,$/', ';', $labelsSQL);
$db->query($query);

$db->connClose();
/**
 * UPDATE
 */

/**
 * DELETE
 */

/**
 * SELECT
 */
?>
