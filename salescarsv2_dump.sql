-- MySQL dump 10.13  Distrib 8.0.41, for Linux (aarch64)
--
-- Host: localhost    Database: usuariosbd
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `usuariosbd`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `usuariosbd` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `usuariosbd`;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (5,'p1225@ejemplo.com','pqttrvfd','3138295032','123456','user'),(6,'admisalecars@car.com','Maria V','123456789','thebestcars','admin'),(7,'test@salecars.co','Test User','3111111111','password123','user'),(13,'user1@salecars.co','User Uno','3111111111','userpass1','user'),(14,'user2@salecars.co','User Dos','3222222222','userpass2','user'),(15,'user3@salecars.co','User Tres','3333333333','userpass3','user'),(16,'user4@salecars.co','User Cuatro','3444444444','userpass4','user'),(17,'marna_de.valencia@uo.edu.co','maria','12345678910','123456789','user'),(18,'pruebauser@salecars.co','Prueba User','3001234567','mipasswordseguro','user'),(19,'juan@gmail.com','juan','3138295032','12345678','user'),(20,'nuevo@salecars.co','Nuevo Usuario','3009998888','nuevapass','user'),(21,'prueba10@salecars.co','Prueba Diez','3010000000','passprueba10','user'),(22,'prueba20@salecars.co','Prueba Veinte','3002020202','passprueba20','user'),(23,'prueba21@salecars.co','Prueba Veintiuno','3002121212','passprueba21','user'),(24,'m12@hmcecd.com','ma','3146896535','123456','user'),(25,'juanse1@hotmail.com','juanse','314579047593','123456','user'),(26,'josejose@13.com','jose jose','1234567890','123456','user'),(27,'miguel@pruebasql.com','Miguel SQL','31168904340','8b54f65c27548273619a98808b2a3f3273c50f7fd140a964457680579f2a41ef','usuario'),(28,'test@example.com','Usuario de prueba','3111234567','123456','user'),(29,'miguel@porfin.com','miguel','1234567890','123456','user'),(30,'ultimaprueba@gmail.com','ultimaprueba','1234567890','123456','user');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `vehiculosbd`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `vehiculosbd` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `vehiculosbd`;

--
-- Table structure for table `vehiculos`
--

DROP TABLE IF EXISTS `vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `modelo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `año` int DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `kilometraje` decimal(10,2) DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'disponible',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES (2,'Honda','Civic',2020,20000.00,10000.00,'vendido'),(3,'audi','Q1',2020,1550000.00,57777.00,'disponible'),(4,'Toyota','Corolla',2020,75000.00,NULL,'disponible'),(5,'Toyota','Corolla',2020,75000.00,NULL,'disponible'),(6,'Honda','Civic',2019,72000.00,NULL,'disponible'),(7,'Nissan','Altima',2021,85000.00,NULL,'disponible'),(8,'Ford','Focus',2018,68000.00,NULL,'disponible'),(9,'Chevrolet','Malibu',2022,90000.00,NULL,'disponible'),(10,'Toyota','Corolla',2020,75000.00,NULL,'disponible'),(11,'Honda','Civic',2019,72000.00,NULL,'disponible'),(12,'Nissan','Altima',2021,85000.00,NULL,'disponible'),(13,'Ford','Focus',2018,68000.00,NULL,'disponible'),(14,'Chevrolet','Malibu',2022,90000.00,NULL,'disponible'),(15,'audi','Q2',2024,8188181.00,69999.00,'disponible'),(16,'Toyota','Corolla',2020,25000.00,15000.00,'disponible'),(18,'mercedes','cla 200',2024,150000.00,200000.00,'disponible'),(19,'chevrolet','Tracker',2015,10000.00,65000.00,'disponible'),(20,'Mercedes-Benz','CLA 180',2020,20000.00,20000.00,'disponible'),(21,'Mercedes-Benz','CLA 180',2020,25000.00,200000.00,'disponible');
/*!40000 ALTER TABLE `vehiculos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-21 18:06:55
