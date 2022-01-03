-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: ינואר 03, 2022 בזמן 07:05 AM
-- גרסת שרת: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodems`
--

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(13) NOT NULL DEFAULT '',
  `password` varchar(128) NOT NULL DEFAULT '',
  `pin` varchar(10) NOT NULL DEFAULT '',
  `pic` varchar(26) NOT NULL DEFAULT '',
  `loggedin` tinyint(4) UNSIGNED NOT NULL DEFAULT '0',
  `lastlogin` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `createdat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `birthday` date DEFAULT NULL,
  `banned` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `banreason` text,
  `gm` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `macs` tinytext,
  `characterslots` tinyint(2) UNSIGNED NOT NULL DEFAULT '5',
  `gender` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `tempban` timestamp NULL DEFAULT NULL,
  `greason` tinyint(4) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`banned`,`gm`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

--
-- הוצאת מידע עבור טבלה `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `pin`, `pic`, `loggedin`, `lastlogin`, `createdat`, `birthday`, `banned`, `banreason`, `gm`, `macs`, `characterslots`, `gender`, `tempban`, `greason`) VALUES
(15, 'admin', '$2b$10$6Fr30nxQkL74MT4v3OkJLeEOFk7myACpxACpj843J9jhgE4/p0EIe', '', '', 0, '2021-09-27 22:42:32', '2021-09-27 22:42:32', NULL, 0, NULL, 0, NULL, 5, 0, NULL, 0);

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `characters`
--

DROP TABLE IF EXISTS `characters`;
CREATE TABLE IF NOT EXISTS `characters` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `accountid` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `world` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `name` varchar(13) NOT NULL DEFAULT '',
  `level` int(11) UNSIGNED NOT NULL DEFAULT '1',
  `exp` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `gachaexp` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `str` int(11) UNSIGNED NOT NULL DEFAULT '12',
  `dex` int(11) UNSIGNED NOT NULL DEFAULT '5',
  `luk` int(11) UNSIGNED NOT NULL DEFAULT '4',
  `int` int(11) UNSIGNED NOT NULL DEFAULT '4',
  `mp` int(11) UNSIGNED NOT NULL DEFAULT '5',
  `maxhp` int(11) UNSIGNED NOT NULL DEFAULT '50',
  `maxmp` int(11) UNSIGNED NOT NULL DEFAULT '5',
  `meso` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `hpMpUsed` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `job` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `skincolor` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `gender` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `fame` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `hair` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `face` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `ap` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `sp` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `map` int(10) UNSIGNED NOT NULL DEFAULT '10000',
  `spawnpoint` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `gm` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`accountid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- הוצאת מידע עבור טבלה `characters`
--

INSERT INTO `characters` (`id`, `accountid`, `world`, `name`, `level`, `exp`, `gachaexp`, `str`, `dex`, `luk`, `int`, `mp`, `maxhp`, `maxmp`, `meso`, `hpMpUsed`, `job`, `skincolor`, `gender`, `fame`, `hair`, `face`, `ap`, `sp`, `map`, `spawnpoint`, `gm`) VALUES
(8, 15, 0, 'BuBle', 1, 0, 0, 12, 5, 4, 4, 5, 50, 5, 0, 0, 0, 0, 0, 0, 30037, 20001, 0, 0, 0, 0, 0),
(9, 15, 0, 'asdas', 1, 0, 0, 12, 5, 4, 4, 5, 50, 5, 0, 0, 2000, 0, 0, 0, 30022, 20402, 0, 0, 914000000, 0, 0),
(10, 15, 0, 'tasdasd', 1, 0, 0, 12, 5, 4, 4, 5, 50, 5, 0, 0, 0, 0, 0, 0, 30000, 20001, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `inventoryequipment`
--

DROP TABLE IF EXISTS `inventoryequipment`;
CREATE TABLE IF NOT EXISTS `inventoryequipment` (
  `inventoryequipmentid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `inventoryitemid` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `upgradeslots` int(11) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT '0',
  `str` int(11) NOT NULL DEFAULT '0',
  `dex` int(11) NOT NULL DEFAULT '0',
  `int` int(11) NOT NULL DEFAULT '0',
  `luk` int(11) NOT NULL DEFAULT '0',
  `hp` int(11) NOT NULL DEFAULT '0',
  `mp` int(11) NOT NULL DEFAULT '0',
  `watk` int(11) NOT NULL DEFAULT '0',
  `matk` int(11) NOT NULL DEFAULT '0',
  `wdef` int(11) NOT NULL DEFAULT '0',
  `mdef` int(11) NOT NULL DEFAULT '0',
  `acc` int(11) NOT NULL DEFAULT '0',
  `avoid` int(11) NOT NULL DEFAULT '0',
  `hands` int(11) NOT NULL DEFAULT '0',
  `speed` int(11) NOT NULL DEFAULT '0',
  `jump` int(11) NOT NULL DEFAULT '0',
  `locked` int(11) NOT NULL DEFAULT '0',
  `vicious` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `itemlevel` int(11) NOT NULL DEFAULT '1',
  `itemexp` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `ringid` int(11) NOT NULL DEFAULT '-1',
  PRIMARY KEY (`inventoryequipmentid`),
  KEY `inventoryitemid` (`inventoryitemid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `inventoryitems`
--

DROP TABLE IF EXISTS `inventoryitems`;
CREATE TABLE IF NOT EXISTS `inventoryitems` (
  `inventoryitemid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` tinyint(3) UNSIGNED NOT NULL,
  `characterid` int(11) DEFAULT NULL,
  `accountid` int(11) DEFAULT NULL,
  `itemid` int(11) NOT NULL DEFAULT '0',
  `inventorytype` int(11) NOT NULL DEFAULT '0',
  `position` int(11) NOT NULL DEFAULT '0',
  `quantity` int(11) NOT NULL DEFAULT '0',
  `owner` text NOT NULL,
  `petid` int(11) NOT NULL DEFAULT '-1',
  `flag` int(11) NOT NULL,
  `expiration` bigint(20) NOT NULL DEFAULT '-1',
  `giftFrom` varchar(26) NOT NULL,
  PRIMARY KEY (`inventoryitemid`),
  KEY `FK_inventoryitems_1` (`characterid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
