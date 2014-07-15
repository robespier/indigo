#!/bin/bash

scp include/indigo.jsxinc root@centos-10:/dustbox/indigo/app/include/
scp bin/Run.jsx root@centos-10:/dustbox/indigo/app/bin/
scp bin/tests.js root@centos-10:/dustbox/indigo/app/bin/
rsync -r tests/ root@centos-10:/dustbox/indigo/app/tests/
