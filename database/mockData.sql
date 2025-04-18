use examinator;

insert into korisnik (Ime, Prezime, Email) values
('Marko', 'Marković', 'marko.markovic@etf.unibl.org'),
('Jovana', 'Jovanović', 'jovana.jovanovic@etf.unibl.org'),
('Petar', 'Petrović', 'petar.petrovic@etf.unibl.org');

insert into predmet (Naziv, Sifra) values
('Programiranje 1', 2223),
('Programiranje 2', 2224),
('Programski jezici 2', 2225),
('Matematika 4', 2215);

insert into korisnik_predmet (IdKorisnika, IdPredmeta) values
(1, 1),
(1, 2),
(2, 3),
(3, 4);

insert into aktivnost (Naziv, SkraceniNaziv, MaksBrBodova, SkolskaGodina, IdPredmeta) values
('Kolokvijum 1', 'K1', 25, 2024, 1),
('Kolokvijum 2', 'K2', 25, 2024, 1),
('Projekat', 'PR', 50, 2024, 1),

('Kolokvijum 1', 'K1', 30, 2024, 2),
('Zavrsni ispit', 'ZI', 70, 2024, 2),

('Zadaca 1', 'Z1', 10, 2024, 3),
('Zadaca 2', 'Z2', 10, 2024, 3),
('Projekat', 'PR', 80, 2024, 3),

('Test 1', 'T1', 50, 2024, 4),
('Test 2', 'T2', 50, 2024, 4);


insert into student_predmet (SkolskaGodina, Indeks, Ime, Prezime, Grupa, Napomena, IdPredmeta) values
(2023, '1101/22', 'Marko', 'Jovanović', 'RA1', null, 1),
(2023, '1102/22', 'Ana', 'Petrović', 'RA1', null, 1),
(2023, '1103/22', 'Jelena', 'Nikolić', 'RA2', null, 1),
(2023, '1104/22', 'Ivan', 'Stojanov', 'RA2', null, 2),
(2023, '1105/22', 'Sara', 'Milovanović', 'RA1', null, 2),
(2023, '1106/22', 'Luka', 'Đorđević', 'RA3', null, 3),
(2023, '1107/22', 'Maja', 'Obradović', 'RA3', null, 3),
(2023, '1108/22', 'Nikola', 'Kovačević', 'RA1', null, 4),
(2023, '1109/22', 'Milica', 'Stefanović', 'RA2', null, 4),
(2023, '1110/22', 'Aleksandar', 'Ilić', 'RA3', null, 4),

(2024, '1111/22', 'Marko', 'Jovanović', 'RA1', null, 2),
(2024, '1112/22', 'Ana', 'Petrović', 'RA1', null, 2),
(2024, '1113/22', 'Jelena', 'Nikolić', 'RA2', null, 2),
(2024, '1114/22', 'Ivan', 'Stojanov', 'RA2', null, 3),
(2024, '1115/22', 'Sara', 'Milovanović', 'RA1', null, 3),
(2024, '1116/22', 'Luka', 'Đorđević', 'RA3', null, 4),
(2024, '1117/22', 'Maja', 'Obradović', 'RA3', null, 4),
(2024, '1118/22', 'Nikola', 'Kovačević', 'RA1', null, 1),
(2024, '1119/22', 'Milica', 'Stefanović', 'RA2', null, 1),
(2024, '1120/22', 'Aleksandar', 'Ilić', 'RA3', null, 1);


insert into formula (SkolskaGodina, Naziv, Izraz, IdPredmeta) values
(2024, 'Ukupan broj bodova P1', 'K1 + K2 + PR', 1),
(2024, 'Ukupan broj bodova P2', 'K1 + ZI', 2),
(2025, 'Ukupan broj bodova PJ2', 'D1 + D2 + PR', 3),
(2025, 'Ukupan broj bodova M4', 'T1 + T2', 4);

insert into rezultat (IdAktivnosti, IdStudentPredmet, Bodovi) values
(1, 1, 20),
(2, 1, 18),
(3, 1, 45),

(1, 2, 22),
(2, 2, 20),
(3, 2, 40),

(1, 3, 23),
(2, 3, 21),
(3, 3, 48),

(4, 4, 25),
(5, 4, 60),

(4, 5, 26),
(5, 5, 62),

(6, 6, 8),
(7, 6, 9),
(8, 6, 70),

(6, 7, 10),
(7, 7, 9),
(8, 7, 75),

(9, 8, 45),
(10, 8, 42);



