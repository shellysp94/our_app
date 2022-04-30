DROP DATABASE IF EXISTS users_db;
CREATE DATABASE users_db; 
USE users_db;

SET NAMES utf8 ;
SET character_set_client = utf8mb4 ;

CREATE TABLE Users (
  user_id int NOT NULL AUTO_INCREMENT unique,
  email varchar(500) not null,
  password varchar(500) not null,
  socket_id int not null default '0',
  login_status tinyint not null default '0',
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Connections (
  user_A_id int NOT NULL,
  user_B_id int NOT NULL,
  connected tinyint not null default '0',
  creation_date date not null,
  last_update date not null,
  PRIMARY KEY (user_A_id, user_B_id),
  foreign key (user_A_id) references Users (user_id),
  foreign key (user_B_id) references Users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Chats (
  create_date date not null,
  user_A_id int NOT NULL,
  user_B_id int NOT NULL,
  foreign key (user_A_id) references connections (user_A_id),
  foreign key (user_B_id) references connections (user_B_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE Notifications (
  notification_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  content varchar(5000) NOT NULL,
  sent_from int NOT NULL,
  creation_date date NOT NULL,
  seen tinyint not null default '0',
  PRIMARY KEY (notification_id),
  foreign key (user_id) references Users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE user_configuration (
  user_id int NOT NULL,
  first_name varchar(100),
  last_name varchar(100),
  date_of_birth DATE,
  city varchar(200),
  gender enum('Woman','Man', 'prefer not to say') default 'prefer not to say', 
  phone_number varchar(11),
  registration_date DATE,
  relationship_status enum('Did not choose yet', 'Divorced', 'Engaged', 'In a relationship', 'In an open relationship', 'Married', 'Single' , 'Widowed') default 'Did not choose yet',
  sexual_orientation enum('Heterosexual','Bisexual','Homosexual','Pansexual', 'Asexual','prefer not define') default 'prefer not define',
  profession varchar(200),
  pronoun enum('she/her','he/him','they/them','prefer not to say') default 'prefer not to say',
  hobbies set('Did not choose yet', 'basketball', 'beach volleyball', 'crossfit', 'dancing', 'football/soccer', 'gym workout', 'hiking', 'pilates', 'running', 'slacklining', 'surfing', 'swimming', 'tennis', 'yoga',
  'baking', 'cooking', 'eating outside', 'interested in culinary', 'interesting in nutrition',
  'playing drums', 'playing guitar', 'playing in a band', 'playing piano', 'playing synthesizer', 'singing',
  'acting', 'fashion designing', 'handicraft', 'home decorating', 'juggling', 'painting',
  'blogging', 'interested in medicine and biology', 'learning new languages', 'listening to podcasts', 'playing chess', 'puzzling', 'reading', 'writing',
  'coding', 'hacking', 'playing video games',
  'camping', 'gardening', 'sailing', 'skippering', 'shopping', 'tanning', 'traveling') default 'Did not choose yet',
  radius int,
  longitude DECIMAL(8,6),
  latitude DECIMAL(8,6),
  PRIMARY KEY (user_id),
  foreign key (user_id) references Users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Filters (
  user_id int not null,
  search_mode enum('Whatever', 'Beer', 'Study', 'Food', 'Training', 'Coffee', 'Shopping') default 'Whatever',
  hobbies_filter set('Did not choose yet', 'basketball', 'beach volleyball', 'crossfit', 'dancing', 'football/soccer', 'gym workout', 'hiking', 'pilates', 'running', 'slacklining', 'surfing', 'swimming', 'tennis', 'yoga',
  'baking', 'cooking', 'eating outside', 'interested in culinary', 'interesting in nutrition',
  'playing drums', 'playing guitar', 'playing in a band', 'playing piano', 'playing synthesizer', 'singing',
  'acting', 'fashion designing', 'handicraft', 'home decorating', 'juggling', 'painting',
  'blogging', 'interested in medicine and biology', 'learning new languages', 'listening to podcasts', 'playing chess', 'puzzling', 'reading', 'writing',
  'coding', 'hacking', 'playing video games',
  'camping', 'gardening', 'sailing', 'skippering', 'shopping', 'tanning', 'traveling') default 'Did not choose yet',
  gender_filter set('Did not choose yet', 'Men', 'Women', 'All') default 'Did not choose yet',
  relationship_filter set('Did not choose yet', 'Divorced', 'Engaged', 'In a relationship', 'In an open relationship', 'Married', 'Single' , 'Widowed') default 'Did not choose yet',
  interesting_in_filter set('Did not choose yet', 'Friends','Hookup', 'Long term relationship', 'Short term relationship', 'Sport buddy', 'Study buddy', 'Work buddy') default 'Did not choose yet',
  age_filter JSON,
  friends_only_filter tinyint not null default '0',
  primary key (user_id),
  foreign key (user_id) references Users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

 CREATE TABLE User_pictures (
  user_id int not null,
  image varchar(50),
  main_image enum('0', '1'),
  foreign key (user_id) references Users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;