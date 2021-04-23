CREATE TABLE Temporada(
    idTemporada NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    Año NUMBER,
    Estado VARCHAR(20)
);

CREATE TABLE Jornada(
    idJornada NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    idTemporada NUMBER NOT NULL,
    Nombre VARCHAR(20),
    Estado VARCHAR(20),
    
    CONSTRAINT FK_idTemporada
    FOREIGN KEY (idTemporada)
    REFERENCES Temporada(idTemporada)
);

CREATE TABLE Deporte(
    idDeporte NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    Nombre VARCHAR(20),
    Imagen BLOB,
    Color VARCHAR(20)
);

CREATE TABLE Equipo(
    idEquipo NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    Nombre VARCHAR(20),
    idDeporte NUMBER NOT NULL,
    
    CONSTRAINT FK_idDeporte
    FOREIGN KEY (idDeporte)
    REFERENCES Deporte(idDeporte)
);

CREATE TABLE Membresia(
    idMembresia NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    Nombre VARCHAR(20),
    Precio NUMBER
);

CREATE TABLE Evento(
    idEvento NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    Nombre VARCHAR(20),
    idJornada NUMBER NOT NULL,
    idLocal NUMBER NOT NULL,
    idVisitante NUMBER NOT NULL,
    Fecha DATE,
    LocalRes NUMBER,
    VisitanteRes NUMBER,
    
    CONSTRAINT FK_idJornada
    FOREIGN KEY (idJornada)
    REFERENCES Jornada(idJornada),
    
    CONSTRAINT FK_idLocal
    FOREIGN KEY (idLocal)
    REFERENCES Equipo(idEquipo),
    
    CONSTRAINT FK_idVisitante
    FOREIGN KEY (idVisitante)
    REFERENCES Equipo(idEquipo)
);

CREATE TABLE Cliente (
    idCliente NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    Username VARCHAR(20),
    Passwd VARCHAR(50),
    Nombre VARCHAR(100),
    Apellido VARCHAR(100),
    idMembresia NUMBER,
    FechaNacimiento DATE,
    FechaRegistro DATE,
    Email VARCHAR(100),
    Foto BLOB,
    
    CONSTRAINT FK_idMembresia
    FOREIGN KEY (idMembresia)
    REFERENCES Membresia(idMembresia)
);

CREATE TABLE Prediccion(
    idPrediccion NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    LocalRes NUMBER NOT NULL,
    VisitanteRes NUMBER NOT NULL,
    idEvento NUMBER NOT NULL,
    idCliente NUMBER NOT NULL,
    
    CONSTRAINT FK_idEvento
    FOREIGN KEY (idEvento)
    REFERENCES Evento(idEvento),
    
    CONSTRAINT FK_idCliente
    FOREIGN KEY (idCliente)
    REFERENCES Cliente(idCliente)
);

CREATE TABLE Recompensa(
    idRecompensa NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    idCliente NUMBER NOT NULL,
    idMembresia NUMBER NOT NULL,
    Total NUMBER NOT NULL,
    Ultimo NUMBER NOT NULL,
    Incremento NUMBER NOT NULL,
    
    CONSTRAINT FK2_idCliente
    FOREIGN KEY (idCliente)
    REFERENCES Cliente(idCliente)
);

CREATE TABLE Mensaje(
    idMensaje NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    idEmisor NUMBER NOT NULL,
    idReceptor NUMBER NOT NULL,
    Contenido NUMBER NOT NULL,
    Fecha DATE,
    
    CONSTRAINT FK_idEmisor
    FOREIGN KEY (idEmisor)
    REFERENCES Cliente(idCliente),
    
    CONSTRAINT FK_idReceptor
    FOREIGN KEY (idReceptor)
    REFERENCES Cliente(idCliente)
);

