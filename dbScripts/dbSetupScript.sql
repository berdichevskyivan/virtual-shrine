CREATE TABLE users(
    id SERIAL,
    name TEXT,
    password TEXT,
    soul_energy INT DEFAULT 0,
    last_prayer_timestamp TIMESTAMP WITH TIME ZONE,
    last_candle_timestamp TIMESTAMP WITH TIME ZONE,
    last_bell_timestamp TIMESTAMP WITH TIME ZONE
);

CREATE TABLE prayers(
    id SERIAL,
    text TEXT,
    created_by INT,
    created_on TIMESTAMP WITH TIME ZONE
);

CREATE TABLE candles(
    id SERIAL,
    created_by INT,
    created_on TIMESTAMP WITH TIME ZONE
);

CREATE TABLE bells_rung(
    id SERIAL,
    bell_type TEXT,
    rung_by INT,
    rung_on TIMESTAMP WITH TIME ZONE
);

CREATE TABLE artifacts(
    id SERIAL,
    name TEXT,
    description TEXT,
    soul_energy_cost INT
);

CREATE TABLE user_artifacts(
    user_id INT,
    artifact_id INT,
    amount INT
);

CREATE TABLE library_books(
    id SERIAL,
    title TEXT
);