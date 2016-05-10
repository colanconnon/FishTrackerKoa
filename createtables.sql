-- Table: public.fishcatch

-- DROP TABLE public.fishcatch;

CREATE TABLE public.fishcatch
(
  id integer NOT NULL DEFAULT nextval('fishcatch_id_seq'::regclass),
  latitude numeric(14,11),
  longitude numeric(14,11),
  details text,
  temperature integer,
  lake_id integer,
  user_id integer,
  CONSTRAINT fishcatch_pkey PRIMARY KEY (id),
  CONSTRAINT fishcatch_lake_id_fkey FOREIGN KEY (lake_id)
      REFERENCES public.lake (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fishcatch_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.fishcatch
  OWNER TO postgres;



-- Table: public.lake

-- DROP TABLE public.lake;

CREATE TABLE public.lake
(
  id integer NOT NULL DEFAULT nextval('lake_id_seq'::regclass),
  lakename character varying(255),
  user_id integer,
  CONSTRAINT lake_pkey PRIMARY KEY (id),
  CONSTRAINT lake_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.lake
  OWNER TO postgres;


-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  username character varying(100),
  hash character varying(255),
  CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.users
  OWNER TO postgres;
