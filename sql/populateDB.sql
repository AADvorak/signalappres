drop table if exists public.module;

drop table if exists public.signal_data;

drop table if exists public.signal;

create table public.module
(
    id          serial  not null
        constraint module_pk
            primary key,
    module      varchar(50),
    name        varchar(250),
    container   varchar(50),
    for_menu    boolean not null,
    transformer boolean not null
);

create table public.signal
(
    id          serial                              not null
        constraint signal_pk
            primary key,
    name        varchar(250),
    description varchar,
    create_time timestamp default CURRENT_TIMESTAMP not null
);

create table public.signal_data
(
    id        serial  not null
        constraint signal_data_pk
            primary key,
    signal_id integer not null
        constraint signal_data_signal_id_fk
            references signal
            on update cascade on delete cascade,
    x         numeric,
    y         numeric
);

INSERT INTO public.module (module, name, container, for_menu, transformer)
VALUES ('DummyTransformer', 'Dummy transformer', null, false, true),
       ('LinearAmp', 'Linear amplifier', 'right', false, true),
       ('Integrator', 'Integrator', null, false, true),
       ('Differentiator', 'Differentiator', null, false, true),
       ('Inverter', 'Inverter', null, false, true),
       ('SpectrumAnalyser', 'Spectrum analyser', null, false, true),
       ('SelfCorrelator', 'Self correlator', null, false, true),
       ('LinearOscillator', 'Linear oscillator', 'right', false, true);
