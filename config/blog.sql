/*
 Navicat MySQL Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80028
 Source Host           : localhost:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 80028
 File Encoding         : 65001

 Date: 17/03/2022 17:46:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标题',
  `summary` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '简介',
  `category_id` int(0) NULL DEFAULT NULL COMMENT '分类id',
  `category` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '分类',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '内容',
  `thumbnail` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '封面',
  `author_id` int(0) NULL DEFAULT NULL COMMENT '作者id',
  `author` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '作者',
  `hot` int(0) NULL DEFAULT NULL COMMENT '是否热门：1-是；0-否',
  `update_time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新时间',
  `publish_time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  `hits` int(0) NULL DEFAULT NULL COMMENT '点击量',
  `views` int(0) NULL DEFAULT NULL COMMENT '阅读量',
  `shares` int(0) NULL DEFAULT NULL COMMENT '转发量',
  `comments` int(0) NULL DEFAULT NULL COMMENT '评论量',
  `likes` int(0) NULL DEFAULT NULL COMMENT '收藏量',
  `opposes` int(0) NULL DEFAULT NULL COMMENT '狂踩量',
  `supports` int(0) NULL DEFAULT NULL COMMENT '点赞量',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '名称',
  `parent_id` int(0) NULL DEFAULT NULL COMMENT '父级分类id',
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像',
  `user_id` int(0) NULL DEFAULT NULL COMMENT '用户id',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '内容',
  `publish_time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  `article_id` int(0) NULL DEFAULT NULL COMMENT '文章id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '名称',
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像',
  `birthday` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '生日',
  `sex` int(0) NULL DEFAULT NULL COMMENT '性别：0-未知；1-男；2-女',
  PRIMARY KEY (`username`) USING BTREE,
  UNIQUE INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Function structure for query_category_child_list
-- ----------------------------
DROP FUNCTION IF EXISTS `query_category_child_list`;
delimiter ;;
CREATE FUNCTION `query_category_child_list`(`root_id` int)
 RETURNS varchar(4000) CHARSET utf8mb3
BEGIN
  DECLARE sTemp VARCHAR(4000);
  DECLARE sTempChd VARCHAR(4000);

  SET sTemp = '$';
  SET sTempChd = CAST(root_id AS CHAR);

  WHILE sTempChd IS NOT NULL DO
    SET sTemp = CONCAT(sTemp,',',sTempChd);
    SELECT GROUP_CONCAT(id) INTO sTempChd FROM category WHERE FIND_IN_SET(parent_id,sTempChd)>0;
  END WHILE;
  RETURN sTemp;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for query_category_parent_list
-- ----------------------------
DROP FUNCTION IF EXISTS `query_category_parent_list`;
delimiter ;;
CREATE FUNCTION `query_category_parent_list`(`root_id` int)
 RETURNS varchar(4000) CHARSET utf8mb3
BEGIN
	DECLARE sParentList VARCHAR(4000);
	DECLARE sParentTemp VARCHAR(4000);
	SET sParentTemp = CAST(root_id AS CHAR);
	WHILE sParentTemp IS NOT NULL DO
	IF (sParentList IS NOT NULL) THEN
	SET sParentList = CONCAT(sParentTemp,',',sParentList);
	ELSE
	SET sParentList = CONCAT(sParentTemp);
	END IF;
	SELECT GROUP_CONCAT(parent_id) INTO sParentTemp FROM category WHERE FIND_IN_SET(id,sParentTemp)>0;
	END WHILE;
	RETURN sParentList;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
