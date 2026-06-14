--
-- PostgreSQL database dump
--

\restrict bDqLGQgupvGAOWpXOCQQt146SzHiqVd9u9hrpsoDeMIsbedke8098aeni4G4gum

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    telefono character varying(20) NOT NULL,
    dui character varying(20) NOT NULL,
    correo character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    departamento character varying(50) NOT NULL,
    distrito character varying(50),
    municipio character varying(50) NOT NULL,
    tipo character varying(100),
    nombre_artistico character varying(100),
    portafolio character varying(255),
    foto_logo character varying(255),
    portada character varying(255),
    spotify character varying(255),
    instagram character varying(100),
    youtube character varying(255),
    tiktok character varying(100),
    objetivo character varying(50),
    etiquetas text,
    created_at timestamp without time zone DEFAULT now(),
    biografia text,
    instrumentos_niveles text,
    disponible boolean DEFAULT true
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, nombre_completo, telefono, dui, correo, password, departamento, distrito, municipio, tipo, nombre_artistico, portafolio, foto_logo, portada, spotify, instagram, youtube, tiktok, objetivo, etiquetas, created_at, biografia, instrumentos_niveles, disponible) FROM stdin;
21	Cindy Ramirez	7769-3201	12354666-5	rachellramirez2030@gmail.com	$2b$10$JBosDJmH3syvFzOisgEmtOcIAqi7eRaecTof0LCfvdBNAnCR6sQmO	Usulután	Este	Usulután	artista	DarkCenys	https://portafolio-cindy-ramirez-2026.it.com/	uploads/foto_logo_1781389432704.png	uploads/portada_1781389436511.jpg	\N	\N	\N	\N	descubrir	["Pop","Metal","Piano","Bajo","Voz","Violín","En vivo","Dúo","Electrónico en vivo"]	2026-06-13 16:23:59.219227	Portafolio nada optimizado troste	\N	t
22	nahun ezequiel martinez argueta	74725100	98080980-9	nahunmartinez7692@gmail.com	$2b$10$qvJANZEcJ2pNw3NpDwVSTefzphqKbtzMLKchkgYAhNerMmDgCqJrG	Usulután	Oeste	Puerto El Triunfo	artista	Rayne_sv	https://portafolionahun.xyz/	uploads/foto_logo_1781407375277.jpeg	uploads/portada_1781407351021.jpg	https://portafolionahun.xyz/	nahun	https://www.youtube.com/@nahunmartinez4993	\N	descubrir	["Rock","Piano","En vivo","Festival","Streaming","Acústico","Batería","Electrónica","Guitarra","Teclado"]	2026-06-13 21:17:56.488261	hola mi nombre es nahun	{"Guitarra":"Intermedio","Piano":"Intermedio","Batería":"Avanzado","Teclado":"Básico"}	t
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 22, true);


--
-- Name: users users_correo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_correo_key UNIQUE (correo);


--
-- Name: users users_dui_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_dui_key UNIQUE (dui);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict bDqLGQgupvGAOWpXOCQQt146SzHiqVd9u9hrpsoDeMIsbedke8098aeni4G4gum

