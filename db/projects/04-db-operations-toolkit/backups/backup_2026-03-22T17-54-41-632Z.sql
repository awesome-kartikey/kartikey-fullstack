--
-- PostgreSQL database dump
--

\restrict ky6Yej4BkNFuiqqxwRxpfiHMArHv6LwoC15IzYVOZs8VzcRmrp60gcXi72gtE2s

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: kartikey
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO kartikey;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: kartikey
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: kartikey
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'user'::text
);


ALTER TABLE public.users OWNER TO kartikey;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: kartikey
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO kartikey;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kartikey
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: kartikey
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: kartikey
--

COPY public.users (id, email, role) FROM stdin;
1	admin@company.com	admin
2	user@company.com	user
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kartikey
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: kartikey
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: kartikey
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: kartikey
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict ky6Yej4BkNFuiqqxwRxpfiHMArHv6LwoC15IzYVOZs8VzcRmrp60gcXi72gtE2s

