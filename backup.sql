--
-- PostgreSQL database dump
--

\restrict 39JhNYgWdvFfyi1bg0A2m3XgNFLcbpTm0074J5s7Y6aLnXboj7DJtHgVUqPhoVT

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: ams_user
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN 
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO ams_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_logs; Type: TABLE; Schema: public; Owner: ams_user
--

CREATE TABLE public.admin_logs (
    id integer NOT NULL,
    admin_id integer NOT NULL,
    action character varying(100) NOT NULL,
    entity_type character varying(50),
    entity_id integer,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying(45),
    user_agent text,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_logs OWNER TO ams_user;

--
-- Name: admin_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: ams_user
--

CREATE SEQUENCE public.admin_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_logs_id_seq OWNER TO ams_user;

--
-- Name: admin_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ams_user
--

ALTER SEQUENCE public.admin_logs_id_seq OWNED BY public.admin_logs.id;


--
-- Name: payment_history; Type: TABLE; Schema: public; Owner: ams_user
--

CREATE TABLE public.payment_history (
    id integer NOT NULL,
    payment_id integer NOT NULL,
    tenant_id integer NOT NULL,
    amount_paid numeric(10,2) NOT NULL,
    payment_date timestamp without time zone NOT NULL,
    payment_method character varying(50),
    transaction_id character varying(100),
    status character varying(50),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payment_history OWNER TO ams_user;

--
-- Name: payment_history_id_seq; Type: SEQUENCE; Schema: public; Owner: ams_user
--

CREATE SEQUENCE public.payment_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_history_id_seq OWNER TO ams_user;

--
-- Name: payment_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ams_user
--

ALTER SEQUENCE public.payment_history_id_seq OWNED BY public.payment_history.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: ams_user
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    due_date date NOT NULL,
    payment_date date,
    payment_method character varying(50),
    reference_number character varying(50),
    status character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO ams_user;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: ams_user
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO ams_user;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ams_user
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: ams_user
--

CREATE TABLE public.tenants (
    id integer NOT NULL,
    user_id integer,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    unit_number character varying(20) NOT NULL,
    unit_type character varying(50),
    lease_start_date date,
    lease_end_date date,
    rent_amount numeric(10,2),
    deposit_amount numeric(10,2),
    status character varying(50) DEFAULT 'active'::character varying,
    documents_url character varying(255),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tenants OWNER TO ams_user;

--
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: ams_user
--

CREATE SEQUENCE public.tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenants_id_seq OWNER TO ams_user;

--
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ams_user
--

ALTER SEQUENCE public.tenants_id_seq OWNED BY public.tenants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: ams_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'admin'::character varying,
    phone character varying(20),
    address character varying(255),
    is_active boolean DEFAULT true,
    lsat_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO ams_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: ams_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO ams_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ams_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: admin_logs id; Type: DEFAULT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.admin_logs ALTER COLUMN id SET DEFAULT nextval('public.admin_logs_id_seq'::regclass);


--
-- Name: payment_history id; Type: DEFAULT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.payment_history ALTER COLUMN id SET DEFAULT nextval('public.payment_history_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: tenants id; Type: DEFAULT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.tenants ALTER COLUMN id SET DEFAULT nextval('public.tenants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: admin_logs; Type: TABLE DATA; Schema: public; Owner: ams_user
--

COPY public.admin_logs (id, admin_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, notes, created_at) FROM stdin;
1	3	DATABASE_SEEDED	SYSTEM	\N	\N	\N	\N	\N	Database seeded with initial data	2026-03-20 21:43:19.02198
\.


--
-- Data for Name: payment_history; Type: TABLE DATA; Schema: public; Owner: ams_user
--

COPY public.payment_history (id, payment_id, tenant_id, amount_paid, payment_date, payment_method, transaction_id, status, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: ams_user
--

COPY public.payments (id, tenant_id, amount, due_date, payment_date, payment_method, reference_number, status, notes, created_at, updated_at) FROM stdin;
1	1	1200.00	2026-04-01	\N	\N	\N	pending	\N	2026-03-20 21:43:19.016662	2026-03-20 21:43:19.016662
2	2	1500.00	2026-04-01	\N	\N	\N	paid	\N	2026-03-20 21:43:19.020412	2026-03-20 21:43:19.020412
3	3	1000.00	2026-04-01	\N	\N	\N	pending	\N	2026-03-20 21:43:19.020878	2026-03-20 21:43:19.020878
4	4	1300.00	2026-04-01	\N	\N	\N	paid	\N	2026-03-20 21:43:19.021346	2026-03-20 21:43:19.021346
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: ams_user
--

COPY public.tenants (id, user_id, name, email, phone, unit_number, unit_type, lease_start_date, lease_end_date, rent_amount, deposit_amount, status, documents_url, notes, created_at, updated_at) FROM stdin;
1	3	John Doe	john.doe@example.com	555-1234	A101	apartment	\N	\N	1200.00	1200.00	active	\N	\N	2026-03-20 21:43:19.00104	2026-03-20 21:43:19.00104
2	3	Jane Smith	jane.smith@example.com	555-5678	B202	apartment	\N	\N	1500.00	1500.00	active	\N	\N	2026-03-20 21:43:19.007138	2026-03-20 21:43:19.007138
3	3	Bob Johnson	bob.johnson@example.com	555-9012	C303	apartment	\N	\N	1000.00	1000.00	active	\N	\N	2026-03-20 21:43:19.008172	2026-03-20 21:43:19.008172
4	3	Alice Williams	alice.williams@example.com	555-3456	D404	apartment	\N	\N	1300.00	1300.00	active	\N	\N	2026-03-20 21:43:19.009204	2026-03-20 21:43:19.009204
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ams_user
--

COPY public.users (id, name, email, password, role, phone, address, is_active, lsat_login, created_at, updated_at) FROM stdin;
3	Admin	admin@ams.com	$2b$10$fJoNlciPj5FRn9aWaJxeUOfBqkLfHt2GBvXrHPOBzR4L0cozWMxfm	admin	555-0001	\N	t	\N	2026-03-20 21:43:18.991151	2026-03-20 21:43:18.991151
\.


--
-- Name: admin_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ams_user
--

SELECT pg_catalog.setval('public.admin_logs_id_seq', 1, true);


--
-- Name: payment_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ams_user
--

SELECT pg_catalog.setval('public.payment_history_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ams_user
--

SELECT pg_catalog.setval('public.payments_id_seq', 4, true);


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ams_user
--

SELECT pg_catalog.setval('public.tenants_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ams_user
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: admin_logs admin_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT admin_logs_pkey PRIMARY KEY (id);


--
-- Name: payment_history payment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_email_key; Type: CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_email_key UNIQUE (email);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_unit_number_key; Type: CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_unit_number_key UNIQUE (unit_number);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_admin_logs_action; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_admin_logs_action ON public.admin_logs USING btree (action);


--
-- Name: idx_admin_logs_admin_id; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_admin_logs_admin_id ON public.admin_logs USING btree (admin_id);


--
-- Name: idx_admin_logs_created_at; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_admin_logs_created_at ON public.admin_logs USING btree (created_at);


--
-- Name: idx_admin_logs_entity_type; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_admin_logs_entity_type ON public.admin_logs USING btree (entity_type);


--
-- Name: idx_payment_history_created_at; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_payment_history_created_at ON public.payment_history USING btree (created_at);


--
-- Name: idx_payment_history_payment_date; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_payment_history_payment_date ON public.payment_history USING btree (payment_date);


--
-- Name: idx_payment_history_payment_id; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_payment_history_payment_id ON public.payment_history USING btree (payment_id);


--
-- Name: idx_payment_history_tenant_id; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_payment_history_tenant_id ON public.payment_history USING btree (tenant_id);


--
-- Name: idx_payments_due_date; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_payments_due_date ON public.payments USING btree (due_date);


--
-- Name: idx_payments_payment_date; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_payments_payment_date ON public.payments USING btree (payment_date);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- Name: idx_payments_tenant_id; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_payments_tenant_id ON public.payments USING btree (tenant_id);


--
-- Name: idx_tenants_email; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_tenants_email ON public.tenants USING btree (email);


--
-- Name: idx_tenants_status; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_tenants_status ON public.tenants USING btree (status);


--
-- Name: idx_tenants_unit_number; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_tenants_unit_number ON public.tenants USING btree (unit_number);


--
-- Name: idx_tenants_user_id; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_tenants_user_id ON public.tenants USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: ams_user
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- Name: payments update_payments_updated_at; Type: TRIGGER; Schema: public; Owner: ams_user
--

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tenants update_tenants_updated_at; Type: TRIGGER; Schema: public; Owner: ams_user
--

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: ams_user
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: admin_logs admin_logs_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT admin_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payment_history payment_history_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE CASCADE;


--
-- Name: payment_history payment_history_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: payments payments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenants tenants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ams_user
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO ams_user;


--
-- PostgreSQL database dump complete
--

\unrestrict 39JhNYgWdvFfyi1bg0A2m3XgNFLcbpTm0074J5s7Y6aLnXboj7DJtHgVUqPhoVT

