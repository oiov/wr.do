UPDATE "users"
SET "active" = 0, "password" = NULL
WHERE "email" = 'admin@admin.com'
  AND "role" = 'ADMIN'
  AND "password" = 'c0025ebe2edf525367e859821ccac33a:95992aad7ca8dc7c51855859f7adaa6282b09439b3e138fde22aeeaa6864af0f43fdd297cc7409b24a011300c038ff4d7585f89019e7629120123ec947f62b15';
