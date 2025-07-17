-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: food_booking
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(20) DEFAULT 'ROLE_USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'admin','202cb962ac59075b964b07152d234b70','ROLE_ADMIN');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_products`
--

DROP TABLE IF EXISTS `booking_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_products` (
  `type` varchar(31) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `image_url` varchar(512) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_products`
--

LOCK TABLES `booking_products` WRITE;
/*!40000 ALTER TABLE `booking_products` DISABLE KEYS */;
INSERT INTO `booking_products` VALUES ('food',1,'Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh','http://localhost:8080/api/files/d21c0c62-f146-4283-9a1e-aaaef0350c78_exampleFood.png',0x01,'Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới',45000),('drink',3,'Lục Trà Macchiato - Size nhỏ #Dòng thức uống đặc trưng, không thêm topping, không dùng ống hút','http://localhost:8080/api/files/619eefea-3412-4b6e-bc9f-7757f86df33e_72ab8914216a1bce7215dff4d7d0c68657aecf67.png',0x00,'S-Green Tea Macchiato',51000),('food',4,'(Thịt đùi gà tươi đã rút xương + sốt nước mắm + hành tây + cơm + dưa leo + salad + canh)','http://localhost:8080/api/files/0a333835-a6f8-46de-bd0b-5c521d8e0971_f93227e6005185bd347971839a569488ab0a347a.png',0x00,'Cơm Gà Đùi Rút Xương Chiên Nước Mắm',60000),('food',5,'Đùi gà tươi góc 4 xối mỡ + Cơm + dưa leo + salad + canh','http://localhost:8080/api/files/be783e92-bfc6-4ad7-b564-7d1b5f8691b1_2d67141c6314cf77561caa94b59f694d8bb49b01.png',0x00,'Cơm Gà Đùi Góc Tư Xối Mỡ',60000),('food',6,'Cơm + gà tươi xối mỡ + salad + dưa leo + canh.','http://localhost:8080/api/files/c049ce7c-292f-49b9-a21d-a5f43a8409a3_e41d8fd8670458b2223db48f5f97c1615b77ab14.png',0x00,'Cơm Gà Xối Mỡ Nhỏ (Đùi Tỏi Hoặc Má Đùi Ngẫu nhiên)',60000),('food',7,'Cơm Chiên/ Đùi Góc Tư/ Sốt Mắm Tỏi/ Mix salad','http://localhost:8080/api/files/cb89b045-a47a-4c45-add3-1b930fc05091_3e3b16c236da6e712cdf8c9eeea10dec14a583af.png',0x00,'Cơm Chiên Đùi Gà Mắm Tỏi',55000),('food',8,'(Thịt đùi gà tươi đã rút xương + sốt nước mắm + hành tây + cơm + dưa leo + salad + canh)','http://localhost:8080/api/files/79b8e2f9-f75c-44dc-94bf-29dd1b141d36_f93227e6005185bd347971839a569488ab0a347a%20(1).png',0x00,'Cơm Gà Đùi Rút Xương Chiên Nước Mắm 2',35000),('food',9,'Đùi gà tươi góc 4 xối mỡ + Cơm + dưa leo + salad + canh','http://localhost:8080/api/files/63a0cd93-45d7-4d06-8cc6-4057cdf6a075_f93227e6005185bd347971839a569488ab0a347a%20(1).png',0x00,'Cơm Gà Đùi Rút Xương Chiên Nước Mắm 3',36000),('food',10,'Cơm Chiên Đùi Gà Xối Mỡ + Cải Chua','http://localhost:8080/api/files/0a0fa6bd-48e3-4b16-875b-e0a596fb4f83_1bca93c4686636d4fca8529d0e002012f927c6a0.png',0x01,'Combo Gà Xối Mỡ + Cải Chua - Bao Ngon 💥',89000),('food',11,'Thịt đùi gà tươi đã rút xương + sốt nước mắm + hành tây + cơm + dưa leo + salad + canh + dưa hấu','http://localhost:8080/api/files/97d39b22-d7a1-4f77-9fcd-f89a74968a3b_f93227e6005185bd347971839a569488ab0a347a%20(1).png',0x00,'Combo Gà Xối Mỡ + Cải Chua - Bao Ngon 💥 1',29000),('food',12,'Đùi gà tươi góc 4 xối mỡ + Cơm + dưa leo + salad + canh','http://localhost:8080/api/files/dadcee0e-aa61-4a97-9f13-7cd955cef9af_3e3b16c236da6e712cdf8c9eeea10dec14a583af.png',0x01,'Cơm Gà Đùi Rút Xương Chiên Nước Mắm 4',27000),('food',13,'(Thịt đùi gà tươi đã rút xương + sốt nước mắm + hành tây + cơm + dưa leo + salad + canh)','http://localhost:8080/api/files/548fd022-b78e-408e-b10b-a466d99f4e3f_f93227e6005185bd347971839a569488ab0a347a.png',0x01,'Combo Gà Xối Mỡ + Cải Chua - Bao Ngon 💥 5',30000),('food',14,'Đùi gà tươi góc 4 xối mỡ + Cơm + dưa leo + salad + canh','http://localhost:8080/api/files/d1d21809-2414-46b6-8d23-bfcb9942e7b5_1bca93c4686636d4fca8529d0e002012f927c6a0.png',0x00,'Cơm Gà Đùi Góc Tư Xối Mỡ 1',23000),('food',15,'Cơm Chiên Đùi Gà Xối Mỡ + Cải Chua','http://localhost:8080/api/files/12e9766b-f0f9-4155-82cc-89ec9ab3c1ae_3e3b16c236da6e712cdf8c9eeea10dec14a583af.png',0x00,'Combo Gà Xối Mỡ + Cải Chua - Bao Ngon 💥 90',43000),('food',16,'(Thịt đùi gà tươi đã rút xương + sốt nước mắm + hành tây + cơm + dưa leo + salad + canh)','http://localhost:8080/api/files/ade4fd9c-248b-4ee0-94c5-752054d9162c_f93227e6005185bd347971839a569488ab0a347a%20(1).png',0x00,'Cơm Gà Đùi Rút Xương Chiên Nước Mắm 1',24000),('drink',17,'Lục Trà Macchiato - Size vừa #Dòng thức uống đặc trưng, không thêm topping, không dùng ống hút','http://localhost:8080/api/files/00295542-8dd7-47bb-a079-64bbee8cc981_96378c951cba28a8851ff6bb6a37c8b6f5d335b2.png',0x00,'M-Green Tea Macchiato',60000),('drink',18,'Lục Trà Macchiato - Size lớn #Dòng thức uống đặc trưng, không thêm topping, không dùng ống hút','http://localhost:8080/api/files/78a74e0d-3bb3-43e1-91ab-3e641588eb0a_96636a2ca80da20c1df738114412cdc046fe7d31.png',0x00,'L-Green Tea Macchiato',86000),('drink',19,'Hồng Trà Macchiato - Size nhỏ #Dòng thức uống đặc trưng, không thêm topping, không dùng ống hút','http://localhost:8080/api/files/c07a2550-0339-4744-9568-db709b300a8c_d39f047767852537fa63fd80e6d9ca6ff347d634.png',0x00,'S-Black Tea Macchiato',50000),('drink',20,'Hồng Trà Macchiato - Size vừa #Dòng thức uống đặc trưng, không thêm topping, không dùng ống hút','http://localhost:8080/api/files/08b6efd3-2587-450f-862f-bbee6144c013_d39f047767852537fa63fd80e6d9ca6ff347d634%20(1).png',0x00,'M-Black Tea Macchiato',60000),('drink',21,'Lục Trà Mãng Cầu-Size Vừa','http://localhost:8080/api/files/ba3c30d4-552a-4b6f-a0d1-eb4307453d13_0b0a9c9022c9d0b79b70413dca8b003ba8dff420.png',0x00,'M-Soursop Green Tea',60000),('drink',22,'Hồng Trà Mãng Cầu-Size Vừa','http://localhost:8080/api/files/a3ef02fe-edf6-43c9-99e4-3fb3057593d8_3b861229d76608eeeca3e3943ed9ce385fd2ed0d.png',0x00,'M-Soursop Black Tea',70000),('drink',23,'Lục Trà Mãng Cầu-Size Nhỏ','http://localhost:8080/api/files/bb16541f-7c90-4c0b-938d-adaf895e2045_633690367d92aaff6d1699e83f42caec4c824cc9.png',0x00,'S-Soursop Green Tea',51000),('drink',24,'Hồng Trà Mãng Cầu-Size Lớn','http://localhost:8080/api/files/d2102683-8eb2-4318-9ae8-f19fd1f3a727_6ceb935d1478ea7b4a10451768cf1339fec96e3e.png',0x00,'L-Soursop Black Tea',86000),('drink',25,'Hồng Trà Mãng Cầu-Size Nhỏ','http://localhost:8080/api/files/997ec044-c6d0-42df-bdde-b1996d8b0439_848db6e4192fdbfcb9a65198138c841208855e29.png',0x00,'S-Soursop Black Tea',51000);
/*!40000 ALTER TABLE `booking_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_id` bigint NOT NULL,
  `booking_product_id` bigint NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `item_price` bigint NOT NULL,
  KEY `FKnlk3yygb8apt51gd2dt2gwige` (`booking_product_id`),
  KEY `FKjyu2qbqt8gnvno9oe9j2s2ldk` (`order_id`),
  CONSTRAINT `FKjyu2qbqt8gnvno9oe9j2s2ldk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FKnlk3yygb8apt51gd2dt2gwige` FOREIGN KEY (`booking_product_id`) REFERENCES `booking_products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_statuses`
--

DROP TABLE IF EXISTS `order_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_statuses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_statuses`
--

LOCK TABLES `order_statuses` WRITE;
/*!40000 ALTER TABLE `order_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `detail_address` varchar(100) DEFAULT NULL,
  `message` varchar(500) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `shipping_fee` bigint DEFAULT NULL,
  `total_price` bigint DEFAULT NULL,
  `order_status_id` bigint DEFAULT NULL,
  `province_id` bigint DEFAULT NULL,
  `ward_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcbbqf26brulgfgvd0mf74rv4y` (`order_status_id`),
  KEY `FKbbdd7dg6lysbwgtw66jdlg2bg` (`province_id`),
  KEY `FKec4jbind4ygtygb1f7cir13p4` (`ward_id`),
  CONSTRAINT `FKbbdd7dg6lysbwgtw66jdlg2bg` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`),
  CONSTRAINT `FKcbbqf26brulgfgvd0mf74rv4y` FOREIGN KEY (`order_status_id`) REFERENCES `order_statuses` (`id`),
  CONSTRAINT `FKec4jbind4ygtygb1f7cir13p4` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provinces`
--

DROP TABLE IF EXISTS `provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinces` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provinces`
--

LOCK TABLES `provinces` WRITE;
/*!40000 ALTER TABLE `provinces` DISABLE KEYS */;
INSERT INTO `provinces` VALUES (1,'Ho Chi Minh City'),(3,'Dak Lak'),(4,'Ha Noi City'),(5,'Quang Tri'),(6,'Ben Tre');
/*!40000 ALTER TABLE `provinces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wards`
--

DROP TABLE IF EXISTS `wards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `province_id` bigint DEFAULT NULL,
  `shipping_fee` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbwfs5nhey1leef1v5ydhb45j2` (`province_id`),
  CONSTRAINT `FKbwfs5nhey1leef1v5ydhb45j2` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wards`
--

LOCK TABLES `wards` WRITE;
/*!40000 ALTER TABLE `wards` DISABLE KEYS */;
INSERT INTO `wards` VALUES (1,'Tan Dinh',1,15000),(2,'Da Kao',1,16000),(3,'Ben Nghe',1,18000),(4,'Ben Thanh',1,27000),(5,'Cau Ong Lanh',1,10000),(6,'Ea Tam',3,28000),(7,'Hoa Thang',3,29000),(8,'An Binh',3,30000),(9,'Hoa Xuan',3,31000),(10,'Ea Sien',3,32000),(11,'Phuc Xa',4,32000),(12,'Lieu Giai',4,11000),(13,'Giang Vo',4,17000),(14,'Thanh Cong',4,29000),(15,'Hang Dao',4,20000),(16,'Gio An',5,40000),(17,'Trieu Nguyen',5,30000),(18,'Ba Nang',5,23000),(19,'Cam Lo',5,13000),(20,'Dien Sanh',5,26000),(21,'Phu Khuong',6,17000),(22,'My Thanh An',6,18000),(23,'Phu Tuc',6,34000),(24,'Quoi Thanh',6,35000),(25,'Phuoc Hanh',6,31000);
/*!40000 ALTER TABLE `wards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'food_booking'
--

--
-- Dumping routines for database 'food_booking'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-21 19:19:37
