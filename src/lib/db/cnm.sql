-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 23, 2025 lúc 03:47 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- START TRANSACTION;
-- SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `cnm`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','client') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`id`, `person_id`, `username`, `password_hash`, `role`, `created_at`) VALUES
(1, 1, 'nguyenvana', '$2b$10$7iWrL.tHE3yPrFNOn5bqGeJOtasYgZpAB.DtS6bNmCtV07RsBM/xS', 'admin', '2025-03-19 08:47:59'),
(2, 2, 'tranthib', '$2b$10$IoZN9KzitHOJAPmfi4eWu.YnMt01hFSbHbEDsOFBIuV2.9txcNOy.', 'client', '2025-03-19 08:47:59'),
(3, 3, 'levanc', '$2b$10$PuQiww9OfBV70uKsBxGNV.ik5PMf8EsMxsTnc/FZPapzZfe3UQlM6', 'client', '2025-03-19 08:47:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `admin`
--

INSERT INTO `admin` (`id`, `person_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `showtime_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `booking_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `seat_id` int(11) NOT NULL,
  `status` enum('booked','available','cancelled') DEFAULT 'booked'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bookings`
--

INSERT INTO `bookings` (`id`, `client_id`, `showtime_id`, `total_price`, `booking_time`, `seat_id`, `status`) VALUES
(32, 2, 9, 5.00, '2025-03-23 11:36:48', 7, 'available'),
(33, 2, 9, 5.00, '2025-03-23 11:36:48', 8, 'available'),
(34, 2, 9, 5.00, '2025-03-23 11:36:48', 9, 'available'),
(35, 2, 9, 5.00, '2025-03-23 11:36:48', 10, 'available'),
(36, 2, 14, 5.00, '2025-03-23 11:38:23', 7, 'booked'),
(37, 2, 14, 5.00, '2025-03-23 11:38:23', 8, 'booked'),
(38, 2, 14, 5.00, '2025-03-23 11:38:23', 9, 'booked'),
(46, 2, 11, 5.00, '2025-03-23 12:04:20', 27, 'available'),
(47, 2, 11, 5.00, '2025-03-23 12:04:36', 25, 'booked'),
(48, 2, 11, 5.00, '2025-03-23 12:04:36', 26, 'booked');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `client`
--

INSERT INTO `client` (`id`, `person_id`, `account_id`) VALUES
(1, 2, 2),
(2, 3, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `release_date` date NOT NULL,
  `ticket_price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `movies`
--

INSERT INTO `movies` (`id`, `title`, `genre`, `duration`, `release_date`, `ticket_price`, `image_url`, `created_at`, `description`, `director`) VALUES
(5, 'Natra', 'Action', 120, '2025-03-24', 10.00, 'natra.jpg', '2025-03-20 04:25:50', 'An action fantasy film about the legend of Natra fighting against dark forces.', 'Li Bin'),
(6, 'Dune', 'Sci-Fi, Adventure', 155, '2025-03-25', 16.00, 'dune.jpg', '2025-03-20 04:25:50', 'The journey of Paul Atreides on the desert planet Arrakis, where he faces conspiracies and harsh challenges.', 'Denis Villeneuve'),
(7, 'Transformers', 'Action, Sci-Fi', 149, '2025-03-26', 13.00, 'transformers.jpg', '2025-03-20 04:25:50', 'Epic battles between Autobots and Decepticons in the war to protect Earth.', 'Michael Bay'),
(8, 'The Batman', 'Action, Crime', 176, '2025-03-27', 14.00, 'batman.jpg', '2025-03-20 04:25:50', 'Bruce Wayne faces dangerous enemies in Gotham while uncovering secrets about his family.', 'Matt Reeves'),
(9, 'John Wick', 'Action, Thriller', 101, '2025-03-25', 10.00, 'johnwick.jpg', '2025-03-20 04:25:50', 'A legendary assassin returns to seek revenge after losing his only loved one.', 'Chad Stahelski'),
(10, 'Wonder Woman', 'Action, Adventure', 141, '2025-03-25', 12.00, 'wonderwoman.jpg', '2025-03-20 04:25:50', 'The story of Amazonian warrior Diana and her journey to protect the world from war.', 'Patty Jenkins'),
(11, 'Spider-Man', 'Action, Sci-Fi', 132, '2025-05-15', 12.00, 'spider-man.jpg', '2025-03-20 04:25:50', 'Peter Parker becomes Spider-Man and faces dangerous villains in the city.', 'Jon Watts'),
(12, 'Avatar', 'Sci-Fi', 162, '2025-06-20', 15.00, 'avatar.jpg', '2025-03-20 04:25:50', 'A soldier is sent to Pandora and must choose between his military mission and his love for the Na’vi tribe.', 'James Cameron'),
(13, 'Godzilla vs Kong', 'Action', 113, '2025-07-10', 11.00, 'godzilla-vs-kong.jpg', '2025-03-20 04:25:50', 'Two legendary monsters clash in a battle that will determine the fate of Earth.', 'Adam Wingard'),
(14, 'Joker', 'Drama, Thriller', 122, '2025-08-01', 9.00, 'joker.jpg', '2025-03-20 04:25:50', 'The story of Arthur Fleck, a man rejected by society, who becomes a symbol of chaos.', 'Todd Phillips'),
(15, 'Black Panther', 'Action, Adventure', 134, '2025-09-12', 13.00, 'blackpanther.jpg', '2025-03-20 04:25:50', 'T’Challa returns to Wakanda to claim the throne and faces challenges to protect his homeland.', 'Ryan Coogler'),
(16, 'Avengers Endgame', 'Action, Sci-Fi', 181, '2025-10-20', 14.00, 'endgame.jpg', '2025-03-20 04:25:50', 'The final battle of the Avengers against Thanos to save the universe.', 'Anthony & Joe Russo'),
(17, 'Thor: Ragnarok', 'Fantasy, Action', 130, '2025-11-03', 10.00, 'thor.jpg', '2025-03-20 04:51:00', 'Thor must escape from Sakaar and prevent the apocalypse of Asgard.', 'Taika Waititi'),
(18, 'Titanic', 'Romance, Drama', 195, '2025-12-19', 8.00, 'titanic.jpg', '2025-03-20 04:51:00', 'A tragic love story between Jack and Rose aboard the doomed Titanic.', 'James Cameron'),
(19, 'Interstellar', 'Sci-Fi, Adventure', 169, '2025-03-29', 12.00, 'interstellar.jpg', '2025-03-20 04:51:00', 'A team of astronauts travels through a wormhole to find a new planet for humanity.', 'Christopher Nolan'),
(20, 'Doctor Strange', 'Action, Fantasy', 115, '2025-03-21', 11.00, 'doctorstrange.jpg', '2025-03-20 04:51:00', 'Doctor Stephen Strange learns to control magic and protect Earth from dark forces.', 'Scott Derrickson');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `person`
--

CREATE TABLE `person` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `person`
--

INSERT INTO `person` (`id`, `full_name`, `email`, `phone`, `address`, `avatar`, `created_at`) VALUES
(1, 'Nguyễn Văn A', 'a@gmail.com', '0912345678', 'Hà Nội, Việt Nam', 'avatar_a.jpg', '2025-03-19 08:47:59'),
(2, 'Trần Thị B', 'b@gmail.com', '0987654321', 'TP.HCM, Việt Nam', 'avatar_b.jpg', '2025-03-19 08:47:59'),
(3, 'Lê Văn C', 'c@gmail.com', '0923456789', 'Đà Nẵng, Việt Nam', 'avatar_c.jpg', '2025-03-19 08:47:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seats`
--

CREATE TABLE `seats` (
  `id` int(11) NOT NULL,
  `theater_id` int(11) NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 5.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `seats`
--

INSERT INTO `seats` (`id`, `theater_id`, `seat_number`, `price`) VALUES
(7, 1, 'A1', 5.00),
(8, 1, 'A2', 5.00),
(9, 1, 'A3', 5.00),
(10, 1, 'A4', 5.00),
(11, 1, 'A5', 5.00),
(12, 1, 'A6', 5.00),
(13, 1, 'A7', 5.00),
(14, 1, 'A8', 5.00),
(15, 1, 'A9', 5.00),
(16, 1, 'A10', 5.00),
(17, 1, 'B1', 5.00),
(18, 1, 'B2', 5.00),
(19, 1, 'B3', 5.00),
(20, 1, 'B4', 5.00),
(21, 1, 'B5', 5.00),
(22, 1, 'B6', 5.00),
(23, 1, 'B7', 5.00),
(24, 1, 'B8', 5.00),
(25, 1, 'B9', 5.00),
(26, 1, 'C1', 5.00),
(27, 1, 'C2', 5.00),
(28, 1, 'C3', 5.00),
(29, 1, 'C4', 5.00),
(30, 1, 'C5', 5.00),
(31, 1, 'C6', 5.00),
(32, 1, 'C7', 5.00),
(33, 1, 'C8', 5.00),
(34, 1, 'D1', 5.00),
(35, 1, 'D2', 5.00),
(36, 1, 'D3', 5.00),
(37, 1, 'D4', 5.00),
(38, 1, 'D5', 5.00),
(39, 1, 'D6', 5.00),
(40, 1, 'D7', 5.00),
(41, 1, 'E1', 5.00),
(42, 1, 'E2', 5.00),
(43, 1, 'E3', 5.00),
(44, 1, 'E4', 5.00),
(45, 1, 'E5', 5.00),
(46, 1, 'E6', 5.00),
(47, 2, 'A1', 5.00),
(48, 2, 'A2', 5.00),
(49, 2, 'A3', 5.00),
(50, 2, 'A4', 5.00),
(51, 2, 'A5', 5.00),
(52, 2, 'A6', 5.00),
(53, 2, 'A7', 5.00),
(54, 2, 'A8', 5.00),
(55, 2, 'A9', 5.00),
(56, 2, 'A10', 5.00),
(57, 2, 'B1', 5.00),
(58, 2, 'B2', 5.00),
(59, 2, 'B3', 5.00),
(60, 2, 'B4', 5.00),
(61, 2, 'B5', 5.00),
(62, 2, 'B6', 5.00),
(63, 2, 'B7', 5.00),
(64, 2, 'B8', 5.00),
(65, 2, 'B9', 5.00),
(66, 2, 'C1', 5.00),
(67, 2, 'C2', 5.00),
(68, 2, 'C3', 5.00),
(69, 2, 'C4', 5.00),
(70, 2, 'C5', 5.00),
(71, 2, 'C6', 5.00),
(72, 2, 'C7', 5.00),
(73, 2, 'C8', 5.00),
(74, 2, 'D1', 5.00),
(75, 2, 'D2', 5.00),
(76, 2, 'D3', 5.00),
(77, 2, 'D4', 5.00),
(78, 2, 'D5', 5.00),
(79, 2, 'D6', 5.00),
(80, 2, 'D7', 5.00),
(81, 2, 'E1', 5.00),
(82, 2, 'E2', 5.00),
(83, 2, 'E3', 5.00),
(84, 2, 'E4', 5.00),
(85, 2, 'E5', 5.00),
(86, 2, 'E6', 5.00),
(110, 2, 'A1', 5.00),
(111, 2, 'A2', 5.00),
(112, 2, 'A3', 5.00),
(113, 2, 'A4', 5.00),
(114, 2, 'A5', 5.00),
(115, 2, 'A6', 5.00),
(116, 2, 'A7', 5.00),
(117, 2, 'A8', 5.00),
(118, 2, 'A9', 5.00),
(119, 2, 'A10', 5.00),
(120, 2, 'B1', 5.00),
(121, 2, 'B2', 5.00),
(122, 2, 'B3', 5.00),
(123, 2, 'B4', 5.00),
(124, 2, 'B5', 5.00),
(125, 2, 'B6', 5.00),
(126, 2, 'B7', 5.00),
(127, 2, 'B8', 5.00),
(128, 2, 'B9', 5.00),
(129, 2, 'C1', 5.00),
(130, 2, 'C2', 5.00),
(131, 2, 'C3', 5.00),
(132, 2, 'C4', 5.00),
(133, 2, 'C5', 5.00),
(134, 2, 'C6', 5.00),
(135, 2, 'C7', 5.00),
(136, 2, 'C8', 5.00),
(137, 2, 'D1', 5.00),
(138, 2, 'D2', 5.00),
(139, 2, 'D3', 5.00),
(140, 2, 'D4', 5.00),
(141, 2, 'D5', 5.00),
(142, 2, 'D6', 5.00),
(143, 2, 'D7', 5.00),
(144, 2, 'E1', 5.00),
(145, 2, 'E2', 5.00),
(146, 2, 'E3', 5.00),
(147, 2, 'E4', 5.00),
(148, 2, 'E5', 5.00),
(149, 2, 'E6', 5.00),
(150, 3, 'A1', 5.00),
(151, 3, 'A2', 5.00),
(152, 3, 'A3', 5.00),
(153, 3, 'A4', 5.00),
(154, 3, 'A5', 5.00),
(155, 3, 'A6', 5.00),
(156, 3, 'A7', 5.00),
(157, 3, 'A8', 5.00),
(158, 3, 'A9', 5.00),
(159, 3, 'A10', 5.00),
(160, 3, 'B1', 5.00),
(161, 3, 'B2', 5.00),
(162, 3, 'B3', 5.00),
(163, 3, 'B4', 5.00),
(164, 3, 'B5', 5.00),
(165, 3, 'B6', 5.00),
(166, 3, 'B7', 5.00),
(167, 3, 'B8', 5.00),
(168, 3, 'B9', 5.00),
(169, 3, 'C1', 5.00),
(170, 3, 'C2', 5.00),
(171, 3, 'C3', 5.00),
(172, 3, 'C4', 5.00),
(173, 3, 'C5', 5.00),
(174, 3, 'C6', 5.00),
(175, 3, 'C7', 5.00),
(176, 3, 'C8', 5.00),
(177, 3, 'D1', 5.00),
(178, 3, 'D2', 5.00),
(179, 3, 'D3', 5.00),
(180, 3, 'D4', 5.00),
(181, 3, 'D5', 5.00),
(182, 3, 'D6', 5.00),
(183, 3, 'D7', 5.00),
(184, 3, 'E1', 5.00),
(185, 3, 'E2', 5.00),
(186, 3, 'E3', 5.00),
(187, 3, 'E4', 5.00),
(188, 3, 'E5', 5.00),
(189, 3, 'E6', 5.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `showtimes`
--

CREATE TABLE `showtimes` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `theater_id` int(11) NOT NULL,
  `showtime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `showtimes`
--

INSERT INTO `showtimes` (`id`, `movie_id`, `theater_id`, `showtime`) VALUES
(9, 5, 1, '2025-03-20 18:00:00'),
(10, 6, 2, '2025-03-20 20:00:00'),
(11, 7, 1, '2025-03-21 19:00:00'),
(12, 8, 3, '2025-03-22 21:00:00'),
(13, 5, 1, '2025-03-22 16:52:27'),
(14, 5, 1, '2025-03-25 16:52:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `theaters`
--

CREATE TABLE `theaters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` text NOT NULL,
  `total_seats` int(11) NOT NULL CHECK (`total_seats` > 0),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `theaters`
--

INSERT INTO `theaters` (`id`, `name`, `location`, `total_seats`, `created_at`) VALUES
(1, 'MMM Hà Nội', 'Hà Nội', 30, '2025-03-19 08:47:59'),
(2, 'MMM Hồ Chí Minh', 'TP.HCM', 30, '2025-03-19 08:47:59'),
(3, 'MMM Đà Nẵng', 'Đà Nẵng', 30, '2025-03-19 08:47:59');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `person_id` (`person_id`);

--
-- Chỉ mục cho bảng `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `showtime_id` (`showtime_id`);

--
-- Chỉ mục cho bảng `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Chỉ mục cho bảng `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Chỉ mục cho bảng `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `theater_id` (`theater_id`);

--
-- Chỉ mục cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `theater_id` (`theater_id`);

--
-- Chỉ mục cho bảng `theaters`
--
ALTER TABLE `theaters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT cho bảng `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `person`
--
ALTER TABLE `person`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=190;

--
-- AUTO_INCREMENT cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `theaters`
--
ALTER TABLE `theaters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`theater_id`) REFERENCES `theaters` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  ADD CONSTRAINT `showtimes_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `showtimes_ibfk_2` FOREIGN KEY (`theater_id`) REFERENCES `theaters` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
