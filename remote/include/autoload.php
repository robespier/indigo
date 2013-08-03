<?php

define('APP_ROOT', '/home/domelaz/gits/indigo/remote/');

/*
 * Автозагрузка классов;
 * 
 * Классы ищутся в следующих директориях в таком порядке:
 * 1. include/ClassName.php
 * 2. include/CalssName/ClassName.php
 * 3. include/ЛюбаяПапка/ClassName.php
 * 
 * При первом совпадении происходит возврат;
 * 
 * @package LogAgg
 */

if (!function_exists('logagg_autoload')) {

    function logagg_autoload($class) {
		chdir(APP_ROOT);
        $classFile = 'include/' . $class . '.php';
        if (file_exists($classFile)) {
            require_once $classFile;
        } else {
            $classFile = 'include/' . $class . '/' . $class . '.php';
            if (file_exists($classFile)) {
                require_once $classFile;
            } else {
                $fulldirs = scandir('include');
                $exclude = array('.','..');
                $dirs = array_diff($fulldirs, $exclude);
                foreach ($dirs as $dir) {
                    $classFile = 'include/' . $dir . '/' . $class . '.php';
                    if (file_exists($classFile)) {
                        require_once $classFile;
                        break;
                    }
                }
            }
        }
    }

    spl_autoload_register('logagg_autoload');
}
?>
