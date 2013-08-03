<?php

/**
 * Description of Database
 *
 * @author domelaz
 */
class Database {

	public $mysqli;
	
	protected $dbHost, $dbUser, $dbPass;
	public $dbName;
	
	function setup() {
		$this->dbHost = 'localhost';
		$this->dbName = 'indigo';
		$this->dbUser = 'root';
		$this->dbPass = 'xxx';
		// TODO: check connection
		return TRUE; 
	}
	
	function connOpen() {
		$this->mysqli = new mysqli($this->dbHost, $this->dbUser, $this->dbPass, $this->dbName);
		$this->mysqli->set_charset('utf8');
		return $this->mysqli;
	}

	function connClose() {
		return $this->mysqli->close();
	}

	/**
	 * Quote value like column name
	 * @param string $var
	 * @return string
	 */
	function quoteVar($var) {
		return "`" . $this->mysqli->escape_string($var) . "`";
	}
	
	function escape($var) {
		return $this->mysqli->escape_string($var);
	}

	
	/**
	 * Query Database
	 * 
	 * @param string/array $sql
	 * @return mysqli_result
	 * @throws mysqli_sql_exception
	 */
	function query($sql) {
		if (is_array($sql)) {
			$query = implode(' ', $sql);
			$method = 'multi_query';
		} else {
			$query = $sql;
			$method = 'query';
		}
		// when fail, mysqli DO NOT THROW exceptions, just returns FALSE
		// so, we throw it here
		// http://www.php.net/manual/ru/mysqli.query.php
		if (!$result = $this->mysqli->$method($query)) {
			// Нет в mysqli_sql_exception способов установить причину ошибки.
			// Догадывайтесь, суки, сами, что произошло.
			// TODO: Database Exception Class
			$e = $this->mysqli->error;
			throw new mysqli_sql_exception();
		}
		/*
		 * В случае успешного выполнения запросов SELECT, SHOW, DESCRIBE 
		 * или EXPLAIN mysqli_query() вернет объект mysqli_result.
		 * Для остальных успешных запросов mysqli_query() вернет TRUE. 
		 */
		if ($result instanceof mysqli_result) {
			$rows = array();
			while ($row = $result->fetch_assoc()) {
				$rows[] = $row;
			}
			return $rows;
		} else {
			return $result;
		}
	}
	
	function getLastId() {
		return $this->mysqli->insert_id;
	}
}

?>
