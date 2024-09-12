\echo 'Delete and recreate recipegarden db?'
\prompt 'Return for yes or control-C to cancel >' foo

DROP DATABASE recipegarden;
CREATE DATABASE recipegarden;
\connect recipegarden

\i recipegarden-schema.sql

\echo 'Delete and recreate recipegarden_test db?'
\prompt 'Return for yes or control-C to cancel >' foo

DROP DATABASE recipegarden_test;
CREATE DATABASE recipegarden_test;
\connect recipegarden_test

\i recipegarden-schema.sql
