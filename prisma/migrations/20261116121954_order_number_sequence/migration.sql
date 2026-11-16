-- Order numbers come from a database sequence, so two customers checking out
-- at the same moment can never get the same number, and a number is never
-- reused after an order is deleted.
CREATE SEQUENCE IF NOT EXISTS "order_number_seq" START 1001;

-- Continue after any order numbers that already exist.
SELECT setval(
  '"order_number_seq"',
  GREATEST(
    1000,
    COALESCE((SELECT MAX(NULLIF(regexp_replace("number", '\D', '', 'g'), '')::int) FROM "Order"), 1000)
  ),
  true
);
