

CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;


CREATE TABLE IF NOT EXISTS `mydb`.`Club` (
  `idClub` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NULL,
  `CellPhone` VARCHAR(45) NULL,
  `Email` VARCHAR(45) NULL,
  PRIMARY KEY (`idClub`),
  UNIQUE INDEX `idClub_UNIQUE` (`idClub` ASC) VISIBLE)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `mydb`.`Competition` (
  `idcompetition` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idcompetition`),
  UNIQUE INDEX `idcompetition_UNIQUE` (`idcompetition` ASC) VISIBLE,
  UNIQUE INDEX `Name_UNIQUE` (`Name` ASC) VISIBLE)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `mydb`.`Competition_has_User` (
  `Competition_idcompetition` INT NOT NULL,
  `User_iduser` INT NOT NULL,
  PRIMARY KEY (`Competition_idcompetition`, `User_iduser`),
  INDEX `fk_Competition_has_User_User1_idx` (`User_iduser` ASC) VISIBLE,
  INDEX `fk_Competition_has_User_Competition1_idx` (`Competition_idcompetition` ASC) VISIBLE,
  CONSTRAINT `fk_Competition_has_User_Competition1`
    FOREIGN KEY (`Competition_idcompetition`)
    REFERENCES `mydb`.`Competition` (`idcompetition`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Competition_has_User_User1`
    FOREIGN KEY (`User_iduser`)
    REFERENCES `mydb`.`User` (`iduser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `mydb`.`Event` (
  `idEvent` INT NOT NULL AUTO_INCREMENT,
  `Event` VARCHAR(45) NULL,
  PRIMARY KEY (`idEvent`),
  UNIQUE INDEX `idEvent_UNIQUE` (`idEvent` ASC) VISIBLE)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `mydb`.`Event_has_Partisipant` (
  `Event_idEvent` INT NOT NULL,
  `Partisipant_idPartisipant` INT NOT NULL,
  PRIMARY KEY (`Event_idEvent`, `Partisipant_idPartisipant`),
  INDEX `fk_Event_has_Partisipant_Partisipant1_idx` (`Partisipant_idPartisipant` ASC) VISIBLE,
  INDEX `fk_Event_has_Partisipant_Event1_idx` (`Event_idEvent` ASC) VISIBLE,
  CONSTRAINT `fk_Event_has_Partisipant_Event1`
    FOREIGN KEY (`Event_idEvent`)
    REFERENCES `mydb`.`Event` (`idEvent`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Event_has_Partisipant_Partisipant1`
    FOREIGN KEY (`Partisipant_idPartisipant`)
    REFERENCES `mydb`.`Partisipant` (`idPartisipant`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `mydb`.`Partisipant` (
  `idPartisipant` INT NOT NULL AUTO_INCREMENT,
  `LastName` VARCHAR(45) NULL,
  `FirstName` VARCHAR(45) NULL,
  `BirthYear` VARCHAR(45) NULL,
  `Division` VARCHAR(45) NULL,
  `Age_Category` VARCHAR(45) NULL,
  `Country` VARCHAR(45) NULL,
  `GeneratedNumber` INT NULL,
  `Club_idClub` INT NOT NULL,
  PRIMARY KEY (`idPartisipant`, `Club_idClub`),
  UNIQUE INDEX `idPartisipant_UNIQUE` (`idPartisipant` ASC) VISIBLE,
  INDEX `fk_Partisipant_Club1_idx` (`Club_idClub` ASC) VISIBLE,
  CONSTRAINT `fk_Partisipant_Club1`
    FOREIGN KEY (`Club_idClub`)
    REFERENCES `mydb`.`Club` (`idClub`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `mydb`.`Partisipant_has_Competition` (
  `Partisipant_idPartisipant` INT NOT NULL,
  `Competition_idcompetition` INT NOT NULL,
  PRIMARY KEY (`Partisipant_idPartisipant`, `Competition_idcompetition`),
  INDEX `fk_Partisipant_has_Competition_Competition1_idx` (`Competition_idcompetition` ASC) VISIBLE,
  INDEX `fk_Partisipant_has_Competition_Partisipant1_idx` (`Partisipant_idPartisipant` ASC) VISIBLE,
  CONSTRAINT `fk_Partisipant_has_Competition_Partisipant1`
    FOREIGN KEY (`Partisipant_idPartisipant`)
    REFERENCES `mydb`.`Partisipant` (`idPartisipant`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Partisipant_has_Competition_Competition1`
    FOREIGN KEY (`Competition_idcompetition`)
    REFERENCES `mydb`.`Competition` (`idcompetition`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `mydb`.`Score` (
  `idScore` INT NOT NULL AUTO_INCREMENT,
  `Execution` DOUBLE NULL,
  `Diffuculty` DOUBLE NULL,
  `Artistic Expression` DOUBLE NULL,
  `Total` DOUBLE NULL,
  `Event_idEvent` INT NOT NULL,
  PRIMARY KEY (`idScore`, `Event_idEvent`),
  UNIQUE INDEX `idScore_UNIQUE` (`idScore` ASC) VISIBLE,
  INDEX `fk_Score_Event1_idx` (`Event_idEvent` ASC) VISIBLE,
  CONSTRAINT `fk_Score_Event1`
    FOREIGN KEY (`Event_idEvent`)
    REFERENCES `mydb`.`Event` (`idEvent`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `mydb`.`User` (
  `iduser` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Username` VARCHAR(45) NULL,
  `Password` VARCHAR(45) NULL,+
  `Role` VARCHAR(45) NULL,
  PRIMARY KEY (`iduser`),
  UNIQUE INDEX `iduser_UNIQUE` (`iduser` ASC) VISIBLE)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `mydb`.`User_has_Score` (
  `User_iduser` INT NOT NULL,
  `Score_idScore` INT NOT NULL,
  PRIMARY KEY (`User_iduser`, `Score_idScore`),
  INDEX `fk_User_has_Score_Score1_idx` (`Score_idScore` ASC) VISIBLE,
  INDEX `fk_User_has_Score_User1_idx` (`User_iduser` ASC) VISIBLE,
  CONSTRAINT `fk_User_has_Score_User1`
    FOREIGN KEY (`User_iduser`)
    REFERENCES `mydb`.`User` (`iduser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_Score_Score1`
    FOREIGN KEY (`Score_idScore`)
    REFERENCES `mydb`.`Score` (`idScore`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

