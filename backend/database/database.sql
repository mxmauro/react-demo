
-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `password` char(64) NOT NULL,
  `last_modification` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `k_users_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('mxmauro', '2961c5a0feb2a8c962decf37230d10a42a74a0b8ca7a38bd0a596f751157845a', NOW()));
