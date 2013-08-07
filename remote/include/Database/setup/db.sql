-- MySQL dump 10.13  Distrib 5.5.32, for debian-linux-gnu (i686)
--
-- Host: localhost    Database: indigo
-- ------------------------------------------------------
-- Server version	5.5.32-0ubuntu0.12.04.1-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `indigo`
--

/*!40000 DROP DATABASE IF EXISTS `indigo`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `indigo` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `indigo`;

--
-- Table structure for table `job_sequences`
--

DROP TABLE IF EXISTS `job_sequences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_sequences` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `deleted` bit(1) DEFAULT b'0',
  `name` varchar(512) DEFAULT NULL,
  `sequence` varchar(512) DEFAULT 'assembly;matching;achtung',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_sequences`
--

LOCK TABLES `job_sequences` WRITE;
/*!40000 ALTER TABLE `job_sequences` DISABLE KEYS */;
INSERT INTO `job_sequences` VALUES (1,'2013-08-07 14:59:08','2013-08-07 14:59:08','\0','ordinary','assembly;matching;achtung');
/*!40000 ALTER TABLE `job_sequences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `deleted` bit(1) DEFAULT b'0',
  `name` varchar(512) DEFAULT NULL,
  `roll` int(11) DEFAULT NULL,
  `separations` varchar(5) DEFAULT NULL,
  `template` varchar(50) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'new',
  `fk_sequence` bigint(20) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_sequences_idx` (`fk_sequence`),
  CONSTRAINT `fk_sequences` FOREIGN KEY (`fk_sequence`) REFERENCES `job_sequences` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Тест: порядок',2,'CMYK','4090354','go',1),(2,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Тест: херовый шаблон',2,'CMYK','brokenTemplate','go',1),(3,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Тест: нет шаблона',2,'CMYK','missingTemplate','go',1),(4,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Тест: нет этикетки',2,'CMYK','4090354','go',1);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labels`
--

DROP TABLE IF EXISTS `labels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `labels` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `deleted` bit(1) DEFAULT b'0',
  `name` varchar(512) DEFAULT NULL,
  `fk_jobs` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_labels_jobs_idx` (`fk_jobs`),
  CONSTRAINT `fk_labels_jobs` FOREIGN KEY (`fk_jobs`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labels`
--

LOCK TABLES `labels` WRITE;
/*!40000 ALTER TABLE `labels` DISABLE KEYS */;
INSERT INTO `labels` VALUES (1,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Y:\\d9\\111\\001\\spaklevka_08_klei.eps',1),(2,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Y:\\d9\\111\\002\\spaklevka_1_5_klei.eps',1),(3,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Y:\\d9\\111\\001\\spaklevka_08_klei.eps',2),(4,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Y:\\d9\\111\\002\\spaklevka_1_5_klei.eps',2),(5,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Y:\\d9\\111\\001\\spaklevka_08_klei.eps',3),(6,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Y:\\d9\\111\\002\\spaklevka_1_5_klei.eps',3),(7,'2013-08-06 14:08:57','2013-08-06 14:08:57','\0','Y:\\d9\\111\\001\\oops.eps',4);
/*!40000 ALTER TABLE `labels` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-08-07 16:01:53
