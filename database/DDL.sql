drop schema if exists examinator;
create schema examinator;
use examinator;

create table korisnik (
IdKorisnika 	int 			auto_increment 	primary key,
Ime 			varchar(30) 	not null,
Prezime			varchar(30)		not null,
Email			varchar(50) 	not null
);

create table predmet (
IdPredmeta		int				auto_increment	primary key,
Naziv			varchar(50) 	not null,
Sifra			int				not null		unique
);

create table aktivnost (
IdAktivnosti	int				auto_increment	primary key,
Naziv 			varchar(50)		not null,
SkraceniNaziv	varchar(10)		not null,
MaksBrBodova	int				not null,
SkolskaGodina	int				not null,
IdPredmeta		int				not null,
constraint FK_aktivnost_predmet
foreign key (IdPredmeta)
references predmet(IdPredmeta)
on update cascade on delete cascade,							-- Prilikom update/delete predmeta, promjena se reflektuje i na aktivnost.
unique (SkraceniNaziv, IdPredmeta, SkolskaGodina)				-- U toku jedne skolske godine, za jedan predmet smije da postoji samo jedna aktivnost sa jednim skracenim nazivom!
);

create table student_predmet (
IdStudentPredmet	int				auto_increment	primary key,
SkolskaGodina		int				not null,
Indeks				varchar(10)		not null,
Ime					varchar(30)		not null,
Prezime				varchar(30) 	not null,
Grupa				varchar(5)		not null,
Napomena			text,
IdPredmeta			int				not null,
constraint FK_student_predmet_predmet
foreign key (IdPredmeta)
references predmet(IdPredmeta)
on update cascade on delete cascade,							-- Prilikom update/delete predmeta, promjena se reflektuje i na student_predmet.
unique (Indeks, IdPredmeta, SkolskaGodina)						-- Jedan student moze biti u jednoj godini samo jednom upisan na jedan predmet!
);

create table formula (
IdFormule		int 			auto_increment	primary key,
SkolskaGodina 	int				not null,
Naziv			varchar(30)		not null,
Izraz			varchar(100)	not null,
IdPredmeta		int				not null,
constraint FK_formula_predmet
foreign key (IdPredmeta)
references predmet(IdPredmeta)
on update cascade on delete cascade,							-- Prilikom update/delete predmeta, promjena se reflektuje i na formulu.
unique (SkolskaGodina, Naziv, IdPredmeta)						-- U okviru jedne sk. godine, moze postojati samo jedna formula sa datim nazivom na datom predmetu!	
);

create table rezultat (
IdAktivnosti		int,
IdStudentPredmet	int,
Bodovi				int 	not null,
primary key (IdAktivnosti, IdStudentPredmet),
constraint FK_rezultat_student_predmet
foreign key (IdStudentPredmet)
references student_predmet(IdStudentPredmet)
on update cascade on delete cascade,							-- Prilikom update/delete student_predmet, promjena se reflektuje i na rezultat.
constraint FK_rezultat_aktivnost
foreign key (IdAktivnosti)
references aktivnost(IdAktivnosti)
on update cascade on delete cascade								-- Prilikom update/delete aktivnosti, promjena se reflektuje i na rezultat.
); 

create table korisnik_predmet (
IdKorisnika		int,
IdPredmeta		int,
primary key (IdKorisnika, IdPredmeta)
);

