--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.2
-- Dumped by pg_dump version 9.5beta2

-- Started on 2016-05-10 20:00:04 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE docker;
--
-- TOC entry 2128 (class 1262 OID 16384)
-- Name: docker; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE docker WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE docker OWNER TO postgres;

\connect docker

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2129 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 186 (class 3079 OID 12361)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2131 (class 0 OID 0)
-- Dependencies: 186
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 185 (class 1259 OID 16418)
-- Name: fishcatch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE fishcatch (
    id integer NOT NULL,
    latitude numeric(14,11),
    longitude numeric(14,11),
    details text,
    temperature integer,
    lake_id integer,
    user_id integer
);


ALTER TABLE fishcatch OWNER TO postgres;

--
-- TOC entry 184 (class 1259 OID 16416)
-- Name: fishcatch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE fishcatch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fishcatch_id_seq OWNER TO postgres;

--
-- TOC entry 2132 (class 0 OID 0)
-- Dependencies: 184
-- Name: fishcatch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE fishcatch_id_seq OWNED BY fishcatch.id;


--
-- TOC entry 183 (class 1259 OID 16403)
-- Name: lake; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE lake (
    id integer NOT NULL,
    lakename character varying(255),
    user_id integer
);


ALTER TABLE lake OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 16401)
-- Name: lake_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE lake_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE lake_id_seq OWNER TO postgres;

--
-- TOC entry 2133 (class 0 OID 0)
-- Dependencies: 182
-- Name: lake_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE lake_id_seq OWNED BY lake.id;


--
-- TOC entry 181 (class 1259 OID 16387)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id integer NOT NULL,
    username character varying(100),
    hash character varying(255)
);


ALTER TABLE users OWNER TO postgres;

--
-- TOC entry 180 (class 1259 OID 16385)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- TOC entry 2134 (class 0 OID 0)
-- Dependencies: 180
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 2000 (class 2604 OID 16421)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY fishcatch ALTER COLUMN id SET DEFAULT nextval('fishcatch_id_seq'::regclass);


--
-- TOC entry 1999 (class 2604 OID 16406)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY lake ALTER COLUMN id SET DEFAULT nextval('lake_id_seq'::regclass);


--
-- TOC entry 1998 (class 2604 OID 16390)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2006 (class 2606 OID 16426)
-- Name: fishcatch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY fishcatch
    ADD CONSTRAINT fishcatch_pkey PRIMARY KEY (id);


--
-- TOC entry 2004 (class 2606 OID 16408)
-- Name: lake_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY lake
    ADD CONSTRAINT lake_pkey PRIMARY KEY (id);


--
-- TOC entry 2002 (class 2606 OID 16392)
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2008 (class 2606 OID 16427)
-- Name: fishcatch_lake_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY fishcatch
    ADD CONSTRAINT fishcatch_lake_id_fkey FOREIGN KEY (lake_id) REFERENCES lake(id);


--
-- TOC entry 2009 (class 2606 OID 16432)
-- Name: fishcatch_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY fishcatch
    ADD CONSTRAINT fishcatch_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- TOC entry 2007 (class 2606 OID 16409)
-- Name: lake_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY lake
    ADD CONSTRAINT lake_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- TOC entry 2130 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-05-10 20:00:04 EDT

--
-- PostgreSQL database dump complete
--

