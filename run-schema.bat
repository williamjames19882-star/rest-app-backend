@echo off
echo Creating database tables on Railway MySQL...
mysql -h gondola.proxy.rlwy.net -P 10489 -u root -pauIxPbisSsrsEJMOIAdtWPpepNNKNkDE railway < database.sql
echo Done!
pause

