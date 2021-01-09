create table module
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

create table signal_title
(
    id          serial                              not null
        constraint chart_title_pk
            primary key,
    name        varchar(250),
    description varchar,
    create_time timestamp default CURRENT_TIMESTAMP not null
);

create table signal_data
(
    id              serial  not null
        constraint chart_data_pk
            primary key,
    signal_title_id integer not null,
    x               numeric,
    y               numeric
);

INSERT INTO public.module (module, name, container, for_menu, transformer)
VALUES ('DummyTransformer', 'Dummy transformer', null, false, true);
INSERT INTO public.module (module, name, container, for_menu, transformer)
VALUES ('LinearAmp', 'Linear amplifier', 'right', false, true);
INSERT INTO public.module (module, name, container, for_menu, transformer)
VALUES ('Integrator', 'Integrator', null, false, true);
INSERT INTO public.module (module, name, container, for_menu, transformer)
VALUES ('Differentiator', 'Differentiator', null, false, true);
