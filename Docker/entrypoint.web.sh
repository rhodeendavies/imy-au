#!/bin/bash
set -e

figlet IMY Aurelia

# Bundle install
echo "Performing 'npm install'"
npm install

# Print banner
cat <<-EOF

*********************************************************************************************************************
**                                                Web server ready                                                 **
*********************************************************************************************************************
** run 'docker compose exec web npm run start' to start the dev web server                                         **
** run 'docker compose exec web npm run start-prod' to start the prod web server                                   **
*********************************************************************************************************************

EOF

exec "$@"
